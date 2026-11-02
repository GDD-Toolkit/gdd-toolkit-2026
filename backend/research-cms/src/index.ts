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

/**
 * Public content collections. Anonymous visitors (the Public role) may list
 * and read them; the frontend fetches them without an API token.
 */
const PUBLIC_CONTENT_TYPES = [
  "ai-tool",
  "cohert",
  "funding-resource",
  "geopolitical-analysis",
  "podcast",
  "project-planning",
  "team",
  "worthwhile-development",
];

const PUBLIC_READ_ACTIONS = PUBLIC_CONTENT_TYPES.flatMap((name) => [
  `api::${name}.${name}.find`,
  `api::${name}.${name}.findOne`,
]);

/** Content API actions every signed-in site role needs. */
const SITE_ROLE_ACTIONS = [
  "plugin::users-permissions.user.me",
  "plugin::users-permissions.auth.changePassword",
  "api::account.account.me",
  "api::account.account.updateProfile",
  "api::account.account.addBookmark",
  "api::account.account.removeBookmark",
  // Signed-in requests are checked against the user's role, not Public, so
  // public content must stay readable once a JWT is attached.
  ...PUBLIC_READ_ACTIONS,
];

const USERS_PERMISSIONS_STORE = { type: "plugin", name: "users-permissions" } as const;

/** Grants any of `actions` the role does not have yet. Existing grants are left alone. */
async function grantActions(strapi: Core.Strapi, roleId: number, actions: string[]) {
  const permissions = strapi.db.query("plugin::users-permissions.permission");
  const existing = await permissions.findMany({
    where: { role: { id: roleId }, action: { $in: actions } },
  });
  const granted = new Set(existing.map((permission) => permission.action));

  for (const action of actions) {
    if (!granted.has(action)) {
      await permissions.create({ data: { action, role: roleId } });
    }
  }
}

async function ensureSiteRoles(strapi: Core.Strapi) {
  const roles = strapi.db.query("plugin::users-permissions.role");

  for (const definition of SITE_ROLES) {
    let role = await roles.findOne({ where: { type: definition.type } });
    if (!role) {
      role = await roles.create({ data: definition });
      strapi.log.info(`[auth] Created site role "${definition.name}"`);
    }

    await grantActions(strapi, role.id, SITE_ROLE_ACTIONS);
  }
}

/** The Public role is created by the users-permissions plugin; make sure it can read public content. */
async function ensurePublicReadPermissions(strapi: Core.Strapi) {
  const roles = strapi.db.query("plugin::users-permissions.role");
  const role = await roles.findOne({ where: { type: "public" } });
  if (!role) return;

  await grantActions(strapi, role.id, PUBLIC_READ_ACTIONS);
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
  // Page the password-reset email links to; Strapi appends ?code=<token>.
  if (frontendUrl && !next.email_reset_password) {
    next.email_reset_password = `${frontendUrl.replace(/\/$/, "")}/auth/reset-password`;
  }

  // Explicit switch for sign-up email confirmation. Unset leaves the admin-panel setting alone.
  const confirmation = process.env.AUTH_EMAIL_CONFIRMATION;
  if (confirmation === "true" || confirmation === "false") {
    next.email_confirmation = confirmation === "true";
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
    await ensurePublicReadPermissions(strapi);
    await ensureAdvancedSettings(strapi);
    await configureGoogleProvider(strapi);
  },
};
