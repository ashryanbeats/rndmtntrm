import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const checks = [
  { script: "lint" },
  { script: "typecheck" },
  { script: "knip" },
  { script: "test" },
];

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

export const runNpmScript = ({ script }) => {
  const result = spawnSync(npmCommand, ["run", script], { stdio: "inherit" });

  if (result.error) {
    console.error(`Failed to run npm script "${script}":`, result.error);
    return 1;
  }

  return typeof result.status === "number" ? result.status : 1;
};

export const runChecks = (run = runNpmScript, logger = console) => {
  const failures = [];

  for (const check of checks) {
    const exitCode = run(check);

    if (exitCode !== 0) {
      failures.push({ check, exitCode });
    }
  }

  if (failures.length > 0) {
    logger.error(
      `Failed checks: ${failures
        .map(({ check }) => check.script)
        .join(", ")}`,
    );
    return 1;
  }

  logger.log("All checks passed.");
  return 0;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exitCode = runChecks();
}
