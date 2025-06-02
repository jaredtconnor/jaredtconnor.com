// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cms",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const cms = new sst.aws.Nextjs("CMS", {
      edge: true,
      customDomain: input?.stage === "production" 
        ? { domainName: "cms.yourdomain.com" } 
        : undefined,
      environment: {
        PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || "your-secret-key",
        POSTGRES_URI: process.env.POSTGRES_URI || "postgresql://postgres:postgres@localhost:5432/payload",
        PAYLOAD_CONFIG_PATH: "dist/payload.config.js",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      },
    });

    return { url: cms.url };
  },
});
