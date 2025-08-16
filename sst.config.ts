/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "jared-connor-site",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-west-2",
          // Don't use profile in CI/CD
          profile: process.env.GITHUB_ACTIONS ? undefined : undefined,
        },
      },
    };
  },
  async run() {
    console.log(`Starting SST deployment for stage: ${$app.stage}...`);
    
    // Environment-specific configuration
    const isProd = $app.stage === "production";
    const isStaging = $app.stage === "staging";
    const isDev = $app.stage === "development";
    
    // Secrets - create once, reference multiple times
    const databaseUrl = new sst.Secret("DatabaseUrl");
    const nextAuthSecret = new sst.Secret("NextAuthSecret");
    const payloadSecret = new sst.Secret("PayloadSecret");

    // S3 bucket for media storage - simplified configuration
    const mediaBucket = new sst.aws.Bucket("MediaBucket", {
      public: false,
    });

    // Simple API using optimized Lambda (smaller bundle, faster cold starts)
    const api = new sst.aws.Function("Api", {
      handler: "apps/backend/src/lambda.handler",
      runtime: "nodejs20.x",
      timeout: "30 seconds", // Reduced timeout to fail fast
      memory: "1024 MB", // Reduced memory for faster cold starts
      architecture: "arm64",
      link: [mediaBucket],
      environment: {
        DATABASE_URL: databaseUrl.value,
      },
      url: true,
    });

    // CMS - Simplified Next.js deployment (moved before landing page)
    const cmsApp = new sst.aws.Nextjs("CmsApp", {
      path: "apps/cms",
      link: [mediaBucket, api],
      environment: {
        DATABASE_URL: databaseUrl.value,
        PAYLOAD_SECRET: payloadSecret.value,
        MEDIA_BUCKET_NAME: mediaBucket.name,
      },
      domain: isProd
        ? "cms.jaredconnor.dev"
        : undefined, // Disable custom domains for staging and development
      transform: {
        server: {
          architecture: "arm64",
          timeout: "60 seconds", // Slightly longer for CMS operations
          memory: "2048 MB", // Sufficient for PayloadCMS
        }
      }
    });

    // Landing Page - Static site with CMS integration
    const landingPage = new sst.aws.StaticSite("LandingPage", {
      path: "apps/landing",
      build: {
        command: "pnpm build",
        output: "dist",
      },
      environment: {
        // Provide CMS URL for build-time data fetching
        PAYLOAD_API_URL: isProd
          ? "https://cms.jaredconnor.dev/api"
          : $interpolate`https://${cmsApp.url}/api`,
        NODE_ENV: isProd ? "production" : (isStaging ? "staging" : "development"),
      },
      domain: isProd 
        ? {
            name: "jaredconnor.dev",
            redirects: ["www.jaredconnor.dev"],
          }
        : undefined, // Disable custom domains for staging and development
    });

    // Blog - Simplified Next.js deployment with smaller bundle
    const blogApp = new sst.aws.Nextjs("BlogApp", {
      path: "apps/blog",
      link: [api, mediaBucket],
      environment: {
        DATABASE_URL: databaseUrl.value,
        NEXTAUTH_SECRET: nextAuthSecret.value,
        NEXTAUTH_URL: isProd
          ? "https://blog.jaredconnor.dev"
          : `https://${$app.name}-blogapp-${$app.stage}.vercel.app`, // Use predictable URL pattern for non-prod
      },
      domain: isProd
        ? "blog.jaredconnor.dev"
        : undefined, // Disable custom domains for staging and development
      transform: {
        server: {
          architecture: "arm64",
          timeout: "30 seconds", // Reduced timeout
          memory: "1536 MB", // Reduced memory
        }
      }
    });


    console.log(`SST deployment complete for ${$app.stage}!`);
    
    // Log deployment URLs for easy access
    if (isProd) {
      console.log("🚀 Production URLs:");
      console.log("  Landing: https://jaredconnor.dev");
      console.log("  Blog: https://blog.jaredconnor.dev");
      console.log("  CMS: https://cms.jaredconnor.dev");
    } else {
      console.log(isStaging ? "🧪 Staging URLs:" : "🛠️ Development URLs:");
      console.log(`  Landing: ${landingPage.url}`);
      console.log(`  Blog: ${blogApp.url}`);
      console.log(`  CMS: ${cmsApp.url}`);
    }
    
    return {
      stage: $app.stage,
      api: api.url,
      landing: landingPage.url,
      blog: blogApp.url,
      cms: cmsApp.url,
      mediaBucket: mediaBucket.name,
    };
  },
});