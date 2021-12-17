#!/usr/bin/env node

import minimist from "minimist";
import format from "./lib";

const argv = minimist(process.argv.slice(2));

async function run() {
  if (argv.help) {
    printUsage();
    process.exit(0);
  }

  const [from, to] = argv._;

  const user = argv.user || process.env.SLACK_MSG_GH_USER;
  const repo = argv.repo || process.env.SLACK_MSG_GH_REPO;
  const header = argv.header || process.env.SLACK_MSG_HEADER;
  const preCommitsMsg = argv.preCommitsMsg || process.env.SLACK_MSG_PRECOMMITS_MSG;

  if (!from || !to) {
    printUsage();
    process.exit(2);
  }

  function printUsage() {
    console.log("Usage:");
    console.log("    git-changelog-generator-for-slack <from_revision> <to_revision>");
  }

  try {
    const slackMsg = await format({
      from,
      to,
      formatting: {
        user,
        repo,
        header,
        preCommitsMsg,
      },
    });

    console.log(JSON.stringify(slackMsg));
  } catch (error) {
    const e = error as Error;
    console.error(e.message);
    process.exit(2);
  }
}

run();
