# Git changelog generator for slack

Generate a slack message (JSON) from Git commits.

## Usage as a library

The message JSON is returned as a JS object.

```ts
import generateSlackMsg from "@oncarbon/git-changelog-generator-for-slack";

const msg = generateSlackMsg({
  from: "sha1",
  to: "HEAD",
  formatting: {
    // Optional github user and repo, used to create links to the commits
    // in the changelog message
    user: "oncarbon",
    repo: "git-changelog-generator-for-slack",
    // Optional texts for the message
    header: "New release",
    preCommitsMsg: "Following changes are now out:",
  },
});
```

## Usage as an executable

The message JSON is printed into stdout. Parameters can be given using either as arguments

```bash
npm i --save @oncarbon/git-changelog-generator-for-slack

npx git-changelog-generator-for-slack \
  --user="oncarbon" \
  --repo="git-changelog-generator-for-slack" \
  --header="New release"
  --preCommitsMsg="Following changes are now out:" \
  sha1 HEAD
```

or as env variables

```bash
npm i --save @oncarbon/git-changelog-generator-for-slack

SLACK_MSG_GH_USER="oncarbon" \
SLACK_MSG_GH_REPO="git-changelog-generator-for-slack" \
SLACK_MSG_HEADER="New release" \
SLACK_MSG_PRECOMMITS_MSG="Following changes are now out:" \
npx git-changelog-generator-for-slack sha1 HEAD
```
