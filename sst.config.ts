/// <reference path="./.sst/platform/config.d.ts" />

export default $config({ 

    app(input) {
      return {
        name: "personal-site",
        removal: input?.stage === "production" ? "retain" : "remove",
        home: "aws",
      };
    },

    async run() {  

        const vpc = new sst.aws.Vpc("VPC");

        const database = new sst.aws.Postgres("Database", { 
            vpc: vpc, 
            database: "personal-site",
            username: "postgres",
            password: "postgres",
            version: "16.4",
        });

      // Astro Landing Page
      const landing = new sst.aws.Astro("Landing", {
        path: "./apps/landing",
      });
  
      // Next.js Blog
      const blog = new sst.aws.Nextjs("Blog", {
        path: "./apps/blog",
      });
  
      // Payload CMS (Next.js)
      const cms = new sst.aws.Nextjs("CMS", {
        path: "./apps/cms",
        environment: {
          PAYLOAD_SECRET: "your-secret-key",
          JWT_SECRET: "your-jwt-secret",
        },
        link: [database],
      });
  
      return {
        landing: landing.url,
        blog: blog.url,
        cms: cms.url,
      };
    },
  });