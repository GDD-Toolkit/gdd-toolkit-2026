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
            // Tell Strapi to return signed URLs for private media.
            ACL: "private",
            signedUrlExpires: env.int("AWS_SIGNED_URL_EXPIRES", 60 * 60),
          },
        },
      },
      actionOptions: {
        // Omit ACL headers on writes to support Bucket owner enforced S3 buckets.
        upload: { ACL: undefined },
        uploadStream: { ACL: undefined },
        delete: {},
      },
    },
  },

  email: {
    config: {
      provider: "nodemailer",
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
      register: {
        allowedFields: ["firstName", "lastName", "institution", "department"],
      },
    },
  },
});
export default config;
