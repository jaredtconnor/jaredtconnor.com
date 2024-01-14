FROM node:lts as base
RUN apk update && apk add --no-cache libc6-compat
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

WORKDIR /base
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["pnpm","dev"]


FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base .
RUN pnpm build

FROM build as prod
ENV NODE_ENV=production
WORKDIR /prod
COPY package*.json  .
RUN pnpm install --production

COPY --from=build /build/tsconfig.json ./tsconfig.json
COPY --from=build /build/dist ./dist
COPY --from=build /build/build ./build
EXPOSE 3000
CMD ["pnpm", "serve"]
