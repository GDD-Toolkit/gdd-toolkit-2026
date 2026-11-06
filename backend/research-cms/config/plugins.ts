import type { Core } from "@strapi/strapi";
import { isLocalDataSource } from "../src/utils/data-source";

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  const local = isLocalDataSource(env);

  // Local mode talks to the MinIO service in docker-compose.yml, which speaks
  // the S3 API, so the same provider is used in both modes.
  const s3Options = local
    ? {
        endpoint: "http://localhost:9100",
        forcePathStyle: true,
        region: "us-east-1",
        credentials: { accessKeyId: "minioadmin", secretAccessKey: "minioadmin" },
        params: { Bucket: "strapi-uploads" },
      }
    : {
        credentials: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
        },
        region: env("AWS_REGION"),
        params: {
          // No ACL header: the bucket has ACLs disabled (bucket owner enforced), so public read
          // access comes from the bucket policy. Without this the provider sends "public-read".
          ACL: null,
          Bucket: env("AWS_BUCKET"),
          signedUrlExpires: env.int("AWS_SIGNED_URL_EXPIRES", 15 * 60),
        },
      };

  // Local mode sends every email to the Mailpit service in docker-compose.yml
  // (inbox at http://localhost:8125), which needs no auth.
  const smtp = local
    ? { host: "localhost", port: 1125, secure: false }
    : {
        // Defaults target Gmail.
        host: env("SMTP_HOST") || "smtp.gmail.com",
        port: env.int("SMTP_PORT") || 587,
        secure: env.bool("SMTP_SECURE", false),
        ...(env("SMTP_USERNAME")
          ? { auth: { user: env("SMTP_USERNAME"), pass: env("SMTP_PASSWORD") } }
          : {}),
      };
  const from = env("SMTP_FROM") || (local ? "no-reply@localhost" : env("SMTP_USERNAME"));

  return {
    upload: {
      config: {
        provider: "aws-s3",
        providerOptions: { s3Options },
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
        providerOptions: smtp,
        settings: {
          defaultFrom: from,
          defaultReplyTo: from,
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
  };
};
export default config;
