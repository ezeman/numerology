# Multi-stage Dockerfile for Numerology Pro

FROM node:20-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.8.0 --activate

# Install deps first for better layer caching
COPY package.json ./
# Install without requiring a lockfile (lock is optional in this repo)
RUN pnpm install --no-frozen-lockfile

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Enable pnpm in runtime
RUN corepack enable && corepack prepare pnpm@9.8.0 --activate

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy built app
COPY --from=builder /app .

EXPOSE 3000
USER nextjs
CMD ["pnpm", "start", "-p", "3000"]
