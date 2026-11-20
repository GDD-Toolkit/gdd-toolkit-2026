# syntax=docker/dockerfile:1
# Builds the Vite app and serves the static output with nginx.
#
# Build from the REPO ROOT, not from frontend/, because the app imports ../shared/types:
#   docker build -f frontend/Dockerfile --build-arg VITE_STRAPI_URL=https://cms.example.edu -t gdd-frontend .
# The root .dockerignore limits the build context to frontend/ and shared/.

FROM node:22-bookworm-slim AS build
WORKDIR /app

# Install first so this layer is reused until the lockfile changes.
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

COPY shared ./shared
COPY frontend ./frontend

# Vite compiles every VITE_* variable into the bundle, so the Strapi URL is fixed at build
# time and this image is specific to one environment. Never pass a token here.
ARG VITE_STRAPI_URL
RUN test -n "$VITE_STRAPI_URL" || { echo "VITE_STRAPI_URL build arg is required" >&2; exit 1; }
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL
RUN cd frontend && npm run build

# nginx runs as an unprivileged user on port 8080. TLS is the reverse proxy's job.
FROM nginxinc/nginx-unprivileged:stable-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:8080/ || exit 1
