# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY libs/types/package.json ./libs/types/

# Install all dependencies (needed for build)
RUN npm ci

# Copy workspace files needed for build
COPY nx.json ./
COPY tsconfig.base.json ./
COPY apps/frontend/tsconfig*.json ./apps/frontend/
COPY apps/frontend/vite.config.mts ./apps/frontend/
COPY apps/frontend/index.html ./apps/frontend/
COPY apps/frontend/public ./apps/frontend/public
COPY apps/frontend/src ./apps/frontend/src
COPY libs/types/src ./libs/types/src

# Build the frontend application
# Disable Nx cache during Docker build to avoid SQLite database issues
RUN NX_SKIP_NX_CACHE=1 npx nx build frontend --configuration=production

# Production stage - use nginx to serve static files
FROM nginx:alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy custom nginx config if needed (for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy built static files from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
