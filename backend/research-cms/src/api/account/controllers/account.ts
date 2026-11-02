import type { Core } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { ValidationError, NotFoundError } = errors;

const USER_UID = "plugin::users-permissions.user";
const ME_POPULATE = ["role", "avatar", "bookmarkedTools", "savedGrants"];

/** Editable text fields and their schema max lengths. */
const PROFILE_FIELDS: Record<string, number> = {
  firstName: 100,
  lastName: 100,
  institution: 200,
  department: 200,
  bio: 1000,
  occupation: 100,
  country: 100,
};

/** Interest values mirror shared/types/Users.ts. */
const INTERESTS = ["health", "environment", "social", "economic"];

/** Language is an ISO 639-1 code; the full list lives in shared/types/Users.ts. */
const LANGUAGE_CODE = /^[a-z]{2}$/;

/** Text answers the onboarding prompt must collect before it can be marked complete. */
const ONBOARDING_FIELDS = ["firstName", "lastName", "institution", "occupation", "country", "language"];

const BOOKMARK_KINDS = {
  tools: { field: "bookmarkedTools", uid: "api::ai-tool.ai-tool" },
  grants: { field: "savedGrants", uid: "api::funding-resource.funding-resource" },
} as const;

type BookmarkKind = keyof typeof BOOKMARK_KINDS;

function userService(strapi: Core.Strapi) {
  return strapi.plugin("users-permissions").service("user");
}

/**
 * The signed-in user, like GET /api/users/me plus their role. The stock
 * sanitizer drops any relation whose target the role cannot "find", which
 * hides `role` unless site roles were allowed to list all roles. The role is
 * already loaded on ctx.state.user by the auth middleware, so attach it here.
 */
async function currentUser(strapi: Core.Strapi, ctx) {
  const user = await userService(strapi).fetch(ctx.state.user.id, { populate: ME_POPULATE });
  const sanitized = (await strapi.contentAPI.sanitize.output(user, strapi.getModel(USER_UID), {
    auth: ctx.state.auth,
  })) as Record<string, unknown>;
  const role = ctx.state.user.role;
  return {
    ...sanitized,
    role: role ? { id: role.id, documentId: role.documentId, name: role.name, type: role.type } : null,
  };
}

function parseBookmarkParams(ctx) {
  const kind = ctx.params.kind as string;
  const documentId = ctx.params.documentId as string;
  if (!(kind in BOOKMARK_KINDS)) {
    throw new ValidationError(`Unknown bookmark kind "${kind}". Use tools or grants.`);
  }
  return { ...BOOKMARK_KINDS[kind as BookmarkKind], documentId };
}

async function findPublishedTarget(strapi: Core.Strapi, uid: string, documentId: string) {
  const target = await strapi.documents(uid as any).findOne({ documentId, status: "published" });
  if (!target) throw new NotFoundError("Item not found");
  return target;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async me(ctx) {
    ctx.body = await currentUser(strapi, ctx);
  },

  async updateProfile(ctx) {
    const { interests, language, onboardingComplete, ...text } = (ctx.request.body ?? {}) as Record<
      string,
      unknown
    >;

    const unknown = Object.keys(text).filter((key) => !(key in PROFILE_FIELDS));
    if (unknown.length > 0) {
      throw new ValidationError(`Invalid parameters: ${unknown.join(", ")}`);
    }

    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(text)) {
      if (value === null || value === "") {
        data[key] = null;
        continue;
      }
      if (typeof value !== "string") {
        throw new ValidationError(`${key} must be a string`);
      }
      if (value.length > PROFILE_FIELDS[key]) {
        throw new ValidationError(`${key} must be at most ${PROFILE_FIELDS[key]} characters`);
      }
      data[key] = value.trim();
    }

    if (interests !== undefined) {
      if (!Array.isArray(interests) || interests.some((item) => !INTERESTS.includes(item))) {
        throw new ValidationError(`interests must be an array of: ${INTERESTS.join(", ")}`);
      }
      data.interests = Array.from(new Set(interests));
    }

    if (language !== undefined) {
      if (typeof language !== "string" || !LANGUAGE_CODE.test(language)) {
        throw new ValidationError("language must be a two-letter ISO 639-1 code");
      }
      data.language = language;
    }

    // The client marks onboarding done; the server checks the answers are really there.
    if (onboardingComplete !== undefined) {
      if (onboardingComplete !== true) {
        throw new ValidationError("onboardingComplete can only be set to true");
      }
      const merged = { ...ctx.state.user, ...data };
      const missing = ONBOARDING_FIELDS.filter((field) => !merged[field]);
      if (!Array.isArray(merged.interests) || merged.interests.length === 0) {
        missing.push("interests");
      }
      if (missing.length > 0) {
        throw new ValidationError(`Answer these before finishing onboarding: ${missing.join(", ")}`);
      }
      data.onboardingComplete = true;
    }

    await userService(strapi).edit(ctx.state.user.id, data);
    ctx.body = await currentUser(strapi, ctx);
  },

  async addBookmark(ctx) {
    const { field, uid, documentId } = parseBookmarkParams(ctx);
    const target = await findPublishedTarget(strapi, uid, documentId);

    await userService(strapi).edit(ctx.state.user.id, {
      [field]: { connect: [{ id: target.id }] },
    });
    ctx.body = await currentUser(strapi, ctx);
  },

  async removeBookmark(ctx) {
    const { field, uid, documentId } = parseBookmarkParams(ctx);
    const target = await findPublishedTarget(strapi, uid, documentId);

    await userService(strapi).edit(ctx.state.user.id, {
      [field]: { disconnect: [{ id: target.id }] },
    });
    ctx.body = await currentUser(strapi, ctx);
  },
});
