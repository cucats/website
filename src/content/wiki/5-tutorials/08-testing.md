---
title: Writing Tests
description: What to test, when there is no obvious answer
---

Most people's first tests get written under duress, check the thing that obviously works, and are deleted the first time they go red. The useful version does something else: a test suite is a machine that tells you whether the change you just made broke something you had forgotten about.

The hard part is almost never the testing library. It is knowing what to test.

## The shape of a test

Every test has three parts, in every language:

```python
def test_reverses_a_list():
    original = [1, 2, 3]          # arrange
    result = reverse(original)     # act
    assert result == [3, 2, 1]     # assert
```

Set up a situation, do the thing, check the outcome. A test that resists this shape is usually telling you something about the code: a function needing twenty lines of setup is doing too much.

Run them with `pytest`, which finds anything named `test_*`. JUnit is the Java equivalent:

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

This is where people get stuck, and there are a few reliable answers.

Test the boundaries, since bugs cluster at edges. Anything taking a collection or a number wants an empty case, one element, two elements, and the largest case you care about. Off-by-one errors turn up here and almost nowhere else.

Test the cases you had to think about. Pausing while writing a branch is a reliable signal about where the difficulty lives, so that branch deserves a test.

Test every bug you find. The moment you have a reproduction, turn it into a test before fixing anything. Watch it fail, fix it, watch it pass. That sequence confirms the test exercises the bug, and stops it quietly coming back.

Test the contract. `sort` returns things in order, and that is what you check; whether it happens to be quicksort is none of the test's business. A test coupled to internals breaks on every refactor, which trains everyone to ignore failures.

Test what you would check by hand. Running the program and eyeballing the output is a test, so write it down.

> [!TIP]
> A test you cannot imagine failing is testing the wrong thing. It costs maintenance and buys false confidence, which is worse than having no test there.

## Making failures readable

A failing test is a message to whoever reads it, often you in three months.

Name tests after the behaviour, so `test_returns_empty_list_for_empty_input` over `test_reverse_2`. The first tells you what broke from the failure output alone.

Keep one behaviour per test, because the first failure in a test asserting five things hides the other four. And assert on specifics: `assert result == [3, 2, 1]` beats `assert result is not None` every time.

## Properties, when examples run out

Sometimes you cannot enumerate the cases and can still state something that must always hold. Property-based testing generates hundreds of inputs and tries to break the claim:

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_reversing_twice_gives_the_original(xs):
    assert reverse(reverse(xs)) == xs
```

Properties worth looking for: round trips, where decode(encode(x)) equals x, which is excellent for parsers and serialisers; invariants, where sorting preserves length and the multiset of elements; and agreement, where your fast implementation matches the slow obviously-correct one on random inputs.

That last one is the highest-value testing technique students never learn, and it is the same trick as the brute-force comparison in [Competitive Programming](/wiki/tutorials/competitive-programming). Hypothesis also shrinks any failing input to the smallest case that still breaks, which usually makes the bug obvious on sight.

## Dependencies that make testing hard

Code that reads the clock, hits the network or writes files is awkward to test: slow, flaky, dependent on things you do not control.

The fix is usually separating the decision from the effect, and not a mocking framework:

```python
# hard to test: decision and effect tangled together
def maybe_expire(record):
    if datetime.now() > record.expires_at:
        database.delete(record.id)

# easy to test: the decision is a pure function
def is_expired(record, now):
    return now > record.expires_at
```

`is_expired` needs no database and no clock, and every boundary case fits in a few lines. The thin wrapper that actually deletes is simple enough to check once. Pushing logic out of I/O and into pure functions is the most effective thing you can do for testability, and it improves the code anyway.

## On coverage

Coverage measures which lines ran during the tests, and it is useful in one direction. Low coverage reliably points at untested code, and reading what is uncovered is a good way to find gaps.

High coverage proves very little. A test calling every line and asserting nothing scores 100%. Chasing the number produces tests written to touch lines, which catch nothing.

## Running them automatically

Tests you have to remember to run are tests you will not run. Have your editor run them on save and have CI run them on every push. The repository this wiki lives in runs its checks in GitHub Actions on every commit, which is a reasonable pattern to copy.

Automation matters because the feedback arrives while you still remember what you changed.

## A realistic standard

Testing everything is not obligatory. Supervision work rarely justifies it. A project you will still be working on in three months, or that someone else will touch, repays it quickly.

A pragmatic default: test the tricky pure functions thoroughly, test the boundaries, add a test for every bug you fix, and stop agonising about the rest.

## Further reading

- [pytest documentation](https://docs.pytest.org/)
- [JUnit 5 user guide](https://junit.org/junit5/)
- [Hypothesis documentation](https://hypothesis.readthedocs.io/), property-based testing for Python
