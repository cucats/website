---
title: Testing
description: Generators, shrinking, oracles and coverage-guided fuzzing
---

Example-based tests encode the cases you thought of, which is a bounded set that correlates with the bugs you already avoided. The techniques below search a space you did not enumerate.

## Properties and generators

A property states an invariant over a distribution of inputs, and the framework searches for a counterexample:

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_roundtrip(xs):
    assert decode(encode(xs)) == xs
```

The properties worth reaching for are round trips, algebraic laws such as idempotence, associativity and commutativity where the operation claims them, invariants preserved by an operation, and differential agreement against a reference implementation.

Differential testing is the strongest of these when it is available. A slow obviously-correct implementation and a fast one, compared on generated inputs, tests a specification you never had to write down. This is the same manoeuvre as comparing against brute force in [competitive programming](/wiki/tutorials/competitive-programming), and it is how compiler and database test suites find their deepest bugs.

Shrinking is what makes the counterexample usable. A failure on a 200-element list is evidence; the same failure minimised to `[0, 0]` is a diagnosis. Integrated shrinking, where the generator carries its own reduction structure, avoids the invalid intermediate cases that type-directed shrinking produces on constrained inputs.

Generator design is where the effort goes. A uniform distribution over a large space rarely hits the interesting region, so the useful generators are weighted towards boundaries, duplicates, and the shapes your code special-cases. Stateful testing extends this to sequences of operations against a model, which is what finds the bugs that need three calls in a particular order.

## Coverage-guided fuzzing

A fuzzer mutates inputs and keeps the ones reaching new coverage, which turns the search into a hill climb over the control flow graph. libFuzzer and AFL++ both take a harness that maps a byte buffer to an operation on your code.

The harness is the design problem. A buffer split into structured arguments works, and a grammar-aware or structure-aware harness reaches deeper, because random bytes rarely form a valid input for anything with a checksum or a header. Combining with a sanitizer gives you the oracle: the fuzzer finds inputs that crash, and ASan or UBSan turns silent corruption into a crash.

Continuous fuzzing matters more than a one-off run, since coverage plateaus and then breaks through hours later. A corpus checked into the repository preserves that work across runs.

## Oracles

The hard part of testing is deciding what correct means for an input you generated. The options are a reference implementation, a metamorphic relation, an invariant check, or a crash. Metamorphic relations are underused: sorting a permuted input gives the same result, and a query with an extra redundant filter returns a subset. Neither requires knowing the expected output.

Where no oracle exists, assertion density becomes the oracle. Internal consistency checks compiled in for the test build turn a wrong state into a failure at the point it arises.

## Mutation testing

Coverage measures execution and not verification, and a test suite touching every line while asserting nothing scores full marks. Mutation testing perturbs the program, flipping a comparison or deleting a statement, and reports the mutants your suite fails to kill.

A surviving mutant is a precise statement about an untested behaviour, and it is the only coverage-adjacent metric that means much. The cost is running the suite once per mutant, which is why it goes in a nightly job.

## Determinism and flakes

A flaky test is a test whose result depends on something you did not control, and the sources are the usual set: wall clock, iteration order over an unordered container, network, filesystem state, port allocation, and thread scheduling. Injecting the clock and seeding every generator eliminates most of it.

Recording the seed on failure is what makes a randomised suite debuggable. A property-based failure without the seed is an anecdote.

Quarantining a flake and moving on is how a suite dies, because the failures it hides are the concurrency bugs you most wanted to catch.

## Reading

- [Hypothesis](https://hypothesis.readthedocs.io/), whose documentation covers integrated shrinking and stateful testing
- [AFL++](https://aflplus.plus/) and [libFuzzer](https://llvm.org/docs/LibFuzzer.html)
- [QuickCheck](https://dl.acm.org/doi/10.1145/351240.351266), the original paper, which is short
