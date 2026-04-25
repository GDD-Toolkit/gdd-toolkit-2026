/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_URL: string;
  readonly VITE_STRAPI_API_TOKEN?: string;
  /** Override plural API ID if not `cohorts` in Strapi */
  readonly VITE_STRAPI_COHORTS_PLURAL?: string;
  /** Override plural API ID if not `database-tables` in Strapi */
  readonly VITE_STRAPI_DATABASE_TABLES_PLURAL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
