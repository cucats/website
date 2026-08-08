---
title: Concurrency
description: Memory models, lock-free reasoning, and why a benign race is not a thing
---

Part IB Concurrent and Distributed Systems gives you the theory. This page is about the gap between that theory and what a compiler and a weakly ordered machine will actually do to your program.

## The race is undefined, not merely wrong

Treating `counter++` as three steps that might interleave is the introductory framing and it understates the problem. A data race on a non-atomic object is undefined behaviour, which means the optimiser is entitled to assume it never happens and to transform your program on that basis.

The consequence is that racy code fails in ways no interleaving argument predicts. A load of a racy flag hoisted out of a loop turns a spin into an infinite loop. A compiler that proves a variable is never written by this thread may keep it in a register across the entire function. Neither is a scheduling accident, and neither goes away under a stress test on your laptop.

There is no benign race. There are races whose consequences you have not yet observed.

## Happens-before is the primitive

Every useful ordering guarantee reduces to happens-before, which is the transitive closure of sequenced-before within a thread and synchronizes-with across threads. Mutexes, joins and release-acquire pairs all exist to establish synchronizes-with edges; nothing else in the language creates one.

The acquire-release pair is the shape worth internalising. A release store publishes everything sequenced before it in the releasing thread, and an acquire load that reads that store sees all of it. The ordering is pairwise between that store and that load, so a release store observed by two different acquire loads gives you two independent edges and no ordering between the readers.

Sequential consistency buys a single total order over all seq_cst operations, which is what makes the independent-reads-of-independent-writes shapes behave the way naive intuition expects. It costs a locked instruction or a store-load fence on x86 and a full barrier on ARM. Relaxed ordering guarantees atomicity and per-object modification order and orders nothing across objects, which is correct for a counter you only ever read after joining and wrong nearly everywhere else.

Cost, roughly, on the platforms that matter: acquire and release are free on x86 because the hardware model is already TSO, and seq_cst stores are not. On AArch64 acquire and release map to `ldar` and `stlr`, and the gap between them and relaxed is real but small compared with the cache miss you are probably taking anyway.

## Deadlock and the lock ordering discipline

The Coffman conditions are the standard decomposition, and circular wait is the one you break in practice by imposing a total order on lock acquisition. That order is a global invariant of the program, so it belongs in a document, and never solely in the heads of whoever wrote the two functions involved.

The failure mode this misses is the callback. A lock held across a call into code you do not control admits a lock ordering you never wrote down, because the callee may take locks in an order that contradicts yours. Lock inversion introduced through a virtual call or a signal handler is the version of this that survives review.

Priority inversion is the third case. A low-priority thread holding a lock a high-priority thread wants will block it for as long as some medium-priority thread is runnable, which is a scheduler problem and not a correctness one until it is.

## Lock-free, and what it costs

Lock-free means system-wide progress: some thread makes progress in a bounded number of steps regardless of scheduling. Wait-free strengthens that to every thread. Neither implies fast, and a lock-free structure under contention frequently loses to a well-implemented mutex, because the failed compare-exchanges do the same cache line ping-pong the mutex would have done and burn the retries as well.

The ABA problem is the one that bites when you build a stack from a CAS on a head pointer. A thread reads A, is descheduled, and by the time it retries the head is A again with a different list behind it, so the CAS succeeds and splices in a stale tail. Tagged pointers, hazard pointers and epoch-based reclamation are the three answers, and all three are really answers to the same question, which is when it is safe to free.

Memory reclamation is the hard part of every lock-free structure. Removing a node from a shared structure is easy, and knowing that no other thread still holds a pointer into it is not.

## Where the time actually goes

False sharing is two threads writing distinct objects that share a cache line, which serialises them through the coherence protocol with no logical contention at all. Padding to the destructive interference size fixes it, and the diagnosis is a high `HITM` count from `perf c2c`.

Uncontended atomic operations are cheap and contended ones are not, because the cost is the cache line moving between cores. A counter incremented by every thread is a serialisation point regardless of how it is implemented, and the fix is per-thread counters summed at read time.

Thread sanitizer is the tool that finds races that did not manifest, since it tracks happens-before and does no interleaving sampling at all. It is the only member of this list that finds a bug you did not reproduce.

## The alternative that keeps working

Immutable data needs no synchronisation, and message passing over a channel gives each value one owner and a well-defined transfer point. Both replace a reasoning problem that scales badly with thread count by one that does not.

Where a runtime enforces this, it stops being a discipline you have to maintain. OCaml 5's memory model bounds the behaviour of racy programs so a race cannot forge a pointer, and Rust's ownership rules make the aliasing-plus-mutation case a compile error. The [OCaml Internals](/wiki/tutorials/ocaml-internals) page covers the first of those.

## Reading

- [The `pthreads` manual page](https://man7.org/linux/man-pages/man7/pthreads.7.html)
- Part IB Concurrent and Distributed Systems, on the [course pages](https://www.cl.cam.ac.uk/teaching/current/part1b.html)
- [Preshing on Programming](https://preshing.com/) for the memory model material worked through with hardware in view
