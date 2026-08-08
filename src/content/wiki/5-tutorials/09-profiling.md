---
title: Profiling and Performance
description: Counters, sampling bias, and the microarchitectural limits you are actually hitting
---

Guessing which part of a program is slow has a poor track record, and the interesting version of this problem starts after you have stopped guessing. This page is about what the measurement is telling you.

## What `time` decomposes into

Wall clock over user plus sys tells you whether you are running or waiting, and the ratio is the first branch in the decision tree. Waiting sends you to the blocking profile, running sends you to the counters.

Compute-bound is not one condition. A core retiring four instructions per cycle and a core stalled on memory both show as user time, and the distinction determines which optimisations are available. `perf stat` gives you instructions per cycle directly, and IPC well under one on a modern out-of-order core means the machine is waiting on something, usually last-level cache misses or a branch it cannot recover from cheaply.

The top-down methodology formalises this. Issue slots are attributed to retiring, bad speculation, frontend bound or backend bound, and the category you land in tells you whether to look at the algorithm, the branch layout, the instruction footprint or the data layout. `perf stat --topdown` on hardware that supports it collapses a long argument into one table.

## Sampling and its biases

A sampling profiler interrupts on a counter overflow and attributes the sample to the instruction pointer. Two things follow.

Skid means the reported instruction is not the one that caused the event, because the interrupt arrives some cycles later. Precise event modes, `:pp` in perf syntax, use PEBS or IBS to record the address at the point of the event, and without them the attribution of a cache miss to a source line is approximate in a way that matters when the loop body is short.

Sampling on cycles also cannot see time you did not spend on the CPU. A profile that looks flat while the wall clock is long means the time went to a blocking call, and off-CPU profiling through scheduler tracepoints is what shows it.

Inlining and tail calls break the naive stack walk. Frame pointer omission is the default at `-O2`, so either build with `-fno-omit-frame-pointer` and give up a register, use DWARF unwinding and accept the sample buffer size, or use LBR call stacks where the hardware provides them.

## Measurements that mislead

Microbenchmarks measure the benchmark. A loop over an array that fits in L1 is measuring L1 bandwidth, and the same code over a working set that misses is a different program microarchitecturally. A conclusion drawn at one working set size transfers to another by accident.

Dead code elimination removes any computation whose result goes unused, so a benchmark that does not consume its output is timing an empty loop. Consume it through a volatile sink or an assembly barrier.

Alignment effects are large and unrelated to anything you changed. Function and loop alignment shift with unrelated edits and move times by several percent, which is why a change measured once is not a result. Vary the layout before believing a small improvement.

Frequency scaling makes the first iterations run at a different clock from the rest, and a sustained wide-vector workload will downclock the core outright.

## Where the wins are

Complexity dominates when it is wrong. Past that, the wins are almost entirely about the memory hierarchy.

Layout is the lever. Array-of-structures against structure-of-arrays changes how much of each cache line you use, and a hot loop touching two fields of a sixteen-field struct wastes most of its bandwidth. The transformation is mechanical and the effect is frequently larger than anything instruction selection will give you.

Hardware prefetching handles sequential access and constant strides well, and pointer chasing not at all, which makes a hot linked structure the canonical case for changing representation.

Branch misprediction costs the pipeline depth. A genuinely unpredictable branch is worth removing with a conditional move or a branchless formulation, and a predictable one is nearly free and should be left alone. Sorting the input before a filtering loop is the standard demonstration, and it works by making the branch predictable.

Allocation becomes a systems problem at scale. Arena and monotonic strategies turn allocation into a pointer bump and deallocation into nothing, which is the right shape for work with a natural batch boundary.

## Amdahl, and what parallelism does not fix

Speedup is bounded by the serial fraction, which is why the parallel section is rarely where the time goes. Adding threads to a program with a contended allocator or a shared counter buys contention.

Little's law is the other constraint worth carrying: concurrency equals arrival rate times latency, so a system at fixed concurrency cannot improve throughput without improving latency. Queueing effects mean the tail diverges long before the mean does, and a service at 80% utilisation has a queue whether or not the average looks comfortable.

Tail latency is a different optimisation target from mean latency and the techniques diverge. Collection pauses, page faults and interrupts are invisible in the mean and are most of the 99.9th percentile.

## Reading

- [Brendan Gregg on perf](https://www.brendangregg.com/perf.html), including flame graphs and off-CPU analysis
- [Agner Fog's optimisation manuals](https://www.agner.org/optimize/) for microarchitecture and instruction tables
- [`perf` wiki](https://perfwiki.github.io/main/)
