# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY libs/tic-tac-toe-lib/package.json ./libs/tic-tac-toe-lib/

# Install all dependencies (needed for build)
RUN npm ci

# Copy workspace files needed for build
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./
COPY apps/backend/tsconfig*.json ./apps/backend/
COPY libs/tic-tac-toe-lib/tsconfig*.json ./libs/tic-tac-toe-lib/
COPY apps/backend/src ./apps/backend/src
COPY libs/tic-tac-toe-lib/src ./libs/tic-tac-toe-lib/src

# Sync TypeScript project references before building
# Disable Nx daemon and cache during Docker build to avoid SQLite database issues
RUN NX_DAEMON=false NX_SKIP_NX_CACHE=1 npx nx sync

# Build the backend application and run prune to prepare for production
# Disable Nx daemon and cache during Docker build to avoid SQLite database issues
RUN NX_DAEMON=false NX_SKIP_NX_CACHE=1 npx nx build backend --configuration=production && \
    NX_DAEMON=false NX_SKIP_NX_CACHE=1 npx nx prune backend

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy pruned package files from dist
COPY --from=builder /app/apps/backend/dist/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application and workspace modules
COPY --from=builder /app/apps/backend/dist ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "main.js"]
