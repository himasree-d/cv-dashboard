# ── Frontend Dockerfile — multi-stage build ──────────────────────────────────
# Stage 1: Build the React/Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
# The API URL is injected at build time via build arg
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve with Nginx (alpine for minimal image size)
FROM nginx:1.25-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: route all requests to index.html (React Router support)
RUN printf 'server {\n\
    listen 80;\n\
    server_name _;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    location /health {\n\
        return 200 "healthy";\n\
        add_header Content-Type text/plain;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
