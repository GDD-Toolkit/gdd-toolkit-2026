// Creates the `grants` schema and its three roles. Run once per database as a
// user that can create roles: the compose superuser locally, the RDS master
// user in production. Idempotent: re-running resets the role passwords and
// re-applies the grants. `--print` shows the SQL (passwords masked) and exits.
//
//   grants_owner   owns the schema, runs migrations        (DATABASE_OWNER_URL)
//   grants_worker  SELECT / INSERT / UPDATE on every table (DATABASE_URL)
//   grants_reader  SELECT only, for the read API            (DATABASE_READER_URL)
import pg from "pg";
import { env } from "../src/env.js";

const ROLES = ["owner", "worker", "reader"] as const;

function statements(password: (role: (typeof ROLES)[number]) => string): string[] {
  const out: string[] = [];
  for (const role of ROLES) {
    const name = `grants_${role}`;
    out.push(`DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${name}') THEN
    CREATE ROLE ${name} LOGIN PASSWORD ${password(role)};
  ELSE
    ALTER ROLE ${name} WITH LOGIN PASSWORD ${password(role)};
  END IF;
END $$;`);
  }
  // The RDS master user is not a superuser: it must be a member of grants_owner
  // to create objects on its behalf and to set its default privileges.
  out.push(`GRANT grants_owner TO CURRENT_USER;`);
  // drizzle's migrator runs CREATE SCHEMA IF NOT EXISTS, which checks CREATE on
  // the database before it notices the schema exists.
  out.push(`DO $$ BEGIN EXECUTE format('GRANT CREATE ON DATABASE %I TO grants_owner', current_database()); END $$;`);
  out.push(`CREATE SCHEMA IF NOT EXISTS grants AUTHORIZATION grants_owner;`);
  out.push(`GRANT USAGE ON SCHEMA grants TO grants_worker, grants_reader;`);
  // Tables the migrations will create later…
  out.push(
    `ALTER DEFAULT PRIVILEGES FOR ROLE grants_owner IN SCHEMA grants GRANT SELECT, INSERT, UPDATE ON TABLES TO grants_worker;`,
  );
  out.push(`ALTER DEFAULT PRIVILEGES FOR ROLE grants_owner IN SCHEMA grants GRANT SELECT ON TABLES TO grants_reader;`);
  // …and any that already exist (re-run after a migration).
  out.push(`GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA grants TO grants_worker;`);
  out.push(`GRANT SELECT ON ALL TABLES IN SCHEMA grants TO grants_reader;`);
  return out;
}

if (process.argv.includes("--print")) {
  console.log(statements((role) => `'<GRANTS_${role.toUpperCase()}_PASSWORD>'`).join("\n\n"));
  process.exit(0);
}

const client = new pg.Client({
  connectionString: env.DATABASE_ADMIN_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
});
await client.connect();
try {
  for (const statement of statements((role) => client.escapeLiteral(env.rolePassword(role)))) {
    await client.query(statement);
  }
  const { rows } = await client.query<{ owner: string; roles: string }>(
    `SELECT pg_get_userbyid(nspowner) AS owner,
            (SELECT string_agg(rolname, ', ' ORDER BY rolname) FROM pg_roles WHERE rolname LIKE 'grants\\_%') AS roles
       FROM pg_namespace WHERE nspname = 'grants'`,
  );
  console.log(`grants schema owned by ${rows[0]?.owner}; roles: ${rows[0]?.roles}`);
} finally {
  await client.end();
}
