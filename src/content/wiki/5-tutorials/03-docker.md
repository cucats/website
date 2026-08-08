---
title: Docker
description: Containers, for people who keep being told to use them
---

Docker packages an application with everything it needs to run, meaning the runtime, the libraries and the system packages, into an image. Anyone who runs that image gets the environment you had, on any machine with Docker installed.

It exists to kill "it works on my machine". The cost is a layer of indirection that confuses everyone for the first few hours, largely because two similar words mean different things.

## Images and containers

Get this straight early and the rest follows.

An image is a read-only template, built once, unchanging. Think of it as a class. A container is a running instance of an image, with its own writable layer, and you can start many from one image. Think of it as an object.

Changing your code means building a new image. Editing a running container does not persist; anything written inside one disappears when it is removed, unless you deliberately store it outside.

## Running someone else's image

The quickest way to see the appeal is running something without installing it:

```bash
docker run --rm -it python:3.12 python
```

That pulls a Python image, starts a container and drops you at a Python prompt, with nothing installed on your machine. `--rm` deletes the container when you exit.

The flags worth knowing:

| Flag               | Meaning                                     |
| ------------------ | ------------------------------------------- |
| `--rm`             | delete the container when it stops          |
| `-it`              | interactive, with a terminal attached       |
| `-d`               | detached: run in the background             |
| `-p 8080:80`       | publish container port 80 as host port 8080 |
| `-v "$(pwd)":/app` | mount a host directory into the container   |
| `-e KEY=value`     | set an environment variable                 |
| `--name thing`     | give the container a name you can refer to  |

Port mapping is `host:container`, in that order. Getting it backwards is a rite of passage.

## Writing a Dockerfile

A `Dockerfile` is the recipe. A minimal one for a Python service:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "main.py"]
```

Build and run:

```bash
docker build -t myapp .
docker run --rm -p 8000:8000 myapp
```

`-t` names the image, and the `.` is the build context, the directory sent to the daemon and available to `COPY`.

### Why the copies are split

`requirements.txt` gets copied and installed before the rest of the source. That is deliberate and it is the most useful thing on this page.

Each instruction creates a layer, and Docker caches layers, reusing any whose inputs have not changed. Dependencies change far less often than source code, so installing them first means editing one file rebuilds only the last two layers.

Put what changes least at the top of the file and what changes most at the bottom.

### Keep the context small

A `.dockerignore` stops junk being sent to the build and copied into the image:

```text
node_modules
.git
build
*.log
```

Without one, `COPY . .` will happily copy a local `node_modules` over the one installed inside the image, producing confusing platform-mismatch errors, and it makes every build slower for no gain.

> [!WARNING]
> Anything in the build context can end up in the image, and layers persist even when a later instruction deletes the file. Keep `.env` files, SSH keys and tokens out, because anyone with the image can pull them from the layer history. Pass secrets at runtime with `-e`, or use build secrets.

## Multi-stage builds

Where building needs tools that running does not, such as a compiler, a bundler or a full SDK, a multi-stage build throws them away:

```dockerfile
# Build stage
FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "build/index.js"]
```

Only what you explicitly copy out of `builder` survives. The final image is much smaller and carries no build toolchain for an attacker to use.

This site deploys roughly this way; the `Dockerfile` in the [website repository](https://github.com/cucats/website) is a real example.

## Compose, for more than one container

Long `docker run` invocations get old, and most real applications want a database alongside. `compose.yaml` describes the set:

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: dev-only-password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Then:

```bash
docker compose up -d      # start everything in the background
docker compose logs -f    # follow the logs
docker compose down       # stop and remove
```

Services reach each other by name, so `web` connects to the database at the hostname `db`. That is the main thing Compose buys beyond convenience.

## Persisting data

Containers are disposable, so anything you want to keep goes in a volume:

```bash
docker run -v pgdata:/var/lib/postgresql/data postgres:17
```

Named volumes like `pgdata:/path` are managed by Docker and are what you want for databases. Bind mounts like `./src:/app/src` map a host directory in, which is for development, so edits on your machine appear inside the container without a rebuild.

## When things go wrong

```bash
docker ps                    # running containers
docker ps -a                 # including stopped ones
docker logs <name>           # what it printed
docker exec -it <name> sh    # get a shell inside a running container
docker inspect <name>        # full configuration as JSON
docker system df             # how much disk Docker is using
```

Reach for `docker exec -it <name> sh` first. Most "why isn't this working" questions get answered by looking around inside the container and finding a file somewhere you did not expect.

A container that exits immediately will almost always explain itself in `docker logs`. Containers stop when their main process stops, so a `CMD` that runs and returns will not stay up.

> [!TIP]
> Docker accumulates images, containers and build cache until your disk fills. `docker system prune -a` reclaims the space, at the cost of deleting every image no container is currently using, so expect to re-download things.

## When to skip it

Docker earns its keep for applications with real dependencies, for teams needing the same environment, and for deploying to a server. A single script with no dependencies does not need it, and it makes a poor substitute for your language's own environment tooling, where a virtualenv or an opam switch is the right answer.

Reaching for containers to avoid learning your package manager buys a bigger problem than the one it solves.

## Further reading

- [Docker's getting started guide](https://docs.docker.com/get-started/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/), worth skimming once so you know what exists
