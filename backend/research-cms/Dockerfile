# syntax=docker/dockerfile:1
# Production image for the CMS. Build from this folder:
#   docker build -t gdd-cms backend/research-cms
#
# Nothing environment-specific is baked in. At run time the container needs the same variables
# as .env.example, with DATA_SOURCE=production and the real DATABASE_*, AWS_* and SMTP_* values,
# passed with --env-file or a compose env_file.

FROM node:22-bookworm-slim AS build
WORKDIR /app

# patches/ must exist before `npm ci` because its postinstall step runs patch-package.
COPY package.json package-lock.json ./
COPY patches ./patches
RUN npm ci

COPY . .
# Strapi loads config/ while building the admin panel, and config/database.ts refuses to load
# unless DATA_SOURCE is set. This value only exists in this build stage; the running container
# gets DATA_SOURCE from its environment like every other setting.
ENV NODE_ENV=production DATA_SOURCE=production
# Compiles config/ and src/ into dist/ and builds the admin panel, then drops dev-only
# packages (typescript, patch-package) so they do not ship in the image.
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=1337
WORKDIR /app
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:1337/_health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node_modules/.bin/strapi", "start"]
