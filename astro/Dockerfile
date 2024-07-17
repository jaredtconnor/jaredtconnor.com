FROM node:lts-alpine as base

# Install Bun
RUN apk add --no-cache curl \
    && curl -fsSL https://bun.sh/install | bash \
    && rm -rf /var/cache/apk/*

WORKDIR /base
COPY package.json bun.lockb ./
# Update PATH to include Bun
ENV PATH="/root/.bun/bin:$PATH"
RUN bun install

COPY . .

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base .
ADD "https://random-uuid.deno.dev" skipcache
RUN bun run build

FROM nginx:stable AS prod
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 3000
