// pm2 process for production Strapi on the EC2 box. The deploy workflow runs
// `pm2 startOrRestart ecosystem.config.cjs --update-env` and `pm2 save`, so a reboot
// brings it back through `pm2 resurrect`. There is no .env in production:
// scripts/with-ssm-env.mjs reads SSM on every start and passes it to Strapi.
module.exports = {
  apps: [
    {
      name: "strapi",
      cwd: __dirname,
      script: "scripts/with-ssm-env.mjs",
      // Strapi directly rather than `npm run start`, so there is no npm/sh layer between
      // the wrapper and Strapi for pm2's stop signal to get lost in.
      args: "node_modules/.bin/strapi start",
      // pm2 sends SIGINT, then SIGKILL after this many ms. Strapi closes the HTTP server
      // and the database pool on SIGINT; the 1.6s default can cut that short.
      kill_timeout: 10000,
      // If SSM is unreachable at boot (network not up yet), keep retrying with a growing
      // delay (capped at 15s by pm2) instead of giving up after 16 fast restarts.
      exp_backoff_restart_delay: 1000,
      time: true,
    },
  ],
};
