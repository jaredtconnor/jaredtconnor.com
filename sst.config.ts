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
        },
      },
    };
  },
  async run() {
    console.log("Starting optimized SST deployment...");
    
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
      domain: $app.stage === "production" 
        ? {
            name: "jaredconnor.dev",
            redirects: ["www.jaredconnor.dev"],
          }
        : undefined,
    });

    // Blog - Simplified Next.js deployment with smaller bundle
    const blogApp = new sst.aws.Nextjs("BlogApp", {
      path: "apps/blog",
      link: [api, mediaBucket],
      environment: {
        DATABASE_URL: databaseUrl.value,
        NEXTAUTH_SECRET: nextAuthSecret.value,
        NEXTAUTH_URL: $app.stage === "production" 
          ? "https://blog.jaredconnor.dev" 
          : "http://localhost:3002",
      },
      domain: $app.stage === "production" 
        ? "blog.jaredconnor.dev" 
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
      domain: $app.stage === "production" 
        ? "cms.jaredconnor.dev" 
        : undefined,
      transform: {
        server: {
          architecture: "arm64",
          timeout: "60 seconds", // Slightly longer for CMS operations
          memory: "2048 MB", // Sufficient for PayloadCMS
        }
      }
    });

    console.log("Optimized SST deployment configuration complete!");
    return {
      api: api.url,
      landing: landingPage.url,
      blog: blogApp.url,
      cms: cmsApp.url,
      mediaBucket: mediaBucket.name,
    };
  },
});