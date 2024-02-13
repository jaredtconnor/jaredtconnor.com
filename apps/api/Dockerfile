FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo pnpm
COPY . .

# Running this command creates a pruned version of your monorepo inside an ./out directory. It only includes workspaces which docs depends on.
# use `turbo prune --scope=@apps/server` to debug /out path
RUN turbo prune --scope=@apps/server --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
# note#1: required bash to use sed files on `apps/server/scripts/build.sh`
RUN apk add --no-cache libc6-compat bash
RUN apk update
RUN yarn global add turbo pnpm
# Set working directory
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=server...

FROM base AS runner
# Set working directory
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=installer /app/apps/server/package.json .

# Automatically leverage output traces to reduce image size
# https://appuser.org/docs/advanced-features/output-file-tracing
# required this as ../../../node_modules monorepo dependencies
COPY --from=installer --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=appuser:nodejs /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=installer --chown=appuser:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=installer --chown=appuser:nodejs /app/apps/server/build ./apps/server/build

# debug: comment to run with root user, usefull for debug, must be after sed to prevent `sed: can't create temp file 'package.jsonXXXXXX': Permission denied`
USER appuser

EXPOSE 4000

# the real trick is to change to `/app/apps/server` to run node `dist/server.mjs` in right path, else always fail with `Cannot GET /admin`
WORKDIR /app/apps/server

ENV NODE_ENV="production"
# debug: to show errors, very very useful for debugging issues
# ENV NODE_ENV="development"
ENV PAYLOAD_CONFIG_PATH="dist/payload.config.cjs"
# override default 3000 port
ENV PORT="4000"

# required env vars MONGO_URL, PAYLOAD_SECRET, PAYLOAD_PUBLIC_SERVER_URL, PUBLIC_PAYLOAD_SERVER_URL

# debug
# CMD ["sleep", "infinity"]
# gives `Cannot GET /admin` issue
# CMD [ "node", "apps/server/dist/server.mjs" ]
# the real magic is running from path /app/apps/server to find the build path resources
CMD [ "node", "dist/server.mjs" ]