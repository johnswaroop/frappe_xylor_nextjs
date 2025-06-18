# Build stage for Next.js
FROM node:18-alpine AS nextjs-builder
WORKDIR /app/xylor
COPY xylor/package*.json ./
RUN npm ci
COPY xylor/ .
RUN npm run build

# Build stage for Frappe
FROM python:3.11-slim AS frappe-builder
WORKDIR /app
RUN apt-get update && apt-get install -y \
    python3-dev \
    mariadb-client \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install --no-cache-dir frappe-bench

# Final stage
FROM python:3.11-slim
WORKDIR /app

# Create apple user and group
RUN groupadd -r apple && useradd -r -g apple -d /home/apple -m -s /bin/bash apple

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-dev \
    mariadb-client \
    git \
    curl \
    nodejs \
    npm \
    redis-server \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy Frappe builder
COPY --from=frappe-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=frappe-builder /usr/local/bin/bench /usr/local/bin/bench

# Copy existing Frappe application
COPY p101-bench/ /app/p101-bench/
WORKDIR /app/p101-bench

# Copy Next.js build
COPY --from=nextjs-builder /app/xylor/.next /app/xylor/.next
COPY --from=nextjs-builder /app/xylor/public /app/xylor/public
COPY --from=nextjs-builder /app/xylor/package*.json /app/xylor/
WORKDIR /app/xylor
RUN npm ci --only=production

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 80 3000 8000 9000 6787 11000 13000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Start both services
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
