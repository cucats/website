---
title: The Shell
description: File descriptors, process groups, signals and the expansion order
---

The shell is a process orchestrator with a string-substitution language attached, and most of the confusing behaviour comes from the order in which that substitution happens.

## Expansion order

The sequence is fixed: brace expansion, tilde expansion, parameter and variable expansion, command substitution, arithmetic expansion, then word splitting, then pathname expansion, then quote removal.

Word splitting happening after parameter expansion and before pathname expansion is the source of nearly every shell bug. An unquoted variable containing a space becomes two words, then each word is globbed. Quoting suppresses splitting and globbing together, which is why `"$var"` is the default and bare `$var` is a deliberate choice.

`IFS` controls the splitting characters, and the default of space, tab and newline is why filenames with spaces break naive scripts. `"$@"` expands to one word per argument with splitting suppressed inside each, which `"$*"` does not, and the difference matters every time you forward arguments.

`set -u` turns an unset variable into an error, and `${var:-default}` and `${var:?message}` handle the intentional cases. `set -o pipefail` makes a pipeline's status the last non-zero one, since without it a failing producer feeding a succeeding consumer reports success.

## File descriptors

Redirection manipulates the descriptor table before exec. `2>&1` duplicates descriptor 1 into 2 at the point it appears, so `cmd 2>&1 >file` sends stderr to the original stdout and stdout to the file, and `cmd >file 2>&1` sends both to the file. The order is the whole meaning.

Process substitution `<(cmd)` gives a path to a pipe, which is what lets a command that demands a filename read from another command. `diff <(sort a) <(sort b)` is the canonical use.

Here-documents and here-strings feed a descriptor without a temporary file, and quoting the delimiter suppresses expansion inside the body, which is the difference between a template and a landmine.

`exec 3<>file` opens a descriptor in the shell itself, which is the mechanism behind lock files with `flock` and any script that needs to keep a handle open across commands.

## Processes, groups and signals

A pipeline runs its stages concurrently in one process group, and the terminal's foreground process group receives keyboard signals. Ctrl-C sends SIGINT to the whole group, which is why interrupting a pipeline stops all of it.

SIGHUP arrives when the terminal goes away, which is what kills a job on disconnect. `nohup` ignores it, `disown` removes the job from the shell's table, and a terminal multiplexer avoids the situation by keeping the session alive on the far end. Under systemd, a user service is the durable answer.

`trap` installs handlers, and `trap cleanup EXIT` is the reliable way to remove a temporary directory, since it fires on normal exit and on most fatal signals. SIGKILL cannot be trapped, so anything that must survive it belongs in a supervisor.

Exit status 128 plus the signal number is how a signal death is reported, which is where 137 for SIGKILL comes from, and it appears constantly in container diagnostics.

## Job control and background work

`&` backgrounds a job in the same session, so it still dies with the shell. `jobs`, `fg` and `bg` operate on the shell's job table, and `wait` blocks for children, with `wait -n` returning when any one finishes, which is the primitive for a bounded parallel loop.

`xargs -P` handles the common parallel case directly, and `-0` with `find -print0` is the pairing that survives filenames containing newlines. GNU `parallel` covers the cases with structured output.

## Text processing that scales

`sort` on a large file spills to temporary storage, and `LC_ALL=C` changes collation to byte order, which is both faster and the only way to get a stable ordering independent of locale.

`awk` is a language, and a single pass in awk frequently replaces a pipeline of four tools. Its associative arrays make counting and grouping a one-liner.

`sed -i` differs between GNU and BSD in whether the backup suffix is optional, which is the portability trap most likely to bite a script written on macOS and run on Linux.

## Writing scripts that fail properly

`set -euo pipefail` is the standard preamble, with the caveat that `-e` has a long list of exceptions: it does not fire inside a condition, inside `||`, or for any command other than the last in a pipeline without `pipefail`.

`shellcheck` catches quoting bugs, unreachable code and the portability traps, and running it in CI is the cheapest quality gate available for shell.

Past a few hundred lines the honest signal is to stop. Shell is a good glue language and a poor general one, and the point where you want an array of structs is the point to switch.

## Reading

- [The POSIX shell command language](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html) for the expansion order as specified
- [Bash reference manual](https://www.gnu.org/software/bash/manual/bash.html)
- [ShellCheck](https://www.shellcheck.net/)
