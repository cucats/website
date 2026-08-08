---
title: Debugging Effectively
description: Finding bugs by narrowing the search rather than staring harder
---

Most people debug by rereading the code and hoping. That works for typos and fails for everything else, because the bug is almost always somewhere you are confident it isn't — otherwise you would have found it already.

Debugging well is a search problem. The skill is halving the space you have to search, repeatedly, until the bug has nowhere left to hide.

## The method

1. **Reproduce it reliably.** A bug you cannot trigger on demand cannot be fixed, only guessed at. If it happens one time in ten, find what distinguishes that time before doing anything else.
2. **Shrink the input.** Cut the failing case down until removing anything more makes the bug disappear. A five-line reproduction usually makes the cause obvious.
3. **Form one hypothesis.** Write it down, in the form "I think X is happening because Y".
4. **Test that hypothesis.** One change at a time.
5. **Repeat.** Each test should eliminate roughly half of what remains.

> [!TIP]
> Change one thing at a time. If you change three things and the bug goes away, you have learned nothing — you now have a working program and no idea why, which is a worse position than it sounds.

## Read the error message

This sounds patronising and it is the single most commonly skipped step. Error messages are usually specific, and people's eyes slide off them because they are ugly.

A stack trace is a record of how execution arrived at the failure. Read it in two passes:

- **The top frame** is where it actually broke.
- **The frames below** are who called whom to get there.

The most useful line is usually the topmost frame that is _your_ code rather than a library's. A crash inside a standard library function is almost never a bug in the standard library; it is your code passing it something wrong.

## Print debugging, done properly

There is no shame in print debugging. Professionals do it constantly. There is shame in doing it badly.

- **Label every print.** `print("here")` tells you nothing once you have four of them. `print("after parse, tokens =", tokens)` tells you everything.
- **Print the thing you are least sure about**, not the thing that is easiest to print.
- **Print at boundaries** — on entry and exit of the function you suspect. If the input is right and the output is wrong, the bug is inside. If the input is already wrong, move up the call chain.

That last point is the print-debugging version of halving the search space, and it is why it works.

## Using a debugger

A debugger does what printing does, without editing and rerunning. For C or C++, compile with debug symbols and no optimisation:

```bash
gcc -g -O0 program.c -o program
gdb ./program
```

The commands worth knowing:

| Command                           | What it does                           |
| --------------------------------- | -------------------------------------- |
| `run`                             | Start the program                      |
| `break main` or `break file.c:42` | Stop at a function or line             |
| `next`                            | Run the next line, stepping over calls |
| `step`                            | Run the next line, stepping into calls |
| `finish`                          | Run until the current function returns |
| `print x`                         | Show the value of `x`                  |
| `backtrace`                       | Show the call stack                    |
| `watch x`                         | Stop whenever `x` changes              |
| `continue`                        | Resume until the next breakpoint       |

`watch` is the underused one. If a variable is being corrupted and you have no idea where, a watchpoint finds it immediately rather than after an hour of stepping.

For Python, the debugger is built in. Drop this line where you want to stop:

```python
breakpoint()
```

You then get a prompt with much the same commands: `n` for next, `s` for step, `c` for continue, `p expr` to print, `bt` for a backtrace.

## Let Git find it

If the code worked last week and doesn't now, do not read the diff — bisect it. Git will binary-search your history for the commit that broke things:

```bash
git bisect start
git bisect bad                 # the current commit is broken
git bisect good v1.0           # this older commit worked
```

Git checks out a commit halfway between. Test it, then say `git bisect good` or `git bisect bad`, and repeat. Over 1000 commits this takes about ten steps. When you are done:

```bash
git bisect reset
```

If the test can be automated, let Git do the whole thing itself:

```bash
git bisect run ./test.sh
```

The script should exit 0 for good and non-zero for bad. This is the highest-leverage debugging tool most people never learn.

## Bugs that look like magic

When behaviour seems impossible, it is usually one of these:

- **You are not running the code you think you are.** Stale build, wrong file, wrong branch, cached bytecode, a shadowed installation. Add a deliberate syntax error and confirm it actually breaks.
- **Aliasing.** Two names refer to one object, so mutating through one changes the other. In Python, default arguments like `def f(xs=[])` are shared across calls — a classic.
- **Off-by-one.** Boundaries, `<` against `<=`, and inclusive against exclusive ranges. Test with an empty input and a one-element input; both find these fast.
- **Uninitialised memory** in C. The value is whatever was there before, so behaviour changes between runs and under a debugger.
- **Integer overflow or truncation**, especially converting between sizes or between signed and unsigned.
- **Concurrency.** If the bug moves when you add a print, timing is involved — see [Concurrency Basics](/wiki/tutorials/concurrency-basics).

## Preventing the next one

**Write assertions.** A check that fails loudly at the moment an invariant breaks is worth far more than debugging the consequences three functions later.

**Turn on warnings and read them.** `gcc -Wall -Wextra` catches a real fraction of bugs before you run anything. The warnings you ignore are the bugs you debug later.

**Write a test as soon as you have a reproduction.** You already did the hard work of shrinking the input; a test locks that in and stops the bug coming back.

## The last resort that works

Explain the problem out loud, in full, to somebody else — or to an inanimate object, which is where "rubber duck debugging" gets its name. The reason it works is that explaining forces you to state your assumptions explicitly, and the wrong one usually becomes obvious as you say it.

If nothing is working, stop. Sleep on it. The bug you cannot find at 2am is frequently obvious at 10am, and this is not a joke — it is the most reliable debugging technique on this page.

## Further reading

- [GDB documentation](https://www.sourceware.org/gdb/documentation/) — the official manual, better than its reputation
- [Python `pdb` documentation](https://docs.python.org/3/library/pdb.html)
- [`git bisect` documentation](https://git-scm.com/docs/git-bisect)
