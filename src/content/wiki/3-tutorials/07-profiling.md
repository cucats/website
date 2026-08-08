---
title: Profiling and Performance
description: Measuring before optimising, so you speed up the part that is actually slow
---

Programmers are famously bad at guessing which part of a program is slow. The intuition that says "this nested loop looks expensive" is wrong often enough that acting on it wastes most of the effort spent optimising — you make the wrong thing faster and the program is no better.

Profiling replaces the guess with a measurement. It is not an advanced technique; it takes about two minutes and it is the difference between optimising and fiddling.

## The order of operations

1. **Make it correct.** A fast wrong answer is worthless, and optimisation makes code harder to fix.
2. **Decide whether it is fast enough.** If it is, stop. Optimisation costs readability, and you spend that permanently.
3. **Measure** to find where the time actually goes.
4. **Improve the biggest cost**, then measure again.

Step 4 repeats, because the bottleneck moves. Once you fix the thing taking 60% of the time, something else is now the largest share.

> [!TIP]
> Fix the algorithm before the constants. Going from $O(n^2)$ to $O(n \log n)$ beats any amount of micro-optimisation on a large input, and no amount of tuning rescues a fundamentally wrong approach. Look at your complexity first — see [Competitive Programming](/wiki/tutorials/competitive-programming) for how to budget it.

## Timing the whole thing

Start crude. Often this is all you need:

```bash
time ./program
```

That reports **real** (wall-clock time), **user** (CPU time in your code) and **sys** (CPU time in the kernel). The relationship between them is informative on its own:

- Real time much larger than user plus sys means you are **waiting** — for disk, network or a lock. Optimising computation will not help.
- User time dominating means you are genuinely **compute-bound**, and profiling will show you where.

To time a region inside a program, record a monotonic clock before and after. In Python:

```python
import time

start = time.perf_counter()
result = expensive_thing()
print(f"took {time.perf_counter() - start:.3f}s")
```

Use `perf_counter`, not `time.time()`, which can jump if the system clock is adjusted.

## Profiling properly

A profiler tells you where time is spent without you having to guess where to put timers.

**Python** has one built in:

```bash
python -m cProfile -s cumtime script.py | head -n 30
```

Sorting by `cumtime` (cumulative time, including callees) shows which high-level operations are expensive. Sorting by `tottime` instead shows which individual functions are burning CPU themselves. Both views are useful and answer different questions.

**C and C++** on Linux use `perf`:

```bash
gcc -g -O2 program.c -o program
perf record ./program
perf report
```

Compile with optimisation **and** debug symbols. Profiling an unoptimised build measures a program you are not going to ship.

**Java** ships with Java Flight Recorder, and most JVM profilers attach to a running process.

Whatever the language, look for the same shapes: one function dominating, a cheap function called an enormous number of times, or time spent somewhere you did not expect at all. The third is the most common and the most valuable.

## Where the time usually is

In practice, slow programs are usually slow for one of a small number of reasons.

**The wrong algorithm or data structure.** Repeated linear scans of a list where a hash set would answer in constant time. Membership tests inside a loop, turning $O(n)$ into $O(n^2)$. This is the first thing to check and the most common answer.

**Work repeated needlessly.** The same value recomputed every iteration when it could be computed once outside the loop, or cached across calls.

**I/O in a loop.** Reading a file line by line with a system call each time, or making one network request per item instead of one batched request. This dominates everything else when it happens — a single network round trip costs more than millions of instructions.

**Allocation.** Building strings by repeated concatenation in a loop copies the whole string each time, giving quadratic behaviour. Use a builder or join a list at the end.

**Memory access patterns.** For large arrays, traversing in memory order is dramatically faster than jumping around, because the cache does the work. This matters far more than people expect at the sizes where it matters at all.

## Benchmarking without fooling yourself

Measurements lie easily, so a few precautions:

- **Run more than once.** The first run pays for cold caches and lazy initialisation. Discard it, or run enough iterations that startup is noise.
- **Use realistic input.** Optimising against a 100-element test case tells you nothing about behaviour at 10 million, and the ranking of approaches often reverses.
- **Change one thing at a time**, and re-measure after each change. Two changes at once means you cannot attribute the improvement, and one of them may be making things worse.
- **Watch for the compiler deleting your benchmark.** If a computed result is never used, an optimising compiler is entitled to remove the computation entirely. Use the result — print it or accumulate it — so it cannot.
- **Check the variance, not just the mean.** A machine doing other work produces noisy numbers, and a 5% "improvement" is frequently nothing.

## Knowing when to stop

Optimisation has a cost that is paid forever: the fast version is usually harder to read, harder to change and easier to break. Spend that cost deliberately.

Stop when the program is fast enough for what it is for. A script you run once a term does not need to be fast; a function called a million times in an inner loop does. The judgement about which one you have is more valuable than any technique on this page.

And keep the slow, obviously-correct version around — as a comment, in the history, or as a test oracle. When the fast version produces a suspicious answer at 1am, being able to compare against the version you trust is worth a great deal.

## Further reading

- [Python `cProfile` documentation](https://docs.python.org/3/library/profile.html)
- [`perf` wiki](https://perfwiki.github.io/main/) — tutorials for the Linux profiler
- Part IA Algorithms is the foundation here: nearly every large performance win is an algorithmic one.
