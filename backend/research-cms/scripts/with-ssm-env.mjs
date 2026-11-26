// Runs a command with production config from SSM Parameter Store (/gdd/prod/backend/*)
// in its environment. Production keeps no .env on disk; the EC2 box reads SSM through
// its IAM role every time this starts (each deploy build, pm2 restart and reboot).
//
//   node scripts/with-ssm-env.mjs <cmd> [args...]
//
// SSM values override variables already in the environment. Never prints values.
import { execFileSync, spawn } from "node:child_process";

const PATH = "/gdd/prod/backend";
const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error("usage: with-ssm-env.mjs <cmd> [args...]");
  process.exit(2);
}

let params;
try {
  // The CLI follows NextToken itself, so this returns every parameter under the path.
  params = JSON.parse(
    execFileSync(
      "aws",
      ["ssm", "get-parameters-by-path", "--region", "us-east-2", "--path", PATH,
       "--with-decryption", "--query", "Parameters[].[Name,Value]", "--output", "json"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
    ),
  );
} catch (err) {
  console.error(`with-ssm-env: could not read ${PATH} from SSM: ${err.message}`);
  process.exit(1);
}
if (!Array.isArray(params) || params.length === 0) {
  console.error(`with-ssm-env: no parameters under ${PATH}; refusing to start without config`);
  process.exit(1);
}

const env = { ...process.env };
for (const [name, value] of params) env[name.slice(PATH.length + 1)] = value;
console.log(`with-ssm-env: loaded ${params.length} keys from ${PATH}`);

const child = spawn(cmd, args, { env, stdio: "inherit" });
child.on("error", (err) => {
  console.error(`with-ssm-env: could not start ${cmd}: ${err.message}`);
  process.exit(1);
});

// pm2 stops the app with SIGINT; pass stop signals on so Strapi shuts down cleanly.
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
