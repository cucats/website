---
title: Profiling and Performance
description: Measuring before optimising, so you speed up the part that is actually slow
---

Programmers are famously bad at guessing which part of a program is slow. The intuition that says "this nested loop looks expensive" is wrong often enough that acting on it wastes most of the effort spent optimising: you speed up the wrong thing and the program is no better.

Profiling replaces the guess with a measurement. It takes about two minutes and it separates optimising from fiddling.

## The order of operations

Make it correct first, because a fast wrong answer is worthless and optimisation makes code harder to fix. Then decide whether it is fast enough, and stop if it is, since optimisation costs readability and you pay that permanently. Then measure to find where the time goes. Then improve the biggest cost and measure again.

That last step repeats, because the bottleneck moves. Fix the thing taking 60% of the time and something else now holds the largest share.

> [!TIP]
> Fix the algorithm before the constants. Going from $O(n^2)$ to $O(n \log n)$ beats any amount of micro-optimisation on a large input, and no amount of tuning rescues a fundamentally wrong approach. [Competitive Programming](/wiki/tutorials/competitive-programming) covers how to budget complexity.

## Timing the whole thing

Start crude. Often this is all you need:

```bash
time ./program
```

That reports real time on the wall clock, user time on CPU in your code, and sys time on CPU in the kernel. The relationship between them tells you something immediately. Real time much larger than user plus sys means you are waiting, for disk, network or a lock, and optimising computation will not help. User time dominating means you are compute-bound and profiling will show you where.

To time a region inside a program, record a monotonic clock either side:

```python
import time

start = time.perf_counter()
result = expensive_thing()
print(f"took {time.perf_counter() - start:.3f}s")
```

Use `perf_counter`, since `time.time()` can jump when the system clock is adjusted.

## Profiling properly

A profiler tells you where the time goes without you guessing where to put timers.

Python has one built in:

```bash
python -m cProfile -s cumtime script.py | head -n 30
```

Sorting by `cumtime`, meaning cumulative time including callees, shows which high-level operations are expensive. Sorting by `tottime` shows which individual functions burn CPU themselves. Both views are useful and they answer different questions.

C and C++ on Linux use `perf`:

```bash
gcc -g -O2 program.c -o program
perf record ./program
perf report
```

Compile with optimisation and debug symbols together. Profiling an unoptimised build measures a program you are not going to ship.

Java ships with Java Flight Recorder, and most JVM profilers attach to a running process.

Whatever the language, look for the same shapes: one function dominating, a cheap function called an enormous number of times, or time spent somewhere you did not expect. The third is the most common and the most valuable.

## Where the time usually goes

Slow programs are usually slow for one of a small number of reasons.

The wrong algorithm or data structure, which is the first thing to check and the most common answer. Repeated linear scans of a list where a hash set answers in constant time, or a membership test inside a loop turning $O(n)$ into $O(n^2)$.

Work repeated needlessly, where the same value gets recomputed every iteration despite being computable once outside the loop, or cacheable across calls.

I/O in a loop, reading a file line by line with a system call each time, or making one network request per item where a batch would do. This dominates everything else when it happens, since a single network round trip costs more than millions of instructions.

Allocation, where building a string by repeated concatenation in a loop copies the whole thing each time and gives you quadratic behaviour. Use a builder, or join a list at the end.

Memory access patterns, where traversing a large array in memory order runs dramatically faster than jumping around, because the cache does the work. This matters far more than people expect at the sizes where it matters at all.

## Benchmarking without fooling yourself

Measurements lie easily, so a few precautions.

Run more than once, because the first run pays for cold caches and lazy initialisation. Discard it, or run enough iterations that startup becomes noise.

Use realistic input. Optimising against a 100-element test case tells you nothing about ten million, and the ranking of approaches often reverses between the two.

Change one thing at a time and re-measure after each, since two changes at once leave you unable to attribute the improvement, and one of them may be making things worse.

Watch for the compiler deleting your benchmark. A computed result that is never used can be removed entirely by an optimising compiler, so use the result: print it, or accumulate it.

Check the variance as well as the mean. A machine doing other work produces noisy numbers, and a 5% improvement is frequently nothing at all.

## Knowing when to stop

Optimisation carries a cost you pay forever, since the fast version is usually harder to read, harder to change and easier to break. Spend it deliberately.

Stop when the program is fast enough for its purpose. A script you run once a term does not need to be fast. A function called a million times in an inner loop does. Judging which one you have in front of you is worth more than any technique on this page.

Keep the slow, obviously-correct version around, as a comment, in the history, or as a test oracle. When the fast version produces a suspicious answer at 1am, having something you trust to compare against is worth a great deal.

## Further reading

- [Python `cProfile` documentation](https://docs.python.org/3/library/profile.html)
- [`perf` wiki](https://perfwiki.github.io/main/), tutorials for the Linux profiler
- Part IA Algorithms, since nearly every large performance win is an algorithmic one
