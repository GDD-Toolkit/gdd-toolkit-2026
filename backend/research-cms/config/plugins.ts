import type { Core } from "@strapi/strapi";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env("AWS_ACCESS_KEY_ID"),
            secretAccessKey: env("AWS_ACCESS_SECRET"),
          },
          region: env("AWS_REGION"),
          params: {
            Bucket: env("AWS_BUCKET"),
            signedUrlExpires: env.int("AWS_SIGNED_URL_EXPIRES", 15 * 60),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  email: {
    config: {
      provider: "nodemailer",
      // Defaults target Gmail. For local development point SMTP_HOST/SMTP_PORT
      // at a mail catcher such as Mailpit (localhost:1025), which needs no auth.
      providerOptions: {
        host: env("SMTP_HOST") || "smtp.gmail.com",
        port: env.int("SMTP_PORT") || 587,
        secure: env.bool("SMTP_SECURE", false),
        ...(env("SMTP_USERNAME")
          ? { auth: { user: env("SMTP_USERNAME"), pass: env("SMTP_PASSWORD") } }
          : {}),
      },
      settings: {
        defaultFrom: env("SMTP_FROM") || env("SMTP_USERNAME"),
        defaultReplyTo: env("SMTP_FROM") || env("SMTP_USERNAME"),
      },
    },
  },

  "users-permissions": {
    config: {
      // Extra sign-up fields the register endpoint may accept. Anything else
      // in the body is rejected by Strapi with "Invalid parameters".
      // Role is never accepted: new users always get the default role (Student).
      register: {
        allowedFields: ["firstName", "lastName", "institution", "department"],
      },
    },
  },
});
export default config;
