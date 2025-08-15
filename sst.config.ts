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

    // Landing Page - Simple static site
    const landingPage = new sst.aws.StaticSite("LandingPage", {
      path: "apps/landing",
      build: {
        command: "pnpm build",
        output: "dist",
      },
      domain: isProd 
        ? {
            name: "jaredconnor.dev",
            redirects: ["www.jaredconnor.dev"],
          }
        : isStaging
        ? "staging.jaredconnor.dev"
        : undefined,
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
          : isStaging
          ? "https://blog-staging.jaredconnor.dev"
          : "http://localhost:3002",
      },
      domain: isProd
        ? "blog.jaredconnor.dev"
        : isStaging
        ? "blog-staging.jaredconnor.dev"
        : undefined,
      transform: {
        server: {
          architecture: "arm64",
          timeout: "30 seconds", // Reduced timeout
          memory: "1536 MB", // Reduced memory
        }
      }
    });

    // CMS - Simplified Next.js deployment
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
        : isStaging
        ? "cms-staging.jaredconnor.dev"
        : undefined,
      transform: {
        server: {
          architecture: "arm64",
          timeout: "60 seconds", // Slightly longer for CMS operations
          memory: "2048 MB", // Sufficient for PayloadCMS
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
    } else if (isStaging) {
      console.log("🧪 Staging URLs:");
      console.log("  Landing: https://staging.jaredconnor.dev");
      console.log("  Blog: https://blog-staging.jaredconnor.dev");
      console.log("  CMS: https://cms-staging.jaredconnor.dev");
    } else {
      console.log("🛠️ Development URLs:");
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