import simpleGit, { DefaultLogFields, GitError, ListLogLine } from "simple-git";

const git = simpleGit();
const isDebug = !!process.env.DEBUG;

export interface FormattingOpts {
  user?: string;
  repo?: string;
  header?: string;
  preCommitsMsg?: string;
}

export interface Opts {
  from: string;
  to: string;
  formatting: FormattingOpts;
}

async function format({ from, to, formatting }: Opts) {
  await ensureRevExists(from);
  await ensureRevExists(to);

  const commits = await getCommits(from, to);
  if (commits.total === 0) {
    return;
  }

  return formatSlackMessage(commits, formatting);
}

export default format;

async function run() {}

async function ensureRevExists(rev: string) {
  try {
    await git.show(rev);
  } catch (error) {
    const e = error as GitError;
    console.error(`ERR: Error fetching info about ${rev}. Make sure the revision exists.`);
    if (isDebug) console.error(e);
    process.exit(2);
  }
}

async function getCommits(from: string, to: string) {
  try {
    const commits = await git.log({
      from,
      to,
    });

    if (isDebug) {
      console.debug("Got commit:");
      console.debug(commits);
    }

    return commits;
  } catch (error) {
    const e = error as GitError;

    throw new Error(`ERR: Error fetching commits:\n${e.message}`);
  }
}

type Commits = Awaited<ReturnType<typeof getCommits>>;

function formatSlackMessage(commits: Commits, formatting: FormattingOpts) {
  const { header, preCommitsMsg } = formatting;
  const blocks = [];

  if (header) {
    blocks.push(headerBlock(header));
  }
  if (preCommitsMsg) {
    blocks.push(sectionBlock(preCommitsMsg));
  }

  if (header || preCommitsMsg) {
    blocks.push(divider());
  }

  blocks.push(...commits.all.map((c) => sectionBlock(formatCommit(c, formatting))));

  return {
    blocks,
  };
}

function formatCommit(commit: DefaultLogFields & ListLogLine, formatting: FormattingOpts) {
  const { user, repo } = formatting;
  const shortSha = commit.hash.substring(0, 6);
  const sha = repo && user ? link(shortSha, getCommitUrl(user, repo, commit.hash)) : shortSha;

  return [bold(commit.message), `${commit.author_name} (${commit.date}) (${sha})`, commit.body]
    .filter((x) => !!x)
    .join(" \n ");
}

function bold(text: string) {
  return `*${text}*`;
}

function link(text: string, url: string) {
  return `<${url}|${text}>`;
}

function getCommitUrl(user: string, repo: string, sha: string) {
  return `https://github.com/${user}/${repo}/commit/${sha}`;
}

function headerBlock(text: string) {
  return {
    type: "header",
    text: {
      type: "mrkdwn",
      text,
    },
  };
}

function sectionBlock(text: string) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
}

function divider() {
  return {
    type: "divider",
  };
}

run();
