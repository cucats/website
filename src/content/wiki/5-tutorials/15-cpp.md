---
title: C++
description: Linkage, lifetime, elision and the memory model, at the level the standard defines them
---

Most C++ material stops where the interesting behaviour starts. This page picks up at linkage and works through the parts of the language whose rules are stated in terms of the abstract machine, where the wording matters and the folklore is usually wrong.

## Linkage and the translation unit

A translation unit is a source file after preprocessing, and it is the granularity the standard reasons about for names. A name has no linkage, internal linkage, or external linkage, and the choice determines whether declarations in different translation units denote the same entity.

`static` at namespace scope gives internal linkage. So does an unnamed namespace, whose members have had internal linkage since C++11, which is why the unnamed namespace is the preferred spelling: it extends to types and templates, where `static` does not. `extern "C"` is orthogonal. It sets language linkage, which affects the mangled name and the calling convention, and leaves the internal-or-external question alone.

The one-definition rule then does the work. Non-inline functions and variables with external linkage admit exactly one definition per program. `inline` relaxes that to one definition per translation unit, on the condition that every definition is token-for-token identical and means the same thing after lookup. The linker discards duplicates through vague linkage, which is what puts template instantiations and inline functions into COMDAT sections.

The trap is that ODR violations are IFNDR. No diagnostic is required, the linker happily keeps whichever definition it saw first, and the program that results is not the program you wrote. Two translation units compiled with different `-DNDEBUG`, or with a class whose layout depends on a macro, produce exactly this. The failure surfaces as a corrupted object months later.

Modules replace the model outright. Module linkage sits alongside internal and external, and names attached to a module are not visible to name lookup outside it even when they are external. Reachability and visibility become separate questions, which is the point.

## Templates: when names get bound

Two-phase lookup is the rule people implement incorrectly and then work around. Non-dependent names bind at the point of definition. Dependent names bind at the point of instantiation, and ordinary unqualified lookup at that point sees only declarations visible at the definition, extended by argument-dependent lookup in the instantiation context.

That asymmetry is why a call to `swap` written unqualified after `using std::swap;` finds an overload in the argument's namespace, and why the same call written `std::swap(a, b)` does not. It is also why MSVC's historical permissive mode compiled code that no conforming implementation accepts.

`typename` and `template` disambiguate for the parser because the grammar is ambiguous before instantiation. `typename` before a dependent qualified name says the name is a type; `template` after `.` or `::` says the following name is a template and the `<` opens a template argument list. C++20 relaxed where `typename` is mandatory in contexts where only a type can appear.

## Value categories, elision, and lifetime

The glvalue/prvalue/xvalue taxonomy exists because a prvalue is not an object. It is an initialiser for one. Temporary materialisation converts a prvalue to an xvalue at the points where an object is actually required, which is what made copy elision guaranteed in C++17 for the prvalue case: there was never a second object to elide, so the wording stopped talking about elision and started talking about when materialisation happens.

NRVO stayed optional, because it requires the implementation to prove the named local and the return slot can share storage. Write code that depends on NRVO firing and you have written code whose correctness depends on `-O2`.

Lifetime is the other half. An object's lifetime begins when storage is obtained and initialisation completes, and ends when the destructor call starts or the storage is reused. Access outside that window is undefined, which is what makes the common `reinterpret_cast` over a buffer wrong: casting a pointer does not begin an object's lifetime, so there is no object there to read.

`std::launder` exists for the narrow case where an object has been replaced in storage and the compiler is entitled to assume the old value of a const or reference member is still there. `std::start_lifetime_as` in C++23 finally spells the deserialisation case directly, where you have bytes of the right representation and want an object.

Strict aliasing is the optimiser's side of the same bargain. Accessing an object through a glvalue of unrelated type is undefined, so the compiler assumes an `int*` and a `float*` never designate the same storage. `memcpy` is the sanctioned type pun and codegens to nothing at any reasonable optimisation level, and `std::bit_cast` says it in one expression for trivially copyable types.

