---
title: Debugging
description: Reversible execution, sanitizers, and narrowing a search space you cannot single-step
---

Bisection over program state is the whole method, and the tooling exists to make each bisection step cheap. Most of what follows is about buying that cheapness back when the failure is rare, non-deterministic, or already over by the time you hear about it.

## Record and replay

`rr` records a program's non-deterministic inputs and replays them deterministically, which turns a heisenbug into a bug you can step through as often as you like. Reverse execution is the payoff: set a watchpoint on the corrupted field, `reverse-continue`, and land on the write that did it without reasoning about how execution got there.

That inverts the usual loop. You start from the observed corruption and walk backwards to its origin, with no need to hypothesise a cause and run forward to test it. For memory corruption and use-after-free that is the difference between an afternoon and a minute.

Recording overhead is modest for single-threaded work. Parallel programs are serialised onto one core while recording, so timing-dependent behaviour changes, which is exactly the case you wanted it for.

## Sanitizers

ASan instruments allocations with redzones and maintains shadow memory, catching overflow and use-after-free at the access with allocation and free stacks attached. Around 2x slowdown and a large memory multiplier.

UBSan traps the undefined constructs the optimiser is otherwise entitled to assume away, which is the class producing the most confusing symptoms, since the compiler has already reasoned from their absence.

TSan tracks happens-before and reports races that did not manifest on that run, which is what separates it from stress testing. It is the only tool here that finds a bug you failed to reproduce.

MSan catches reads of uninitialised memory and needs the whole program including libc instrumented, which is why it goes unused more often than it should.

ASan and TSan are mutually exclusive. Valgrind needs no rebuild and costs an order of magnitude more, which still makes it right for a binary you cannot recompile.

## Core dumps and post-mortem

A process that died in production leaves a core if the limits allow, and `coredumpctl` or the configured `core_pattern` decides whether you get one. Debugging it needs matching binaries and debug info, which is the argument for building with `-g` and shipping split debug files through a symbol server over stripping.

Separate debug info via `objcopy --only-keep-debug` keyed by build ID keeps the shipped binary small and the symbols reachable. Getting this wrong gets discovered at precisely the wrong moment.

## Bisection at every level

`git bisect run` with a script that exits zero or non-zero automates the search over history, and the discipline is writing a fast unambiguous test before starting.

The same idea applies below source control. Bisect over the input by shrinking it, over the flag space by halving the compiler options, over linked objects by swapping one translation unit at a time between a working and a broken build. C-Reduce automates input shrinking for compiler bugs, and the principle transfers to any deterministic failure with a large candidate space.

## Attaching to something already running

`gdb -p` stops the world, which is unacceptable on anything serving traffic. eBPF through `bpftrace` observes without stopping, so uprobes on a function boundary give you argument values and latency histograms from a live process at a cost you can leave enabled.

`perf trace`, `strace -f -e trace=` on a narrow filter, and `ltrace` cover the syscall and library boundary. For a hung process, `/proc/<pid>/stack` and `/proc/<pid>/wchan` say where the kernel put it, and `eu-stack` or `gdb -batch -ex bt` gives a userspace backtrace with no interactive session.

## What the optimiser did to your program

Stepping through optimised code lands on lines out of order and reports variables as optimised out, both of which are the debug info telling the truth about a program that no longer matches the source structure. `-Og` keeps the mapping close while preserving most of the transformations, which is generally the right build for stepping.

When behaviour differs between `-O0` and `-O2`, the default hypothesis is undefined behaviour in the program and not a compiler bug, and UBSan settles it faster than reading assembly. When it genuinely is a miscompilation, a reduced case and the exact compiler version are what the report needs.

## Reading

- [rr](https://rr-project.org/) for record and replay
- [Sanitizers](https://github.com/google/sanitizers/wiki) for ASan, TSan and MSan
- [bpftrace](https://bpftrace.org/) for live tracing
- [`git bisect` documentation](https://git-scm.com/docs/git-bisect)
