// pm2 processes for the EC2 box. From this directory:
//   pm2 start ecosystem.config.cjs --only grant-api      (and later --only grant-ingest)
//   pm2 save                                             so a reboot brings them back
// There is no .env in production: scripts/with-ssm-env.mjs reads SSM /gdd/prod/grants
// on every start and passes it to the process.
//   grant-api     the read API behind nginx at /grants/api
//   grant-ingest  the nightly ingestion of every source in data/sources.json
const SSM = "--path /gdd/prod/grants";

module.exports = {
  apps: [
    {
      name: "grant-api",
      cwd: __dirname,
      script: "scripts/with-ssm-env.mjs",
      args: `${SSM} node_modules/.bin/tsx src/api/server.ts`,
      env: { NODE_ENV: "production" },
      max_memory_restart: "300M",
      // If SSM is unreachable at boot (network not up yet), keep retrying with a growing
      // delay instead of giving up after 16 fast restarts.
      exp_backoff_restart_delay: 1000,
      time: true,
    },
    {
      name: "grant-ingest",
      cwd: __dirname,
      script: "scripts/with-ssm-env.mjs",
      args: `${SSM} node_modules/.bin/tsx src/cli.ts ingest`,
      env: { NODE_ENV: "production" },
      // A run takes about a minute and then exits; pm2 starts it again only on the schedule.
      autorestart: false,
      // pm2 evaluates this in the time zone of the pm2 daemon, not of this app.
      // The box is on UTC (checked 2026-11-25): 08:00 is 03:00 Eastern in winter and
      // 04:00 in summer.
      cron_restart: "0 8 * * *",
      max_memory_restart: "400M",
      time: true,
    },
  ],
};
