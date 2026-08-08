---
title: OCaml Internals
description: Value representation, the collector, the compilation pipeline and the OCaml 5 runtime
---

The [setup page](/wiki/tutorials/ocaml-setup) covers getting a toolchain running. This one is about what the toolchain produces and why the runtime is shaped the way it is.

## Value representation

Every OCaml value is one word. The low bit discriminates: set means an immediate, clear means a pointer into the heap. That is why `int` is 63 bits on a 64-bit target and why the arithmetic primitives carry the tag through: addition on the tagged representation is `x + y - 1`, and multiplication untags one operand and shifts the other before re-tagging.

Immediates cover `int`, `char`, `bool`, `unit` and every constant constructor of a variant, numbered from zero in declaration order. Blocks carry a header word holding the size in words, a colour used by the collector, and a tag byte. Non-constant constructors take tags from zero upward, and the tags from `No_scan_tag` upward mark blocks the collector will not trace, which is where `string`, `bytes`, `float` and `Int64.t` live.

`float array` is the special case that leaks into the type system. Arrays of float are unboxed into a flat representation with `Double_array_tag`, which is why polymorphic code over `'a array` has to check the tag at runtime, and why `Obj.magic` between `float array` and anything else corrupts the heap, well past merely lying about a type.

The uniform representation is what makes separate compilation of polymorphic code possible without monomorphisation, and it is also what costs you a boxed allocation for every `float` that escapes a local scope. The unboxed types and layouts work now landing in the language is the long answer to that.

## The collector

Allocation on the minor heap is a pointer decrement against a limit, three instructions with no call. The young generation is collected by copying survivors to the major heap, so the cost of a minor collection is proportional to live data and independent of how much you allocated, which is what makes short-lived allocation genuinely close to free.

The write barrier is the price. Mutating a pointer field in a major-heap block calls `caml_modify`, which records the location in the remembered set so the minor collection can find old-to-young references without scanning the whole major heap. Immutable data structures skip the barrier entirely, and this is one of the concrete reasons functional style is fast here and not merely tidy.

The major heap is incrementally marked and swept, with compaction available when fragmentation warrants it. Marking is interleaved with allocation in slices sized to keep pauses bounded, and `Gc.set` exposes the knobs, of which `space_overhead` is the one that actually changes behaviour.

Naked pointers are gone in OCaml 5. Every value the collector can reach is now either an immediate or a pointer to a well-formed block, which is what makes the concurrent collector tractable and which broke a certain amount of old FFI code.

## The pipeline

The front end goes Parsetree, then Typedtree once type checking and module elaboration have run. Typedtree is lowered to Lambda, an untyped intermediate form where pattern matches have already been compiled into decision trees and where the representation choices above are made explicit.

From Lambda the paths diverge. The default backend goes through Clambda with a conservative inliner. Flambda replaces that with a term-level optimiser doing inlining, specialisation, unboxing and dead code elimination over a fixpoint, at a compile-time cost that is the reason it is a build-time option. Flambda 2 restructures this again around a continuation-passing intermediate form.

Both converge on Cmm, a C-like machine-independent form where the tagging arithmetic becomes explicit, then Mach for instruction selection, then Linear after register allocation, then assembly. `-dcmm` and `-dlinear` will show you each stage, and reading Cmm is the fastest way to settle an argument about whether something allocated.

## Modules and the type system

Functors are the part with real depth. Applicative functor application, the default, means `F(X).t` and `F(X).t` name the same type when `X` is the same path, so abstract types survive across applications. Generative application, written with `()`, produces a fresh type on each application, which is what you want when the functor allocates state that must not be conflated.

First-class modules reify a module as a value with an existential type, which is the mechanism behind most plugin architectures in OCaml. GADTs give you the other half, refining type equalities inside a branch, and the interaction with the value restriction and with variance annotations is where the error messages become genuinely hard to read.

The value restriction itself is a soundness patch: generalising the type of an expression that may allocate mutable state would let you build a polymorphic reference. Relaxed value restriction recovers generalisation for covariant positions, which is why `[]` generalises and `ref []` does not.

## OCaml 5: domains and effects

Domains map to system threads and each carries its own minor heap, with the major heap shared and collected concurrently. Parallelism is per-domain; the runtime no longer holds a global lock across all of it.

The memory model is the interesting design decision. OCaml 5 guarantees DRF-SC, so race-free programs are sequentially consistent, and it additionally bounds the behaviour of racy programs. A data race can give you a stale value that some domain actually wrote, and it cannot give you a torn word or a value out of thin air, so the heap stays well-formed and a race stays a bug in your program, short of a memory safety failure. This is a much stronger guarantee than C++ or Java offers, and it costs a fence on some paths.

Effect handlers give you delimited continuations without a monad. `perform` walks to the nearest installed handler, and the handler receives a continuation it may resume once. Fibers are heap-allocated stacks that grow on demand, which is what makes a scheduler in direct style cheap. The type system does not yet track effects, so an unhandled effect is a runtime failure.

## The FFI

The C interface is the place where the collector's invariants become your problem. Any C local holding an OCaml value across an allocation must be registered as a root with `CAMLparam` and `CAMLlocal`, because a minor collection moves values and an unregistered pointer will be stale afterwards. `CAMLreturn` pops the frame.

`caml_alloc` and the field setters respect the barrier; direct stores through `Field` do not, so `caml_initialize` and `caml_modify` exist for the initialising and mutating cases respectively. Releasing the runtime lock around a long C call is the difference between a responsive program and one that stalls every domain.

## Reading

- [The OCaml manual on the runtime representation](https://ocaml.org/manual/intfc.html) and the FFI chapter
- [Real World OCaml](https://dev.realworldocaml.org/), whose backend chapters cover representation and the pipeline
- [The compiler source](https://github.com/ocaml/ocaml), where `bytecomp/lambda.ml`, `asmcomp/cmmgen.ml` and `runtime/major_gc.c` repay reading directly
- [Retrofitting Parallelism onto OCaml](https://arxiv.org/abs/2004.11663) for the multicore design and the memory model argument
