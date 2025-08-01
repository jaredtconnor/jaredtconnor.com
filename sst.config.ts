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
    // S3 bucket for media storage
    const mediaBucket = new sst.aws.Bucket("MediaBucket", {
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: ["GET", "POST", "PUT", "DELETE"],
          allowedOrigins: $app.stage === "production" 
            ? ["https://jaredconnor.dev", "https://blog.jaredconnor.dev"] 
            : ["*"],
          maxAge: 3000,
        },
      ],
    });

    // API/Backend (Express.js with tRPC)
    const api = new sst.aws.Function("Api", {
      handler: "apps/backend/src/lambda.handler",
      runtime: "nodejs20.x",
      timeout: "30 seconds",
      memory: "1024 MB",
      environment: {
        // Use Neon PostgreSQL (external service)
        DATABASE_URL: new sst.Secret("DatabaseUrl").value,
        MEDIA_BUCKET_NAME: mediaBucket.name,
        NODE_ENV: $app.stage === "production" ? "production" : "development",
      },
      url: true,
    });

    // Landing Page (Astro) - Static Site
    const landingPage = new sst.aws.Astro("LandingPage", {
      path: "apps/landing",
      environment: {
        PUBLIC_API_URL: api.url,
      },
      domain: $app.stage === "production" 
        ? {
            name: "jaredconnor.dev",
            redirects: ["www.jaredconnor.dev"],
          }
        : undefined,
    });

    // Blog (Next.js) - SSR/SSG
    const blogApp = new sst.aws.Nextjs("BlogApp", {
      path: "apps/blog",
      environment: {
        DATABASE_URL: new sst.Secret("DatabaseUrl").value,
        API_URL: api.url,
        NEXTAUTH_SECRET: new sst.Secret("NextAuthSecret").value,
        NEXTAUTH_URL: $app.stage === "production" 
          ? "https://blog.jaredconnor.dev" 
          : `https://${$app.name}-${$app.stage}-blog.vercel.app`,
      },
      domain: $app.stage === "production" 
        ? "blog.jaredconnor.dev" 
        : undefined,
    });

    // CMS (PayloadCMS) - Next.js App
    const cmsApp = new sst.aws.Nextjs("CmsApp", {
      path: "apps/cms",
      environment: {
        DATABASE_URL: new sst.Secret("DatabaseUrl").value,
        PAYLOAD_SECRET: new sst.Secret("PayloadSecret").value,
        MEDIA_BUCKET_NAME: mediaBucket.name,
      },
      domain: $app.stage === "production" 
        ? "cms.jaredconnor.dev" 
        : undefined,
    });

    return {
      api: api.url,
      landing: landingPage.url,
      blog: blogApp.url,
      cms: cmsApp.url,
      media: mediaBucket.name,
    };
  },
});
