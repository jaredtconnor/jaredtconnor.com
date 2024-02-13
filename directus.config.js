
module.exports = function (env) {
    return {
        // User inputs from railway starter button
        ADMIN_EMAIL: env.ADMIN_EMAIL,
        ADMIN_PASSWORD: env.ADMIN_PASSWORD,
        KEY: env.KEY,
        SECRET: env.SECRET,

        // Reference: https://docs.railway.app/deploy/exposing-your-app
        PORT: env.PORT,

        // Reference: https://docs.railway.app/develop/variables#railway-provided-variables
        PUBLIC_URL: `https://${env.RAILWAY_STATIC_URL}`,

        // Database variables from Railway PostgreSQL Plugin
        // Reference: https://docs.railway.app/plugins/postgresql
        DB_CLIENT: 'pg',
        DB_HOST: env.PGHOST,
        DB_PORT: env.PGPORT,
        DB_DATABASE: env.PGDATABASE,
        DB_USER: env.PGUSER,
        DB_PASSWORD: env.PGPASSWORD,
        MESSENGER_STORE: 'redis',
        SYNCHRONIZATION_STORE: 'redis',
        REDIS_HOST: env.REDISHOST,
        REDIS_PORT: env.REDISPORT,
        CACHE_ENABLED: env.CACHE_ENABLED,
        CACHE_STORE: 'redis',
        REDIS_USERNAME: env.REDISUSER,
        REDIS_PASSWORD: env.REDISPASSWORD,
        STORAGE_LOCATIONS: "s3",
        STORAGE_S3_DRIVER: "s3",
        STORAGE_S3_CONTAINER_NAME: env.STORAGE_S3_CONTAINER_NAME,
        STORAGE_S3_ACCOUNT_KEY: env.STORAGE_S3_ACCOUNT_NAME,
        STORAGE_S3_ENDPOINT: env.STORAGE_S3_ENDPOINT
    };
};
