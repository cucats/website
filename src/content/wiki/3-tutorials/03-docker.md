---
title: Docker
description: Containers, for people who keep being told to use them
---

Docker packages an application together with everything it needs to run — the runtime, the libraries, the system packages — into an **image**. Anyone who runs that image gets the same environment you had, on any machine with Docker installed.

The problem it solves is "it works on my machine". The cost is a layer of indirection that is genuinely confusing for the first few hours, mostly because two similar words mean different things.

## Images and containers

This distinction is the whole thing, and getting it straight early saves a lot of confusion.

- An **image** is a read-only template. It is built once and does not change. Think of it as a class.
- A **container** is a running instance of an image. You can start many from one image, and each has its own writable layer. Think of it as an object.

When you change your code you build a **new image**. You do not edit a running container and expect it to persist — anything written inside a container is lost when it is removed, unless you deliberately store it outside.

## Running someone else's image

The quickest way to see the point is to run something without installing it:

```bash
docker run --rm -it python:3.12 python
```

That downloads a Python image, starts a container, and drops you into a Python prompt. Nothing was installed on your machine, and `--rm` removes the container when you exit.

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

The port mapping is `host:container`, in that order. Getting it backwards is a rite of passage.

## Writing a Dockerfile

A `Dockerfile` is the recipe for an image. A minimal one for a Python service:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "main.py"]
```

Build and run it:

```bash
docker build -t myapp .
docker run --rm -p 8000:8000 myapp
```

The `-t` gives the image a name, and the `.` is the **build context** — the directory sent to the daemon and available to `COPY`.

### Why the copies are split

Notice that `requirements.txt` is copied and installed _before_ the rest of the source. That is deliberate and it is the most useful thing on this page.

Each instruction creates a layer, and Docker caches layers. If a layer's inputs have not changed, it is reused. Because dependencies change far less often than source code, installing them first means editing one source file rebuilds only the last two layers instead of reinstalling every dependency.

Put the things that change least at the top of the file, and the things that change most at the bottom.

### Keep the context small

A `.dockerignore` stops junk being sent to the build and copied into the image:

```text
node_modules
.git
build
*.log
```

Without it, `COPY . .` will happily copy a local `node_modules` over the one installed inside the image, which produces confusing platform-mismatch errors. It also makes builds slower for no benefit.

> [!WARNING]
> Everything in the build context can end up in the image, and image layers are permanent even if a later instruction deletes the file. Never copy in a `.env` file, an SSH key or a token — anyone with the image can extract it from the layer history. Pass secrets at runtime with `-e`, or use build secrets.

## Multi-stage builds

If building needs tools that running does not — a compiler, a bundler, a full SDK — a multi-stage build discards them from the final image:

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

Only what is explicitly copied out of `builder` ends up in the result. The final image is dramatically smaller, and it contains no build toolchain for an attacker to use.

This site is deployed roughly this way — see the `Dockerfile` in the [website repository](https://github.com/cucats/website) for a real example.

## Compose, for more than one container

Typing long `docker run` invocations gets old, and most real applications need a database alongside the app. `compose.yaml` describes the whole set:

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

Services can reach each other by name — the `web` container connects to the database at the hostname `db`. That is the main thing Compose buys you beyond convenience.

## Persisting data

Containers are disposable, so anything you want to keep goes in a **volume**:

```bash
docker run -v pgdata:/var/lib/postgresql/data postgres:17
```

Two kinds are worth distinguishing:

- **Named volumes** (`pgdata:/path`) are managed by Docker and are the right choice for databases.
- **Bind mounts** (`./src:/app/src`) map a host directory into the container. These are for development, so that edits on your machine appear inside the container without a rebuild.

## When things go wrong

```bash
docker ps                    # running containers
docker ps -a                 # including stopped ones
docker logs <name>           # what it printed
docker exec -it <name> sh    # get a shell inside a running container
docker inspect <name>        # full configuration as JSON
docker system df             # how much disk Docker is using
```

`docker exec -it <name> sh` is the one to reach for first. Most "why isn't this working" questions are answered by looking around inside the container and discovering that a file is not where you assumed.

If a container exits immediately, `docker logs` almost always says why. A container stops when its main process stops, so a `CMD` that runs and returns will not stay up.

> [!TIP]
> Docker accumulates images, containers and build cache until your disk is full. `docker system prune -a` reclaims it, but it deletes every image not currently used by a container, so expect to re-download things afterwards.

## When not to bother

Docker is worth it when an application has real dependencies, when several people need the same environment, or when you are deploying to a server. It is not worth it for a single script with no dependencies, and it is a poor substitute for a language's own environment tooling — use a virtualenv or an opam switch for that.

Reaching for containers to avoid learning your language's package manager buys a much larger problem.

## Further reading

- [Docker's getting started guide](https://docs.docker.com/get-started/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/) — worth skimming once so you know what exists
