---
title: Competitive Programming
description: Amortised structures, decomposition techniques and the constant factors that decide a verdict
---

The constraint bound fixes the complexity class before you have an algorithm, and the interesting work is in the gap between the class you need and the structure that reaches it.

## Reading the bound

The standard budget of around $10^8$ elementary operations per second is a starting point, and the variance around it is large enough to matter. A pass over contiguous memory with a predictable branch runs several times faster than the same asymptotic work over a pointer structure, so $10^7$ operations chasing pointers and $10^9$ operations over an array can both fit the same limit.

The bound also tells you which techniques are in scope. $n \le 20$ points at subset enumeration, and if the intended solution is $O(2^n n)$ then subset-sum convolution or SOS DP is likely the mechanism. $n \le 40$ signals meet in the middle. A bound of $10^5$ with a query count of the same order means you are looking for something polylogarithmic per query, and no constant-factor work on a linear scan will reach it.

Sums-of-bounds constraints are a hint people miss. "The sum of $n$ over all test cases does not exceed $2 \cdot 10^5$" licenses per-test work that would be illegal if each test could be maximal.

## Decomposition

Square root decomposition trades a factor either way and is frequently enough. Splitting an array into $O(\sqrt n)$ blocks gives $O(\sqrt n)$ updates and queries with no structural cleverness, and Mo's algorithm reorders offline queries so that a two-pointer window moves $O((n + q)\sqrt n)$ times in total.

Segment trees generalise this to any associative operation, and the interesting variants are lazy propagation for range updates, merge-sort trees for order statistics on a range, and the Li Chao tree for maxima over lines. A Fenwick tree does prefix sums with a fraction of the constant, and the reason to reach for one is that constant.

Sparse tables answer idempotent range queries in $O(1)$ after $O(n \log n)$ preprocessing, which covers range minimum directly and, through the Euler tour, lowest common ancestor.

Heavy-light decomposition and centroid decomposition are the two standard reductions from trees to sequences. The first maps path queries onto $O(\log n)$ contiguous segments; the second builds a recursion over centroids so that any path is handled at exactly one level.

## Amortisation and offline reasoning

Small-to-large merging bounds total work by $O(n \log n)$ because each element moves only into a set at least twice the size of its previous one. DSU on tree exploits the same counting argument.

Offline processing is the technique that converts an impossible online problem into a sort. Sorting queries by right endpoint and sweeping, or processing updates and queries together in a divide-and-conquer over time, both remove the need to answer in the order asked. Parallel binary search takes this further, resolving $q$ independent binary searches in $O(\log)$ rounds of a single sweep.

Persistence buys you queries against historical versions for a $\log$ factor of memory, and a persistent segment tree over value-compressed indices is the standard answer to k-th smallest on a range.

## The shapes worth recognising

Dynamic programming problems are mostly a question of what to put in the state and what to optimise away. Convex hull trick and Li Chao handle linear transitions, divide-and-conquer optimisation applies when the argmin is monotone, and Knuth optimisation applies under the quadrangle inequality. Recognising that a transition is a convolution puts NTT in scope.

Flow problems are usually recognised through their reductions: bipartite matching, minimum vertex cover through König, project selection through minimum cut. Dinic's is fast enough on unit-capacity graphs that the theoretical bound rarely binds.

String problems split by whether the structure is on one string or many. Z-function and prefix function cover single-pattern matching, Aho-Corasick handles a dictionary, and suffix automaton or suffix array covers substring queries, with the automaton being easier to build correctly under time pressure.

## Constant factors that change the verdict

Memory layout dominates once the asymptotics are right. A flat array indexed arithmetically beats a vector of vectors, and iterative traversal beats recursion where the stack depth is large enough to miss.

Modular arithmetic is a hot path in counting problems, and replacing a `%` with a conditional subtraction after an addition is worth a factor. Montgomery or Barrett reduction is worth knowing for the cases where the modulus is fixed.

Bitset tricks turn an $O(n^2)$ reachability or subset-sum into $O(n^2 / 64)$, which converts a class of problems from too slow into comfortable.

Fast input matters at $10^6$ tokens. Reading the whole of stdin and parsing manually removes the formatted-input overhead entirely.

## Practice that works

Solve at the level where you fail perhaps a third of the time. Read the editorial after a bounded interval, then implement it without the editorial open, since understanding a solution and being able to produce one are separate skills.

Stress test against brute force with a random generator. Any wrong answer on a large hidden input is found faster this way than by reading, and the minimised counterexample usually makes the flaw obvious.

- [Codeforces](https://codeforces.com/), rated by difficulty
- [AtCoder](https://atcoder.jp/), whose harder rounds are well set
- [CSES Problem Set](https://cses.fi/problemset/), ordered by topic
- [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf)
- [CUCaTS Codevent](/wiki/events/codevent) in December, and [UCCPS](https://uccps.soc.srcf.net) during term
