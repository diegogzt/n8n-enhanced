# n8n Enhanced Edition - Dockerfile
# All Enterprise features unlocked for Community Edition

FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY patches ./patches
COPY scripts ./scripts
COPY packages ./packages

# Install pnpm
RUN npm install -g pnpm@10.18.3

# Install dependencies and build
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build

# Production stage
FROM node:22-alpine

# Install runtime dependencies
RUN apk add --no-cache \
    bash \
    curl \
    tzdata \
    ca-certificates

# Create n8n user (use existing node user to avoid GID conflicts)
RUN deluser --remove-home node && \
    addgroup -g 1000 n8n && \
    adduser -D -u 1000 -G n8n n8n

WORKDIR /home/n8n

# Copy built application from builder
COPY --from=builder --chown=n8n:n8n /app /home/n8n

# Install pnpm
RUN npm install -g pnpm@10.18.3

# Set environment variables
ENV NODE_ENV=production \
    N8N_PORT=5678 \
    N8N_PROTOCOL=http \
    N8N_HOST=0.0.0.0 \
    EXECUTIONS_PROCESS=main \
    EXECUTIONS_MODE=regular \
    GENERIC_TIMEZONE=UTC \
    N8N_LOG_LEVEL=info

# Expose port
EXPOSE 5678

# Switch to n8n user
USER n8n

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5678/healthz || exit 1

# Start n8n
CMD ["node", "/home/n8n/packages/cli/bin/n8n"]
