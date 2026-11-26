const config = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  // Public base URL of this Strapi instance (needed for OAuth redirect URIs).
  url: env("PUBLIC_URL"),
  // nginx terminates HTTPS in production. Trusting its X-Forwarded-* headers lets
  // Strapi see the request as https, which the admin panel's secure cookies require.
  proxy: { koa: true },
  app: {
    keys: env.array("APP_KEYS"),
  },
});

export default config;
