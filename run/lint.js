#!/usr/bin/env node

import path from "path";
import { readAccess } from "../lib/fs";
import { spawn, exec } from "../lib/childProcess";

function fileInOriginRepo(fileName) {
  return readAccess(path.resolve(process.cwd(), fileName));
}

async function lint(staged) {
  const args = ["eslint"];

  let stagedFiles = [];
  if (staged) {
    const { stdout } = await exec(
      "git status -s -uno | grep -v D |  grep -v '^ ' | awk '{print $2}' | grep js$"
    );
    stagedFiles = stdout.split("\n");
    stagedFiles.pop();
  }

  if (
    !await fileInOriginRepo(".eslintrc") &&
    !await fileInOriginRepo(".eslintrc.js")
  ) {
    args.push("--config", path.resolve(__dirname, "../.eslintrc.js"));
  }

  if (staged) {
    args.push("--fix", "--no-ignore", ...stagedFiles);
  } else {
    args.push("--ignore-path", ".gitignore", ".");
  }

  await spawn("npx", args, {
    env: process.env,
    cwd: process.cwd(),
    stdio: "inherit"
  });

  if (staged) {
    await spawn("git", ["add", "--force", ...stagedFiles], {
      env: process.env,
      cwd: process.cwd(),
      stdio: "inherit"
    });
  }
}

lint(process.argv.includes("--staged")).then(
  () => console.log("Lint completed"),
  e => {
    require("fs").writeFileSync("/Users/jifeon/test", e, "utf8");
    console.error(e);
    process.exit(1);
  }
);
