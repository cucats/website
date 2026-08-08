---
title: Regular Expressions
description: Automata, backtracking, and the features that leave the regular languages behind
---

The name is a claim about expressive power, and most implementations broke it decades ago. Knowing which engine you are talking to determines both what you can match and what your worst case is.

## Two engine families

Thompson construction compiles a pattern to an NFA and simulates it, tracking the set of reachable states as it consumes input. Every character advances every live state exactly once, giving O(mn) worst case with no backtracking. Determinising to a DFA, ahead of time or lazily with a state cache, gets that to O(n) at the cost of a state space exponential in the worst case, which is what the cache bounds.

Backtracking engines walk the pattern recursively and undo on failure. PCRE, Perl, Python's `re`, Java and JavaScript all do this, and it is why they support backreferences and lookaround: the engine has the match history available because it is carrying it on the stack.

That capability is what costs the complexity guarantee. A pattern with nested quantifiers over a failing input explores an exponential number of paths, and `(a+)+$` against a long run of `a` is the canonical demonstration. Applied to attacker-controlled input, that is a denial of service with a two-line payload.

RE2 and Go's `regexp` take the other branch, refusing backreferences and guaranteeing linear time. Where the input is untrusted, that trade is the correct one.

## Where the regular languages end

Backreferences push the language class past regular outright. `(a+)\1` matches a doubled string, which is neither regular nor context-free.

Lookaround is the more interesting case, since zero-width assertions add no expressive power over regular languages in principle and change the complexity of matching substantially in practice. Lookbehind is where implementations diverge most: .NET handles variable-length, PCRE historically wanted fixed-length, and JavaScript gained it late.

Recursive patterns in PCRE take you to context-free grammars, at which point you are writing a parser in a syntax designed for something else. Balanced brackets can be matched this way and should not be.

## Catastrophic backtracking, concretely

The failure needs two ingredients: ambiguity in how the pattern can split the input, and a suffix that fails. `(a|a)*b` against a run of thirty `a` characters has $2^n$ ways to divide the input among iterations and tries all of them before concluding there is no `b`.

Atomic groups `(?>...)` and possessive quantifiers `a*+` discard backtracking positions on exit, which is the direct fix where the engine supports them. Removing the ambiguity is the portable one, usually by making each alternative match a disjoint set of first characters.

Auditing for this is mechanical: find a quantifier applied to a group that itself contains a quantifier or an alternation with overlapping alternatives, then check what happens when the match fails late.

## Details that bite

Greedy and lazy differ in the order alternatives are tried and not in the language matched, so on a successful anchored match with no ambiguity they agree. The difference shows up in what gets captured.

`.` excludes newline until dotall changes that. `^` and `$` are string anchors until multiline mode makes them line anchors, and `$` also matches before a final newline in several engines, which is a common off-by-one when validating.

Unicode turns a character class into a question about what a character is. `\w` may or may not include non-ASCII letters depending on flags and engine, grapheme clusters do not correspond to code points, and case folding is locale-dependent in the cases where it matters. `\p{L}` and the other property escapes are what to reach for.

## When the tool is wrong

Regular expressions cannot match balanced delimiters, and every attempt to parse HTML, JSON or source code with them is a bet that the input is not adversarial. Use a parser.

The other signal is a pattern you cannot read. Verbose mode with comments recovers some of it, and past a certain size the honest move is a small hand-written scanner someone can debug.

## Reading

- [RE2 syntax](https://github.com/google/re2/wiki/Syntax) and the linear-time guarantee
- [Regular Expression Matching Can Be Simple And Fast](https://swtch.com/~rsc/regexp/regexp1.html) by Russ Cox, on the two engine families
- [regex101.com](https://regex101.com/) for the debugger and the backtracking count
