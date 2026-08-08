---
title: Writing Tests
description: What to test, when there is no obvious answer
---

Most people's first tests are written under duress, check the thing that obviously works, and are deleted the first time they go red. The useful version is different: a test suite is a machine that tells you whether the change you just made broke something you had forgotten about.

The hard part is almost never the mechanics of the testing library. It is knowing what to test.

## The shape of a test

Every test has three parts, whatever the language:

```python
def test_reverses_a_list():
    original = [1, 2, 3]          # arrange
    result = reverse(original)     # act
    assert result == [3, 2, 1]     # assert
```

Set up a situation, do the thing, check the outcome. If a test is hard to write in that shape, that is usually a signal about the code rather than about the test — a function that needs twenty lines of setup is a function doing too much.

Run them with `pytest`, which discovers anything named `test_*`. In Java, JUnit is the equivalent:

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class ReverseTest {
    @Test
    void reversesAList() {
        assertEquals(List.of(3, 2, 1), Reverse.of(List.of(1, 2, 3)));
    }
}
```

## What to actually test

This is the question people get stuck on. A few reliable answers:

**The boundaries.** Bugs cluster at edges. For anything taking a collection or a number, test: empty, one element, two elements, and the largest case you care about. Off-by-one errors are found by exactly these and almost nothing else.

**The cases you had to think about.** If you paused while writing a branch, that branch deserves a test. Your hesitation is a reliable signal about where the difficulty is.

**Every bug you find.** The moment you have a reproduction, turn it into a test — before fixing it. Watch it fail, then fix it, then watch it pass. That confirms the test actually exercises the bug, and stops it silently returning later.

**The contract, not the implementation.** Test that `sort` returns things in order, not that it happens to be quicksort. A test coupled to internals breaks every time you refactor, which trains people to ignore failures.

**What you would check by hand.** If you would run the program and eyeball the output, that eyeballing is a test. Write it down.

> [!TIP]
> If you cannot think of a test that could plausibly fail, you are testing the wrong thing. A test that cannot fail is worse than no test, because it costs maintenance and provides false confidence.

## Making failures readable

A failing test is a message to whoever reads it, often you in three months.

**Name tests after the behaviour**, not the function. `test_returns_empty_list_for_empty_input` tells you what broke from the failure output alone; `test_reverse_2` does not.

**One behaviour per test.** If a test asserts five things, the first failure hides the other four.

**Assert on specifics.** `assert result == [3, 2, 1]` is much more useful than `assert result is not None`.

## Properties, when examples run out

Sometimes you cannot enumerate the cases, but you can state something that must always hold. Property-based testing generates hundreds of inputs and tries to break your claim:

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_reversing_twice_gives_the_original(xs):
    assert reverse(reverse(xs)) == xs
```

Useful properties to look for:

- **Round trips**: decode(encode(x)) equals x. Excellent for parsers and serialisers.
- **Invariants**: sorting preserves length and multiset of elements.
- **Comparison against something obvious**: your fast implementation agrees with the slow, clearly-correct one on random inputs.

That last one is the highest-value testing technique most students never learn, and it is the same trick as the brute-force comparison in [Competitive Programming](/wiki/tutorials/competitive-programming). When it finds a mismatch, Hypothesis also shrinks the input to the smallest failing case, which usually makes the bug obvious immediately.

## Dependencies that make testing hard

Code that reads the clock, hits the network, or writes files is awkward to test — slow, flaky, and dependent on things outside your control.

The fix is usually not a mocking framework. It is separating the decision from the effect:

```python
# hard to test: decision and effect tangled together
def maybe_expire(record):
    if datetime.now() > record.expires_at:
        database.delete(record.id)

# easy to test: the decision is a pure function
def is_expired(record, now):
    return now > record.expires_at
```

`is_expired` needs no database and no clock, and you can test every boundary case in a few lines. The thin remaining wrapper that actually deletes is simple enough to check once. Pushing logic out of I/O and into pure functions is the single most effective thing you can do to make code testable — and it tends to make it better code regardless.

## On coverage

Coverage measures which lines ran during the tests. It is useful in one direction only: **low coverage reliably shows you untested code**, and looking at what is uncovered is a good way to find gaps.

High coverage proves very little. A test that calls every line and asserts nothing scores 100%. Chasing a coverage number produces tests written to hit lines rather than to catch bugs.

## Running them automatically

Tests you have to remember to run are tests you will not run. Have your editor run them on save, and have CI run them on every push. The repository this wiki lives in runs its checks in GitHub Actions on every commit, which is a reasonable pattern to copy.

The point of automation is that the feedback arrives while you still remember what you changed.

## A realistic standard

You are not obliged to test everything. For supervision work, tests are usually optional and often not worth it. For a project you will still be working on in three months, or that someone else will touch, they pay for themselves quickly.

A pragmatic default: test the tricky pure functions thoroughly, test the boundaries, add a test for every bug you fix, and do not agonise about the rest.

## Further reading

- [pytest documentation](https://docs.pytest.org/)
- [JUnit 5 user guide](https://junit.org/junit5/)
- [Hypothesis documentation](https://hypothesis.readthedocs.io/) — property-based testing for Python
