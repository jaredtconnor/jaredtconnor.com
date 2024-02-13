# TLDR

- [TLDR](#tldr)
  - [URLS](#urls)
  - [Replace project and Domain](#replace-project-and-domain)
  - [Start Development Environment](#start-development-environment)
    - [Environment file](#environment-file)
    - [Remote Development Environment](#remote-development-environment)
      - [Open Firewall Ports](#open-firewall-ports)
    - [Start Development Server](#start-development-server)
  - [Docker Stack](#docker-stack)
    - [Build Docker Images](#build-docker-images)
    - [Spin Up Docker Stack](#spin-up-docker-stack)
    - [Spin Down Docker Stack](#spin-down-docker-stack)
  - [Push Docker Images](#push-docker-images)

## URLS

- [web](http://koakh-laptop:3080)
- [server](http://koakh-laptop:4080)

## Replace project and Domain

- search `SvelteKitPayloadCMSWithTRPCAndTurboRepoStarter` and replace with your project Name/key
- search `svelte-kit-payload-cms-with-trpc-and-turbo-repo-starter` and replace with your project name
- search `starterdomain.org` and replace with your domain url
- search `koakh-laptop` and replace with your development machine hostname (useful to use local and remote development)
- search `PAYLOAD_SECRET_STUB` and replace with your `PAYLOAD_SECRET`
- rename `deploy/srv/docker/starterdomain` to your domain name

## Start Development Environment

### Environment file

```shell
$ cp .env.example .env
```

> `koakh-laptop` is used as a alias for remote connection, and is the name of host machine to, if using remote connection, add it to `/etc/hosts`

```shell
# server
PORT=4080
MONGO_URL="mongodb://127.0.0.1:27017/svelte-kit-payload-cms-with-trpc-and-turbo-repo-starter"
PAYLOAD_SECRET="PAYLOAD_SECRET_STUB"
PAYLOAD_PUBLIC_SERVER_URL="http://koakh-laptop:4080"
CLIENT_EXTRA_CORS="http://koakh-laptop:3080"

# web: for sveltekit, needs to start with "PUBLIC_"
PUBLIC_PORT="4080"
PUBLIC_PAYLOAD_SERVER_URL="http://koakh-laptop:4080"
```

### Remote Development Environment

> optional: only in case we use a remote connection, like ssh environment

#### Open Firewall Ports

```shell
# command to add port to
$ sudo firewall-cmd --zone=public --add-port=3080/tcp
$ sudo firewall-cmd --zone=public --add-port=4080/tcp
# command to keep the port open permanently
$ sudo firewall-cmd --runtime-to-permanent
```

### Start Development Server

```shell
# change to v18.16.0 to prevent `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".mts"` error
$ nvm use v18.16.0

# install dependencies
$ pnpm i

# start vite dev server
$ pnpm dev
...
@apps/web:dev:   ➜  Local:   http://localhost:3080/
@apps/web:dev:   ➜  Network: http://192.168.1.51:3080/
@apps/web:dev:   ➜  Network: http://192.168.122.1:3080/
@apps/web:dev:   ➜  Network: http://172.19.0.1:3080/
@apps/server:dev: [18:22:00] INFO (payload): Connected to MongoDB server successfully!
@apps/server:dev: [18:22:00] INFO (payload): Starting Payload...
...
@apps/server:dev: [18:22:01] INFO (payload): Payload Admin URL: http://koakh-laptop:4080/admin
@apps/server:dev: API Server listening on port 4080
```

## Docker Stack

### Build Docker Images

```shell
$ pnpm docker:build
```

### Spin Up Docker Stack

```shell
$ pnpm docker:stack:up
```

### Spin Down Docker Stack

```shell
$ pnpm docker:stack:down
```

## Push Docker Images

```shell
# login
$ docker login -u ${USER_STUB}
# push images
$ docker:push:server
$ docker:push:web
```
