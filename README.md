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

The message JSON is printed into stdout.

```bash
npm i --save @oncarbon/git-changelog-generator-for-slack

npx git-changelog-generator-for-slack \
  --user="oncarbon" \
  --repo="git-changelog-generator-for-slack" \
  --header="New release"
  --preCommitsMsg="Following changes are now out:" \
  sha1 HEAD
```
