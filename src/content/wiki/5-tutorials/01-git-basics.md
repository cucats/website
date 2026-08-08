---
title: Git Basics
description: Git for people who have only ever used the GitHub website
---

Plenty of people arrive having used GitHub entirely through the browser, uploading files and editing with the pencil icon. That holds up until the first time you work on something across more than one sitting, or with another person.

This covers the parts of Git you will actually use. It skips the object model, because you can be productive for a long time without it.

## The mental model

Git tracks snapshots of your project, and a change can live in three places:

1. The working directory, meaning your files as they are on disk right now.
2. The staging area, holding changes you have marked as belonging in the next snapshot.
3. The repository, the permanent history of everything you have committed.

Nearly every command moves changes between these three. The staging area feels redundant at first; its job is letting you commit some of your current changes while leaving the others alone.

## One-time setup

Set your identity, or your commits get attributed to nothing useful:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@cam.ac.uk"
```

Set a default branch name and a sensible pull behaviour while you are here:

```bash
git config --global init.defaultBranch main
git config --global pull.rebase false
```

Use an SSH key for GitHub, or you will be pasting tokens forever:

```bash
ssh-keygen -t ed25519 -C "you@cam.ac.uk"
cat ~/.ssh/id_ed25519.pub
```

Paste the printed public key into GitHub under Settings, then SSH and GPG keys. Test it:

```bash
ssh -T git@github.com
```

## The everyday loop

Ninety percent of your Git usage is this:

```bash
git status                    # what has changed?
git add file.ml               # stage a specific file
git add .                     # or stage everything
git commit -m "Add parser"    # snapshot the staged changes
git push                      # send commits to GitHub
```

And to pick up other people's work:

```bash
git pull
```

> [!TIP]
> Run `git status` constantly. It shows what is staged, what is not, and usually suggests the exact command you want next. Experienced people run it more often than beginners do.

## Commits that help you later

Bad commit messages inconvenience you most, three weeks later, hunting for where something broke.

Commit one logical change at a time, since a commit that fixes a bug and reformats forty files can be neither reviewed nor reverted. Write the subject in the imperative, so "Add domino tiling example" over "added" or "adding". And explain why, because the diff already shows what changed.

Running `git commit` with no `-m` opens your editor, where you can write a subject line, a blank line, and then as much body as the change deserves.

## Branches

A branch is a movable label pointing at a commit. Making one is instant and free, which is why Git users make so many.

```bash
git switch -c feature-name    # create a branch and move onto it
git switch main               # move back
git branch                    # list branches
```

Push it and open a pull request:

```bash
git push -u origin feature-name
```

The `-u` sets the upstream, so later pushes on that branch are just `git push`.

## Undoing things

Worth bookmarking. Almost everything in Git is recoverable, though the commands are unhelpfully named.

| You want to                                        | Command                                               |
| -------------------------------------------------- | ----------------------------------------------------- |
| Discard changes to a file you have not staged      | `git restore file.ml`                                 |
| Unstage a file but keep the changes                | `git restore --staged file.ml`                        |
| Fix the message of the last commit                 | `git commit --amend`                                  |
| Add a forgotten file to the last commit            | `git add file.ml` then `git commit --amend --no-edit` |
| Undo the last commit, keeping the changes as edits | `git reset --soft HEAD~1`                             |
| Undo a commit that is already pushed               | `git revert <commit>`                                 |
| Stash your work temporarily                        | `git stash` then `git stash pop`                      |

> [!WARNING]
> `git reset --hard` deletes uncommitted work permanently and there is no undo. Run `git stash` before anything with `--hard` in it. It costs a second and has saved a lot of afternoons.

The distinction that matters: `revert` is safe on shared history and `reset` is not. `revert` adds a new commit undoing an old one, so everyone else's history stays valid. `reset` rewrites history, which breaks things for anyone who already pulled it. Keep `reset` for commits you have not pushed.

## Merge conflicts

A conflict happens when two people changed the same lines. Git marks the file:

```text
<<<<<<< HEAD
let greeting = "hello"
=======
let greeting = "hi there"
>>>>>>> feature-name
```

Open the file, delete the markers, leave the code you want, which may combine both, then:

```bash
git add file.ml
git commit
```

No cleverness is required. A conflict is Git declining to guess.

## Reading history

```bash
git log --oneline --graph --all    # compact visual history
git log -p file.ml                 # every change to one file
git diff                           # unstaged changes
git diff --staged                  # staged changes
git blame file.ml                  # who last touched each line
```

That first one is worth an alias. It is the fastest way to see what state a repository is in.

## Things worth knowing early

Add a `.gitignore` before your first commit. Build artefacts, `_build/`, `node_modules/`, `.DS_Store` and compiled binaries should never go in. Removing something properly once it is in history is genuinely annoying.

Never commit secrets. API keys, passwords and tokens pushed to a public repository get scraped within minutes, and if it happens you should treat the secret as compromised and rotate it, because deleting the commit is not enough.

Keep supervision work out of public repositories where it contains solutions to exercises other students are still being set.

## Where to go next

The [Pro Git book](https://git-scm.com/book/en/v2) is free and is the standard reference; chapters 2 and 3 cover all of the above in more depth. [Oh Shit, Git!?!](https://ohshitgit.com/) is a short list of recoveries from common mistakes.
