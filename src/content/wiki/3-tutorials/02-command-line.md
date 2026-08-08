---
title: The Command Line
description: Pipes, redirection and the handful of tools that do most of the work
---

The command line looks like a worse version of a file manager until the moment it isn't. The turning point is understanding that its tools are designed to be **combined**, and that combining them lets you answer questions no single program was written to answer.

This page covers the parts that earn their keep. It assumes you can already `cd` and `ls`.

## The idea that makes it worthwhile

Every command reads from **standard input** and writes to **standard output**. A pipe, written `|`, connects one program's output to the next one's input:

```bash
cat access.log | grep "404" | wc -l
```

That counts the 404 lines in a log. No program in that chain knows about the others; each does one thing, and the pipe composes them. Once this clicks, you stop looking for a tool that does exactly what you want and start building one from parts.

You can also redirect to and from files:

```bash
command > out.txt      # write output to a file, replacing it
command >> out.txt     # append instead
command < in.txt       # read input from a file
command 2> errors.txt  # redirect error output only
command &> all.txt     # redirect both output and errors
```

> [!TIP]
> `>` truncates the file **before** the command runs. `sort file.txt > file.txt` will empty the file. Write to a different name, then move it.

## Finding things

**`grep` searches file contents.**

```bash
grep "TODO" main.c              # lines containing TODO
grep -r "TODO" src/             # recursively through a directory
grep -i "todo" main.c           # case-insensitive
grep -n "TODO" main.c           # show line numbers
grep -v "debug" log.txt         # invert: lines NOT matching
grep -c "TODO" main.c           # count matching lines
grep -E "^(cat|dog)s?" pets.txt # extended regex
```

`-r`, `-n` and `-i` are the three you will use constantly. If `ripgrep` is installed, `rg` is faster and searches recursively with sensible defaults by default.

**`find` searches by file metadata** — name, type, size, age:

```bash
find . -name "*.ml"                  # by name
find . -type d -name "build"         # directories only
find . -size +10M                    # larger than 10 megabytes
find . -mtime -7                     # modified in the last week
find . -name "*.tmp" -delete         # find and remove
```

To run a command on everything found, pipe into `xargs`:

```bash
find . -name "*.c" | xargs wc -l
```

> [!WARNING]
> `find -delete` and `xargs rm` do exactly what you tell them, instantly and without confirmation. Run the `find` on its own first and read the list before adding anything destructive to the end of it.

## Reshaping text

These are the tools you combine in pipelines. Each is small on its own.

| Tool                        | What it does                                          |
| --------------------------- | ----------------------------------------------------- |
| `wc -l`                     | count lines                                           |
| `sort`                      | sort lines; `-n` numerically, `-r` reversed           |
| `uniq`                      | collapse _adjacent_ duplicate lines; `-c` counts them |
| `head -n 20` / `tail -n 20` | first or last lines; `tail -f` follows a growing file |
| `cut -d, -f2`               | pull out a column by delimiter                        |
| `tr`                        | translate or delete characters                        |
| `sed 's/old/new/g'`         | find and replace                                      |
| `awk '{print $1}'`          | field-based processing, a small language in itself    |

`uniq` only collapses **adjacent** duplicates, which is why it is nearly always preceded by `sort`. That pairing gives the single most useful pipeline in this whole page:

```bash
sort words.txt | uniq -c | sort -rn | head -n 20
```

Read right to left: the twenty most frequent lines in a file, with counts. Counting the most common IP addresses in a log, the most frequent words in an essay, or the most common error message are all this same pipeline with a different input.

## Making it repeatable

When a pipeline is worth keeping, put it in a file:

```bash
#!/bin/bash
set -euo pipefail

target="${1:-.}"
echo "Counting lines of code in $target"
find "$target" -name "*.ml" | xargs wc -l | tail -n 1
```

Make it executable with `chmod +x script.sh` and run it with `./script.sh src/`.

Two things in that script matter more than the rest:

- **`set -euo pipefail`** makes the shell exit on error (`-e`), on use of an undefined variable (`-u`), and on failure anywhere in a pipeline (`pipefail`). Without it a script keeps going after a failed step and produces confidently wrong results. Put it at the top of every script you write.
- **Quote your variables.** `"$target"`, not `$target`. Unquoted, a path containing a space becomes two arguments, and this is the most common bug in shell scripts by a wide margin.

## Managing what is running

```bash
command &          # run in the background
jobs               # list background jobs in this shell
fg                 # bring the last one back
Ctrl-C             # interrupt the running command
Ctrl-Z             # suspend it (resume with fg or bg)
ps aux | grep name # find a process
kill <pid>         # ask it to stop
kill -9 <pid>      # make it stop, ungracefully
htop               # interactive process viewer
```

For anything long-running over SSH, use `tmux`. It keeps your session alive when your connection drops, which it will:

```bash
tmux              # start a session
Ctrl-b then d     # detach, leaving it running
tmux attach       # come back to it later
```

This is essential for anything running on a remote machine, and knowing only those three commands is enough to get the benefit.

## Small things that compound

- **Tab completion.** Press Tab constantly — for commands, paths and, with the right setup, arguments.
- **`Ctrl-R`** searches your command history. Far faster than pressing Up thirty times.
- **`!!`** is the previous command. `sudo !!` after a permission error is the classic use.
- **`cd -`** returns to the previous directory.
- **`man command`** or `command --help` is faster than searching the web, and correct for the version you actually have.
- **Aliases** in `~/.bashrc` or `~/.zshrc` for anything you type repeatedly:

```bash
alias gs="git status"
alias ll="ls -lah"
```

## Where to go next

Part IB Unix Tools covers this ground in depth and is well worth taking. Beyond that, the best way to learn is to notice when you are about to do something repetitive by hand, and stop to work out the pipeline instead — the ten minutes you spend the first time is repaid every time after.

The [Debugging Effectively](/wiki/tutorials/debugging) and [Regular Expressions](/wiki/tutorials/regular-expressions) pages both build directly on this material.
