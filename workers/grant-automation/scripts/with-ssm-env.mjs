// Runs a command with production config from SSM Parameter Store in its environment.
// Production keeps no .env on disk; the EC2 box reads SSM through its IAM role every
// time this starts (each pm2 start, cron run and reboot). Adapted from the CMS's
// scripts/with-ssm-env.mjs, with one or more paths instead of a fixed one.
//
//   node scripts/with-ssm-env.mjs --path /gdd/prod/grants [--path ...] <cmd> [args...]
//
// Later paths override earlier ones, and SSM values override variables already in the
// environment. Never prints values.
import { execFileSync, spawn } from "node:child_process";

const argv = process.argv.slice(2);
const paths = [];
while (argv[0] === "--path" && argv[1]) {
  paths.push(argv[1].replace(/\/$/, ""));
  argv.splice(0, 2);
}
const [cmd, ...args] = argv;
if (paths.length === 0 || !cmd) {
  console.error("usage: with-ssm-env.mjs --path <ssm path> [--path ...] <cmd> [args...]");
  process.exit(2);
}

const env = { ...process.env };
for (const path of paths) {
  let params;
  try {
    // The CLI follows NextToken itself, so this returns every parameter under the path.
    params = JSON.parse(
      execFileSync(
        "aws",
        ["ssm", "get-parameters-by-path", "--region", "us-east-2", "--path", path,
         "--with-decryption", "--query", "Parameters[].[Name,Value]", "--output", "json"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
      ),
    );
  } catch (err) {
    console.error(`with-ssm-env: could not read ${path} from SSM: ${err.message}`);
    process.exit(1);
  }
  if (!Array.isArray(params) || params.length === 0) {
    console.error(`with-ssm-env: no parameters under ${path}; refusing to start without config`);
    process.exit(1);
  }
  for (const [name, value] of params) env[name.slice(path.length + 1)] = value;
  console.log(`with-ssm-env: loaded ${params.length} keys from ${path}`);
}

const child = spawn(cmd, args, { env, stdio: "inherit" });
child.on("error", (err) => {
  console.error(`with-ssm-env: could not start ${cmd}: ${err.message}`);
  process.exit(1);
});

// pm2 stops the app with SIGINT; pass stop signals on so the child shuts down cleanly.
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => child.kill(sig));
}

child.on("exit", (code, signal) => {
  if (signal) {
    // Die the same way the child did, so the caller sees the signal.
    process.removeAllListeners(signal);
    process.kill(process.pid, signal);
  } else {
    process.exit(code);
  }
});
