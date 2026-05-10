# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Production stage
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install --production --frozen-lockfile

COPY --from=builder /app/build ./build
COPY --from=builder /app/static ./static
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

ENV NODE_ENV=production
ENV ORIGIN=http://localhost:3000

CMD ["sh", "-c", "bun run scripts/migrate.ts && bun run build/index.js"]
