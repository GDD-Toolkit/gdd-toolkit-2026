import type { Core } from '@strapi/strapi';
import { isLocalDataSource } from '../src/utils/data-source';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  // Where uploads live, so the admin panel is allowed to show images and audio
  // from there. Seed data references files in the production bucket, so local
  // mode allows S3 as well as MinIO.
  const mediaHosts = isLocalDataSource(env)
    ? ['http://localhost:9100', 'https://*.amazonaws.com']
    : [`https://${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`];

  // Browser origins allowed to call this API. Any other Origin (including `null`)
  // gets no Access-Control-Allow-Origin header, so the browser blocks the response.
  const corsOrigins = env.array('CORS_ORIGINS', [
    'https://devethicstoolkit.umd.edu',
    'https://cms.devethicstoolkit.umd.edu',
    'http://localhost:5173',
  ]);

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', ...mediaHosts],
            'media-src': ["'self'", 'data:', 'blob:', ...mediaHosts],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: corsOrigins,
        credentials: true,
        // Seconds a browser may cache a preflight. Chrome caps this at 2 hours anyway.
        maxAge: 3600,
      },
    },
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
