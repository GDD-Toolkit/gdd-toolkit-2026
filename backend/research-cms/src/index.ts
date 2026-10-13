import type { Core } from "@strapi/strapi";

/**
 * Site roles for the toolkit (issue #13). These are Users & Permissions
 * roles for site visitors; they are unrelated to Strapi admin-panel accounts.
 */
const SITE_ROLES = [
  {
    type: "student",
    name: "Student",
    description: "Default role for new sign-ups. Can bookmark tools and save grants.",
  },
  {
    type: "researcher",
    name: "Researcher",
    description: "Student permissions plus community submissions (pending review).",
  },
  {
    type: "admin",
    name: "Admin",
    description: "Site administrator. Does not grant Strapi admin-panel access.",
  },
];

/** Content API actions every signed-in site role needs. */
const SITE_ROLE_ACTIONS = [
  "plugin::users-permissions.user.me",
  "plugin::users-permissions.auth.changePassword",
  "api::account.account.me",
  "api::account.account.updateProfile",
  "api::account.account.addBookmark",
  "api::account.account.removeBookmark",
  // Signed-in requests are checked against the user's role, not Public, so
  // bookmark targets must stay readable once a JWT is attached.
  "api::ai-tool.ai-tool.find",
  "api::ai-tool.ai-tool.findOne",
  "api::funding-resource.funding-resource.find",
  "api::funding-resource.funding-resource.findOne",
];

const USERS_PERMISSIONS_STORE = { type: "plugin", name: "users-permissions" } as const;

async function ensureSiteRoles(strapi: Core.Strapi) {
  const roles = strapi.db.query("plugin::users-permissions.role");
  const permissions = strapi.db.query("plugin::users-permissions.permission");

  for (const definition of SITE_ROLES) {
    let role = await roles.findOne({ where: { type: definition.type } });
    if (!role) {
      role = await roles.create({ data: definition });
      strapi.log.info(`[auth] Created site role "${definition.name}"`);
    }

    const existing = await permissions.findMany({
      where: { role: { id: role.id }, action: { $in: SITE_ROLE_ACTIONS } },
    });
    const granted = new Set(existing.map((permission) => permission.action));

    for (const action of SITE_ROLE_ACTIONS) {
      if (!granted.has(action)) {
        await permissions.create({ data: { action, role: role.id } });
      }
    }
  }
}

async function ensureAdvancedSettings(strapi: Core.Strapi) {
  const store = strapi.store(USERS_PERMISSIONS_STORE);
  const advanced = (await store.get({ key: "advanced" })) as Record<string, unknown> | null;
  if (!advanced) return;

  const next = { ...advanced };

  // Only override Strapi's stock default; respect a value an admin set later.
  if (next.default_role === "authenticated") {
    next.default_role = "student";
    strapi.log.info('[auth] Default sign-up role set to "student"');
  }

  const frontendUrl = process.env.FRONTEND_URL;
  if (frontendUrl && !next.email_confirmation_redirection) {
    next.email_confirmation_redirection = `${frontendUrl.replace(/\/$/, "")}/auth/confirmed`;
  }

  await store.set({ key: "advanced", value: next });
}

/**
 * Enables Google SSO when credentials are provided through the environment.
 * Without them the provider stays as configured in the admin panel.
 */
async function configureGoogleProvider(strapi: Core.Strapi) {
  const key = process.env.GOOGLE_CLIENT_ID;
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  const callback = process.env.GOOGLE_AUTH_REDIRECT_URL;
  if (!key || !secret || !callback) return;

  const store = strapi.store(USERS_PERMISSIONS_STORE);
  const grant = ((await store.get({ key: "grant" })) ?? {}) as Record<string, Record<string, unknown>>;

  await store.set({
    key: "grant",
    value: {
      ...grant,
      google: { ...(grant.google ?? {}), enabled: true, key, secret, callback },
    },
  });
  strapi.log.info("[auth] Google provider enabled from environment");
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureSiteRoles(strapi);
    await ensureAdvancedSettings(strapi);
    await configureGoogleProvider(strapi);
  },
};
