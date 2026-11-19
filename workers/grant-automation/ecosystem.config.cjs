// pm2 processes for the Strapi EC2. `pm2 start ecosystem.config.cjs` from this
// directory; `.env` next to this file is read by src/env.ts at start.
//   grant-api     the read API behind nginx at /grants/api
module.exports = {
  apps: [
    {
      name: "grant-api",
      cwd: __dirname,
      script: "node_modules/.bin/tsx",
      args: "src/api/server.ts",
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
      time: true,
    },
  ],
};
