// pm2 processes for the Strapi EC2. `pm2 start ecosystem.config.cjs` from this
// directory; `.env` next to this file is read by src/env.ts at start.
//   grant-api     the read API behind nginx at /grants/api
//   grant-ingest  the nightly ingestion of every source in data/sources.json
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
    {
      name: "grant-ingest",
      cwd: __dirname,
      script: "node_modules/.bin/tsx",
      args: "src/cli.ts ingest",
      env: { NODE_ENV: "production" },
      // A run takes about a minute and then exits; pm2 starts it again only on the schedule.
      autorestart: false,
      // pm2 evaluates this in the time zone of the pm2 daemon, not of this app.
      // On a UTC server 08:00 is 03:00 Eastern in winter and 04:00 in summer.
      // If `date +%Z` on the server does not print UTC, change it to "0 3 * * *" there.
      cron_restart: "0 8 * * *",
      max_memory_restart: "400M",
      time: true,
    },
  ],
};
