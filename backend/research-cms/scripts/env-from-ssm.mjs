// Writes the production .env from SSM Parameter Store (/gdd/prod/backend/*).
// Runs in the deploy workflow on the EC2 box, which reads SSM through its IAM role.
//
//   node scripts/env-from-ssm.mjs <output-file>
//
// Values are written unquoted, so a value dotenv would read differently unquoted
// (a '#', quotes, surrounding whitespace, a newline) fails the deploy instead of
// silently changing. Never prints values.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const PATH = "/gdd/prod/backend";
const out = process.argv[2];
if (!out) throw new Error("usage: env-from-ssm.mjs <output-file>");

// The CLI follows NextToken itself, so this returns every parameter under the path.
const params = JSON.parse(
  execFileSync(
    "aws",
    ["ssm", "get-parameters-by-path", "--region", "us-east-2", "--path", PATH,
     "--with-decryption", "--query", "Parameters[].[Name,Value]", "--output", "json"],
    { encoding: "utf8" },
  ),
);
if (params.length === 0) throw new Error(`no parameters under ${PATH}`);

const lines = params
  .map(([name, value]) => {
    const key = name.slice(PATH.length + 1);
    if (/[#"'`\r\n]/.test(value) || value !== value.trim()) {
      throw new Error(`${key}: value needs quoting in .env; this script doesn't support that`);
    }
    return `${key}=${value}`;
  })
  .sort();

writeFileSync(out, lines.join("\n") + "\n", { mode: 0o600 });
console.log(`wrote ${lines.length} keys from ${PATH}`);
