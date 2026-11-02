const config = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  // Public base URL of this Strapi instance (needed for OAuth redirect URIs).
  url: env("PUBLIC_URL"),
  app: {
    keys: env.array("APP_KEYS"),
  },
});

export default config;
