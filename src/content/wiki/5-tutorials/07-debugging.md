---
title: Debugging Effectively
description: Finding bugs by narrowing the search, not by staring harder
---

Most people debug by rereading the code and hoping. That works for typos and fails for everything else, because the bug is nearly always somewhere you are confident it is not. If it were somewhere you suspected, you would have found it.

Debugging is a search problem. The skill is halving the space you have to search, over and over, until the bug has nowhere left to hide.

## The method

1. Reproduce it reliably. A bug you cannot trigger on demand can only be guessed at. If it shows up one time in ten, work out what distinguishes that time before doing anything else.
2. Shrink the input, cutting the failing case down until removing anything more makes the bug disappear. A five-line reproduction usually makes the cause obvious on its own.
3. Form one hypothesis and write it down, in the shape "I think X is happening because Y".
4. Test that hypothesis, changing one thing.
5. Repeat, aiming for each test to eliminate about half of what remains.

> [!TIP]
> Change one thing at a time. Change three and watch the bug vanish, and you have learned nothing: you now have a working program and no idea why, which is worse than it sounds.

## Read the error message

This sounds patronising and it is the most commonly skipped step. Error messages are usually specific, and people's eyes slide off them because they are ugly.

A stack trace records how execution reached the failure. Read it in two passes: the top frame is where it broke, and the frames below show who called whom to get there. The most useful line is normally the topmost frame in your own code. A crash inside a standard library function almost never means a bug in the standard library; your code passed it something wrong.

## Print debugging, done properly

There is no shame in print debugging and professionals do it constantly. There is shame in doing it badly.

Label every print, because `print("here")` tells you nothing once four of them exist, while `print("after parse, tokens =", tokens)` tells you everything. Print the thing you are least sure about, over the thing that is easiest to print. And print at boundaries, on entry to and exit from the function you suspect: if the input is right and the output is wrong, the bug is inside, and if the input is already wrong, move up the call chain.

That last one is the print-debugging version of halving the search space, which is why it works so well.

## Using a debugger

A debugger does what printing does without the edit-and-rerun cycle. For C or C++, compile with debug symbols and no optimisation:

```bash
gcc -g -O0 program.c -o program
gdb ./program
```

| Command                           | What it does                           |
| --------------------------------- | -------------------------------------- |
| `run`                             | start the program                      |
| `break main` or `break file.c:42` | stop at a function or line             |
| `next`                            | run the next line, stepping over calls |
| `step`                            | run the next line, stepping into calls |
| `finish`                          | run until the current function returns |
| `print x`                         | show the value of `x`                  |
| `backtrace`                       | show the call stack                    |
| `watch x`                         | stop whenever `x` changes              |
| `continue`                        | resume until the next breakpoint       |

`watch` is the underused one. When a variable is being corrupted and you have no idea where, a watchpoint finds it immediately, where stepping takes an hour.

Python has a debugger built in. Drop this where you want to stop:

```python
breakpoint()
```

You get a prompt with much the same commands: `n` for next, `s` for step, `c` for continue, `p expr` to print, `bt` for a backtrace.

## Let Git find it

Code that worked last week and does not now calls for bisecting, over reading the diff. Git binary-searches your history for the commit that broke things:

```bash
git bisect start
git bisect bad                 # the current commit is broken
git bisect good v1.0           # this older commit worked
```

Git checks out a commit halfway between. Test it, say `git bisect good` or `git bisect bad`, repeat. Over a thousand commits that takes about ten steps. When you are done:

```bash
git bisect reset
```

Automate the test and Git will do the whole thing itself:

```bash
git bisect run ./test.sh
```

The script exits 0 for good and non-zero for bad. This is the highest-leverage debugging tool most people never learn.

## Bugs that look like magic

Impossible-looking behaviour is usually one of these.

You are not running the code you think you are, thanks to a stale build, the wrong file, the wrong branch, cached bytecode or a shadowed installation. Add a deliberate syntax error and confirm it actually breaks.

Aliasing, where two names refer to one object so mutating through one changes the other. In Python, default arguments like `def f(xs=[])` are shared across calls, which is the classic case.

Off-by-one, at boundaries, on `<` against `<=`, and on inclusive against exclusive ranges. Testing with an empty input and a one-element input finds these fast.

Uninitialised memory in C, where the value is whatever was there before, so behaviour changes between runs and under a debugger.

Integer overflow or truncation, especially converting between sizes or between signed and unsigned.

Concurrency. A bug that moves when you add a print statement involves timing, so see [Concurrency Basics](/wiki/tutorials/concurrency-basics).

## Preventing the next one

Write assertions. A check that fails loudly the moment an invariant breaks beats debugging the consequences three functions later.

Turn on warnings and read them, since `gcc -Wall -Wextra` catches a real fraction of bugs before you run anything. The warnings you ignore become the bugs you debug.

Write a test as soon as you have a reproduction. You already did the hard work of shrinking the input, and a test locks that in.

## The last resort that works

Explain the problem out loud and in full, to someone else or to an inanimate object, which is where rubber duck debugging gets its name. It works because explaining forces you to state your assumptions, and the wrong one usually becomes obvious as you say it.

When nothing is working, stop and sleep on it. The bug you cannot find at 2am is frequently obvious at 10am. This is not a joke; it is the most reliable technique on this page.

## Further reading

- [GDB documentation](https://www.sourceware.org/gdb/documentation/), better than its reputation
- [Python `pdb` documentation](https://docs.python.org/3/library/pdb.html)
- [`git bisect` documentation](https://git-scm.com/docs/git-bisect)
