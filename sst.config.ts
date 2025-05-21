import { SSTConfig } from "sst";
import { NextjsSite, Config, RDS } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "personal-site",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Create a PostgreSQL database
      const rds = new RDS(stack, "Database", {
        engine: "postgresql11.13",
        defaultDatabaseName: "personalsite",
        scaling: {
          minCapacity: "ACU_2",
          maxCapacity: "ACU_4",
        },
      });

      // Create a Next.js site
      const site = new NextjsSite(stack, "Site", {
        bind: [rds],
      });

      // Create a config object for environment variables
      const DATABASE_URL = Config.Parameter.create(stack, "DATABASE_URL", {
        value: `postgresql://${rds.defaultUsername}:${rds.defaultPassword}@${rds.clusterEndpoint.hostname}:${rds.clusterEndpoint.port}/${rds.defaultDatabaseName}`,
      });

      stack.addOutputs({
        SiteUrl: site.url,
        DatabaseUrl: DATABASE_URL.value,
      });
    });
  },
} satisfies SSTConfig;
