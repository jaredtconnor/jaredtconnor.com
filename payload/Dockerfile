FROM node:lts as base

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /base
COPY package.json bun.lockb ./
# Update PATH to include Bun
ENV PATH="/root/.bun/bin:$PATH"
RUN bun install

COPY . .

FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["bun", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base .
RUN bun run build

FROM build as prod
ENV NODE_ENV=production
WORKDIR /prod
COPY package*.json  .
RUN bun install --production

COPY --from=build /build/tsconfig.json ./tsconfig.json
COPY --from=build /build/dist ./dist
COPY --from=build /build/build ./build
EXPOSE 3000
CMD ["bun", "run", "serve"]
