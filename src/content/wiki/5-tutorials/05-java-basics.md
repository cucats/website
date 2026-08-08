---
title: Java and the JVM
description: JIT compilation, escape analysis, collectors and the memory model
---

The language is the small part. Most of what determines how Java behaves at runtime lives in HotSpot, and the interesting questions are about what the JIT did and what the collector is doing while it does it.

## Tiered compilation

Execution starts in the interpreter, which profiles as it goes. C1 compiles quickly with light optimisation and adds counters; C2 compiles slowly with the full optimisation set once a method is hot. Tiered compilation moves methods up through those levels and back down on deoptimisation.

Profile-guided speculation is what makes the result fast and what makes it fragile. A call site that has only ever seen one receiver type gets a monomorphic inline cache and the callee inlined directly; a second type turns it bimorphic, and a third makes it megamorphic and stops the inlining. A polymorphic dispatch that is monomorphic in your benchmark and megamorphic in production is the standard reason benchmark numbers do not survive deployment.

Deoptimisation is the escape hatch. When a speculative assumption fails, such as a class being loaded that invalidates a leaf-method assumption, the frame is reconstructed in the interpreter and the compiled code discarded. `-XX:+PrintCompilation` and JITWatch show this happening, and a method that compiles and deoptimises repeatedly is worth finding.

Escape analysis determines whether an allocation can be seen outside its method. Where it cannot, scalar replacement removes the object entirely and keeps its fields in registers, and lock elision removes uncontended synchronisation on it. That is why allocation in a hot loop is sometimes free and sometimes not, with the boundary at whether the object escapes.

## Collectors

G1 is the default and is region-based, with concurrent marking and evacuation targeting a pause goal. Humongous allocations that exceed half a region bypass the young generation and are the usual cause of unexpected full collections.

ZGC and Shenandoah are concurrent collectors with pause times independent of heap size, achieved through load barriers and coloured pointers, paying throughput for it. Where tail latency dominates, that trade is correct.

Allocation is a pointer bump into a thread-local allocation buffer, so it is genuinely cheap, and the cost of an object is paid at collection in proportion to survival. The generational hypothesis is what makes this work, and the shape that defeats it is a large cache of medium-lived objects, which is the allocation profile most likely to be promoted and then collected expensively.

Finalizers are deprecated and were always wrong. Cleaners and `PhantomReference` are the mechanism where native resources need releasing, and try-with-resources is what you actually want.

## The memory model

JSR-133 defines happens-before over Java, and `volatile` gives sequential consistency for the single variable along with an ordering edge for everything sequenced before the write. `final` fields get their own guarantee: a properly constructed object's finals are visible to any thread that sees the reference, without synchronisation, provided the constructor does not leak `this`.

That last proviso is the one that gets violated, usually by registering a listener from a constructor.

Data races do not stop at torn reads. The compiler may hoist a racy load out of a loop, and word tearing between adjacent fields is prevented for everything except elements of arrays smaller than a word in some historical implementations.

`VarHandle` supersedes `Unsafe` for explicit ordering, giving relaxed, acquire, release and volatile modes directly.

## Where the surprises are

Boxing allocates outside the cached range, which is `-128` to `127` for `Integer` by default, so identity comparison on boxed integers works in tests and fails in production.

Strings are UTF-16 internally, with compact strings storing Latin-1 in a byte array where possible since Java 9. `String.intern` puts entries in a native hash table, and interning untrusted input is a leak.

Generics are erased, so a `List<String>` and a `List<Integer>` share a class, and the compiler inserts checked casts at the boundary. Arrays are covariant and reified, which is why `ArrayStoreException` exists and why the two features do not compose.

`ThreadLocal` on a pooled thread outlives the request that set it and is the standard leak in an application server.

Virtual threads decouple the concurrency unit from the OS thread and make blocking IO cheap. The pinning cases are what to know: a virtual thread inside a `synchronized` block cannot unmount, so lock-heavy code needs `ReentrantLock` to see the benefit.

## Measurement

JMH exists because a naive Java benchmark measures the JIT warming up, dead code elimination, and constant folding of your input. Blackholes and state objects address those; the fork and warmup defaults address profile pollution between runs.

JFR gives allocation profiles, lock contention and collection detail at a low enough overhead to leave enabled, and async-profiler avoids the safepoint bias that afflicts sampling profilers relying on `GetStackTrace`.

## Reading

- [The JVM Specification](https://docs.oracle.com/javase/specs/jvms/se21/html/) and the [Java Language Specification](https://docs.oracle.com/javase/specs/jls/se21/html/)
- [JMH](https://github.com/openjdk/jmh) for benchmarks that measure the program
- [async-profiler](https://github.com/async-profiler/async-profiler)
- [Aleksey Shipilëv's writing](https://shipilev.net/) on the memory model, collectors and benchmarking methodology
