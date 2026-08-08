---
title: Git
description: The object model, refs, and the operations that rewrite history
---

Git is a content-addressed object store with a naming layer on top, and every command makes sense once you can see which of those two it is touching. The porcelain is a convenience over that; the model is what you debug against.

## Objects

Four types. A blob is file content with no name. A tree maps names to blobs and other trees along with a mode. A commit points at one tree, at zero or more parents, and carries author and committer metadata. A tag object annotates any of these.

Everything is addressed by the hash of its contents, so identical content stored twice is one object, and a commit's identity covers its entire reachable history. Rewriting anything in that history necessarily changes every descendant hash, which is the whole reason a rebase produces new commits and cannot preserve the old ones.

`git cat-file -p` on any hash prints the object. Reading a commit and then its tree, once, is worth more than any explanation of it.

## Refs and the index

A ref is a file containing a hash. Branches live under `refs/heads`, remote-tracking branches under `refs/remotes`, tags under `refs/tags`. `HEAD` is a symbolic ref pointing at a branch, or directly at a commit when detached. Branching is cheap because a branch is forty bytes.

The index is a staging area and also a cache of stat information for the working tree, which is what makes `git status` fast. `git add` writes blobs into the object store and records them in the index, so a staged change is durable before you commit.

The reflog is the safety net people do not know they have. Every update to a ref is journaled locally, so a commit orphaned by a bad reset stays reachable through `git reflog` until garbage collection expires it, which defaults to ninety days.

## Merging

A three-way merge takes the two heads and their merge base and applies both sets of changes. Conflicts arise where both sides touched the same region, and `merge.conflictStyle = zdiff3` shows the base alongside the two sides, which converts a lot of guesswork into reading.

`ort` is the current default strategy and handles renames, criss-cross merges and directory moves better than the recursive strategy it replaced. Rename detection is a similarity heuristic and not metadata, which is why a rename plus a heavy edit sometimes shows as a delete and an add.

`rerere` records how you resolved a conflict and replays it, which pays for itself on any long-lived branch that gets rebased repeatedly.

## Rewriting

`rebase` replays commits onto a new base, producing new objects. Interactive rebase gives you reorder, squash, edit and drop over that replay, and `--autosquash` with `--fixup` commits automates amending something three commits back.

`reset` moves a branch ref, and the flag says what happens below it: `--soft` moves the ref alone, `--mixed` also resets the index, `--hard` also discards working tree changes and is the only one that destroys uncommitted work.

`revert` creates a new commit undoing an old one, which is what you use on anything already published, since it adds history in place of rewriting it. `filter-repo` handles rewriting an entire history, and the case that forces it is a committed secret, where the correct response is to rotate the credential and treat the rewrite as cleanup.

`cherry-pick` applies a single commit's diff elsewhere, and `-x` records the origin in the message, which is the difference between a maintainable backport branch and an archaeology exercise.

## Finding things

`git log -S` searches for commits that change the number of occurrences of a string, and `-G` takes a regex over the diff. Either beats reading history by hand when hunting for where a line arrived.

`git log -L` follows a range of lines through renames and rewrites. `git blame -w -C -C` ignores whitespace and detects lines moved from other files, which stops blame terminating at a reformat.

`git bisect run` automates the search for the commit that broke a test, and [Debugging](/wiki/tutorials/debugging) covers it further.

## Working with other people

A branch that is rebased and force-pushed rewrites history under reviewers, so `--force-with-lease` refuses when the remote has moved, which is the difference between rewriting your own work and discarding someone else's.

Merge commits preserve topology and rebases produce a linear history, and the choice is a project convention over a correctness question. What matters is that everyone applies the same one, since a repository mixing both is hard to read either way.

Signing with `-S` or an SSH key gives commits provenance. The committer field is free text, and anyone can author a commit as anyone.

## Reading

- [Pro Git](https://git-scm.com/book/en/v2), whose chapter 10 covers the object model directly
- [gitrevisions](https://git-scm.com/docs/gitrevisions) for the range syntax, which is worth knowing properly
- [Oh Shit, Git!?!](https://ohshitgit.com/) for recoveries, most of which are the reflog