## The memory model

`std::memory_order` is a specification of which reorderings the compiler and hardware may perform, and it is defined through happens-before, not through fences on any particular machine.

Sequential consistency is the default and buys a single total order over all seq_cst operations, which on x86 costs a locked instruction or an `mfence` on the store side. Release-acquire gives a pairwise ordering between the releasing store and the acquiring load that reads it, which is free on x86 and costs `dmb ish` on ARM. Relaxed guarantees atomicity and modification order for the single object and orders nothing else, which is right for a statistics counter and wrong for nearly everything else.

`memory_order_consume` remains discouraged, since no implementation tracks dependencies as specified and every compiler promotes it to acquire.

Data races on non-atomic objects are undefined behaviour and not merely a torn read. The compiler is entitled to assume they do not occur, so it may hoist a load out of a loop and turn a benign-looking racy flag check into an infinite loop.

Consider `std::hardware_destructive_interference_size` for padding against false sharing, while noting it is a compile-time constant and the cache line it names may not be the cache line you get.

## Exceptions, `noexcept` and what it costs

Zero-cost exception handling means zero cost when nothing is thrown. The unwind tables sit in a cold section and the happy path pays nothing, and a throw costs on the order of microseconds through the personality routine and the unwinder's table search, with a global lock in some implementations.

`noexcept` is more than documentation. `std::vector` reallocation dispatches on `move_if_noexcept`, so a move constructor that is not marked `noexcept` silently turns growth into a copy of every element. A violated `noexcept` calls `std::terminate` without unwinding, which is a deliberate design choice about failure modes.

Building with `-fno-exceptions` and `-fno-rtti` is common where tail latency matters more than the standard library's error handling. Know what it removes: `std::vector::at`, the throwing paths of every allocating operation, and `dynamic_cast`.

## Constant evaluation

`constexpr` permits evaluation at translation time. `consteval` requires it, which is what makes an immediate function's parameters usable in constant expressions in the caller. `constinit` asserts constant initialisation without implying const, which is the tool for the static initialisation order fiasco: the object is initialised before any dynamic initialisation runs, so no ordering question arises.

The fiasco itself is worth restating precisely. Ordering of dynamic initialisation of non-local variables is unspecified across translation units and sequenced within one. Anything else is a property of your linker's section ordering.

## Allocation

`operator new` and `operator delete` are replaceable at link time, and the class-scope overloads participate in lookup before the global ones. Sized deallocation lets an allocator skip the size lookup, which matters for slab designs.

`std::pmr` is the standard's answer to allocator propagation being a compile-time property that infects every type. A `monotonic_buffer_resource` over a stack array turns a container's allocations into pointer bumps with no deallocation at all, which is the right shape for per-tick work that is discarded wholesale.

The default allocator's behaviour under contention is the thing to measure. glibc's arena-per-thread design and tcmalloc's thread caches have very different tail behaviour, and the difference shows up in the 99.9th percentile long before it shows up in the mean.

## Undefined behaviour as a contract

UB is not a bug category. It is the set of preconditions the optimiser is permitted to assume, and it propagates backwards. A null check after a dereference gets deleted because the dereference already established the pointer is non-null. Signed overflow being undefined is what lets `i + 1 > i` fold to true and what makes induction variable widening legal.

This is why UBSan and ASan belong in your test builds, and why the absence of a crash tells you nothing about the absence of UB.

## Reading

- [eel.is/c++draft](https://eel.is/c++draft/) for the working draft, which is the only authority
- [cppreference](https://en.cppreference.com/) for a usable index into it
- The [Itanium C++ ABI](https://itanium-cxx-abi.github.io/cxx-abi/abi.html), since vague linkage, the vtable layout and the exception unwinding interface all live there
- [WG21 papers](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/) for the reasoning behind wording that looks arbitrary
