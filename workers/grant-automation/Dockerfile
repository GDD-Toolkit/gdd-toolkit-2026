# syntax=docker/dockerfile:1
# Grants read API and ingestion worker (same image, different command).
#
# Build from the REPO ROOT, because the code imports ../../shared/types and those
# files get zod from the repo-root package.json:
#   docker build -f workers/grant-automation/Dockerfile -t gdd-grants .
# workers/grant-automation/Dockerfile.dockerignore limits the build context.
FROM node:22-bookworm-slim
WORKDIR /app

# zod for shared/types, resolved from /app/node_modules.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Dev dependencies are kept: the code runs through tsx, as it does under pm2.
COPY workers/grant-automation/package.json workers/grant-automation/package-lock.json ./workers/grant-automation/
RUN cd workers/grant-automation && npm ci

COPY shared ./shared
COPY workers/grant-automation ./workers/grant-automation
RUN mkdir -p workers/grant-automation/rejects && chown node:node workers/grant-automation/rejects

WORKDIR /app/workers/grant-automation
ENV NODE_ENV=production PORT=4100
USER node
EXPOSE 4100
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/healthz').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node_modules/.bin/tsx", "src/api/server.ts"]
