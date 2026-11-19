const config = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  // Public base URL of this Strapi instance (needed for OAuth redirect URIs).
  url: env("PUBLIC_URL"),
  // true behind a TLS-terminating proxy (Caddy in deploy/): Strapi then trusts X-Forwarded-*,
  // so it sees HTTPS and marks the admin refresh cookie `secure`, and logs the real client IP.
  proxy: { koa: env.bool("IS_PROXIED", false) },
  app: {
    keys: env.array("APP_KEYS"),
  },
});

export default config;
