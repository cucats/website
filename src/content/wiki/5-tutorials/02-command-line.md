---
title: The Command Line
description: Pipes, redirection and the handful of tools that do most of the work
---

The command line looks like a worse file manager until the moment it stops being one. The turning point is realising its tools are built to be combined, and that combining them answers questions no single program was written for.

This assumes you can already `cd` and `ls`.

## The idea it all rests on

Every command reads from standard input and writes to standard output. A pipe, `|`, connects one program's output to the next one's input:

```bash
cat access.log | grep "404" | wc -l
```

That counts the 404 lines in a log. None of those three programs knows about the others; each does one job and the pipe joins them up. Once this clicks you stop hunting for a tool that does exactly what you want and start assembling one.

You can also redirect to and from files:

```bash
command > out.txt      # write output to a file, replacing it
command >> out.txt     # append instead
command < in.txt       # read input from a file
command 2> errors.txt  # redirect error output only
command &> all.txt     # redirect both output and errors
```

> [!TIP]
> `>` truncates the file before the command runs, so `sort file.txt > file.txt` empties it. Write to a different name and then move it.

## Finding things

`grep` searches file contents:

```bash
grep "TODO" main.c              # lines containing TODO
grep -r "TODO" src/             # recursively through a directory
grep -i "todo" main.c           # case-insensitive
grep -n "TODO" main.c           # show line numbers
grep -v "debug" log.txt         # invert: lines that do not match
grep -c "TODO" main.c           # count matching lines
grep -E "^(cat|dog)s?" pets.txt # extended regex
```

You will use `-r`, `-n` and `-i` constantly. Where `ripgrep` is installed, `rg` is faster and recurses by default.

`find` searches by metadata, so name, type, size and age:

```bash
find . -name "*.ml"                  # by name
find . -type d -name "build"         # directories only
find . -size +10M                    # larger than 10 megabytes
find . -mtime -7                     # modified in the last week
find . -name "*.tmp" -delete         # find and remove
```

To run something on everything found, pipe into `xargs`:

```bash
find . -name "*.c" | xargs wc -l
```

> [!WARNING]
> `find -delete` and `xargs rm` do exactly what you asked, immediately and without confirmation. Run the `find` on its own and read the list before you append anything destructive.

## Reshaping text

These are the pieces you combine. Each is small on its own.

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

`uniq` only collapses adjacent duplicates, which is why `sort` nearly always comes first. That pairing gives the most useful pipeline on this page:

```bash
sort words.txt | uniq -c | sort -rn | head -n 20
```

The twenty most frequent lines in a file, with counts. The most common IP in a log, the most frequent word in an essay and the most common error message are all this pipeline with a different input.

## Making it repeatable

When a pipeline earns its keep, put it in a file:

```bash
#!/bin/bash
set -euo pipefail

target="${1:-.}"
echo "Counting lines of code in $target"
find "$target" -name "*.ml" | xargs wc -l | tail -n 1
```

Make it executable with `chmod +x script.sh` and run it as `./script.sh src/`.

Two lines there matter more than the rest. `set -euo pipefail` makes the shell exit on an error, on an undefined variable, and on a failure anywhere in a pipeline; without it a script carries on after a failed step and produces confidently wrong output, so put it at the top of everything you write. And quote your variables: `"$target"`, never bare `$target`. Unquoted, a path containing a space becomes two arguments, which is the most common bug in shell scripts by a wide margin.

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

Those three commands are enough to get the whole benefit, and it is essential for work on a remote machine.

## Small things that compound

- Press Tab constantly, for commands, paths and, with the right setup, arguments.
- `Ctrl-R` searches your command history, far faster than pressing Up thirty times.
- `!!` is the previous command, and `sudo !!` after a permission error is the classic use.
- `cd -` returns to the previous directory.
- `man command` or `command --help` beats searching the web and is correct for the version you have.
- Put aliases in `~/.bashrc` or `~/.zshrc` for anything you type repeatedly:

```bash
alias gs="git status"
alias ll="ls -lah"
```

## Where to go next

Part IB Unix Tools covers this ground properly and is worth taking. Beyond that, the way to learn is to notice when you are about to do something repetitive by hand and stop to work out the pipeline. The ten minutes it costs the first time comes back every time after.

[Debugging Effectively](/wiki/tutorials/debugging) and [Regular Expressions](/wiki/tutorials/regular-expressions) both build on this material.
