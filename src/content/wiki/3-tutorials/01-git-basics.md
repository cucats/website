---
title: Git Basics
description: Git for people who have only ever used the GitHub website
---

Plenty of people arrive having used GitHub entirely through the website — uploading files through the browser, editing with the pencil icon. That works until it doesn't, usually the first time you need to work on something over more than one sitting or with another person.

This guide covers the parts of Git you will actually use. It does not try to explain the object model, because you can be productive for a long time without it.

## The mental model

Git tracks **snapshots** of your project. There are three places a change can live:

1. **The working directory** — your files as they are on disk right now.
2. **The staging area** — changes you have marked as belonging in the next snapshot.
3. **The repository** — the permanent history of snapshots you have committed.

Almost every command you learn moves changes between these three. The staging area is the part that feels redundant at first; its purpose is to let you commit _some_ of your current changes rather than all of them.

## One-time setup

Set your identity, or your commits will be attributed to nothing useful:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@cam.ac.uk"
```

Set your default branch name and a sensible pull behaviour while you are here:

```bash
git config --global init.defaultBranch main
git config --global pull.rebase false
```

For GitHub authentication, use SSH keys — you will otherwise be pasting tokens forever:

```bash
ssh-keygen -t ed25519 -C "you@cam.ac.uk"
cat ~/.ssh/id_ed25519.pub
```

Paste the printed public key into GitHub under Settings → SSH and GPG keys. Test it:

```bash
ssh -T git@github.com
```

## The everyday loop

Ninety percent of your Git usage is this cycle:

```bash
git status                    # what has changed?
git add file.ml               # stage a specific file
git add .                     # or stage everything changed
git commit -m "Add parser"    # snapshot the staged changes
git push                      # send commits to GitHub
```

And to get other people's work:

```bash
git pull                      # fetch and merge remote changes
```

> [!TIP]
> Run `git status` constantly. It is not a sign of inexperience — it tells you what is staged, what is not, and usually suggests the exact command you want next. Experienced people run it more, not less.

## Writing commits that help you later

The person most inconvenienced by bad commit messages is you, three weeks later, trying to find where something broke.

- **Commit one logical change at a time.** A commit that fixes a bug and reformats forty files is impossible to review or revert.
- **Write the subject in the imperative**: "Add domino tiling example", not "added" or "adding". It reads as an instruction to the codebase.
- **Explain why, not what.** The diff already shows what changed. The message should say why it needed to.

If you need more than a subject line, leave a blank line and write a body:

```bash
git commit
```

With no `-m`, this opens your editor for a full message.

## Branches

A branch is a movable label pointing at a commit. Making one is instant and costs nothing, which is why Git users make so many.

```bash
git switch -c feature-name    # create a branch and move onto it
git switch main               # move back
git branch                    # list branches
```

Work on a branch, then push it and open a pull request:

```bash
git push -u origin feature-name
```

The `-u` sets the upstream, so later pushes on that branch are just `git push`.

## Undoing things

This is the section worth bookmarking. Almost everything in Git is recoverable, but the commands are unhelpfully named.

| You want to                                        | Command                                               |
| -------------------------------------------------- | ----------------------------------------------------- |
| Discard changes to a file you have not staged      | `git restore file.ml`                                 |
| Unstage a file but keep the changes                | `git restore --staged file.ml`                        |
| Fix the message of the last commit                 | `git commit --amend`                                  |
| Add a forgotten file to the last commit            | `git add file.ml` then `git commit --amend --no-edit` |
| Undo the last commit but keep the changes as edits | `git reset --soft HEAD~1`                             |
| Undo a commit that is already pushed               | `git revert <commit>`                                 |
| Stash your work temporarily                        | `git stash` then `git stash pop`                      |

> [!WARNING]
> `git reset --hard` deletes uncommitted work permanently, and there is no undo. Before running anything with `--hard`, run `git stash` — it costs a second and has saved a great many afternoons.

The distinction that matters: **`revert` is safe on shared history, `reset` is not.** `revert` makes a new commit undoing an old one, so everyone else's history stays valid. `reset` rewrites history, which breaks things for anyone who has already pulled it. Use `reset` only on commits you have not pushed.

## Merge conflicts

A conflict happens when two people changed the same lines. Git marks the file like this:

```text
<<<<<<< HEAD
let greeting = "hello"
=======
let greeting = "hi there"
>>>>>>> feature-name
```

To resolve it: open the file, delete the markers, leave the code you actually want (which may be a combination of both), then:

```bash
git add file.ml
git commit
```

There is no cleverness required. A conflict is just Git declining to guess.

## Reading history

```bash
git log --oneline --graph --all    # compact visual history
git log -p file.ml                 # every change to one file
git diff                           # unstaged changes
git diff --staged                  # staged changes
git blame file.ml                  # who last touched each line
```

`git log --oneline --graph --all` is worth aliasing — it is the fastest way to understand what state a repository is in.

## Things worth knowing early

**Add a `.gitignore` before your first commit.** Build artefacts, `_build/`, `node_modules/`, `.DS_Store` and compiled binaries should never be committed. Once something is in history, removing it properly is genuinely annoying.

**Never commit secrets.** API keys, passwords and tokens committed to a public repository are scraped within minutes. If it happens, treat the secret as compromised and rotate it — deleting the commit is not enough.

**Do not commit your supervision work to a public repository** if it contains solutions to exercises other students are still being set.

## Where to go next

The [Pro Git book](https://git-scm.com/book/en/v2) is free, well written, and the standard reference. Chapters 2 and 3 cover everything above in more depth. [Oh Shit, Git!?!](https://ohshitgit.com/) is a short, practical list of recoveries from common mistakes.
