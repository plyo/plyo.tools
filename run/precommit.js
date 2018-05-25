#!/usr/bin/env node

import path from "path";
import { readAccess } from "../lib/fs";
import { spawn, exec } from "../lib/childProcess";

async function fileInOriginRepo(fileName) {
  return readAccess(path.resolve(process.cwd(), fileName));
}

async function precommit() {
  const { stdout } = await exec("git diff --name-only --cached | grep js$");
  const stagedFiles = stdout.split("\n");
  stagedFiles.pop();

  console.log(stagedFiles);

  //
  //
  // const args = ['lint-staged'];
  //
  // if (!await fileInOriginRepo('lint-staged.config.js')) {
  //   args.push('--config', path.resolve(__dirname, '../lint-staged.config.js'));
  // }
  //
  // console.log(args);
  // await spawn('npx', args, {
  //   env: process.env,
  //   cwd: process.cwd(),
  //   stdio: 'inherit',
  // });
}

precommit().then(
  () => console.log("Pre commit completed"),
  e => {
    console.error(e);
    throw e;
  }
);
