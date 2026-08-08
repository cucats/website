---
title: Getting Started with Competitive Programming
description: Complexity budgets, input parsing, and the patterns that come up first
---

Competitive programming means solving tightly-specified algorithmic problems against a clock, judged automatically. It builds speed on the material in Algorithms, it maps directly onto technical interviews, and a fair number of people find it genuinely fun.

[UCCPS](https://uccps.soc.srcf.net) runs practice sessions and contests in Cambridge and is the best place to start if you want company while learning. Our own [Codevent](/wiki/events/codevent) runs through December at a gentler pace.

This page covers the things obvious to everyone who already does this and mystifying to everyone who does not.

## Read the constraints first

This one habit separates people who make progress from people who spend an hour on a hopeless approach. Before thinking about how to solve a problem, look at how large the input can be. That number tells you which complexities fit, and therefore which family of algorithm you are hunting for.

Judges typically allow something on the order of $10^8$ simple operations per second. Working backwards:

| If n is up to | You can afford | Typical approach              |
| ------------- | -------------- | ----------------------------- |
| 10            | $O(n!)$        | try every permutation         |
| 20            | $O(2^n)$       | try every subset, bitmask DP  |
| 500           | $O(n^3)$       | Floyd–Warshall, some DP       |
| 5 000         | $O(n^2)$       | nested loops, simple DP       |
| $10^6$        | $O(n \log n)$  | sorting, heaps, binary search |
| $10^8$        | $O(n)$         | a single pass                 |

With n up to $10^5$ and an $O(n^2)$ idea, you are looking at $10^{10}$ operations and it will not pass. Knowing that before you write anything saves the hour.

## Pick a language and stay there

C++ is the default, being fast with a standard library holding the data structures you need. Python is far more pleasant to write and often too slow for the tightest limits, though for many problems it is fine. Java sits between them.

Learn one properly. If you are choosing fresh and expect to take this seriously, C++ is the pragmatic answer.

## Input parsing

Reading input trips people up first and is entirely mechanical, since problems specify their input precisely and it looks the same every time.

In C++, turn off the C-stream synchronisation or large inputs get slow:

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    cout << "answer" << "\n";
    return 0;
}
```

Use `"\n"` over `endl`, which flushes the stream every time and genuinely causes time-limit failures.

In Python, keep `input()` out of loops:

```python
import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1 : 1 + n]))
    print(len(a))

main()
```

Reading everything at once and slicing runs dramatically faster than reading line by line.

## Patterns worth knowing first

Roughly in order of how often they come up early:

- Sorting, then a linear scan. An enormous number of problems become easy once the input is sorted.
- Prefix sums. Precompute cumulative totals so any range sum is one subtraction, turning $O(n)$ per query into $O(1)$.
- Two pointers and sliding windows, for subarray problems on sorted or monotonic data.
- Binary search, including on the answer. Where you can cheaply check "is a result of at least x achievable", you can binary search x and skip computing it directly. People find this the least obvious and use it the most.
- Hash maps for counting. Frequency tables solve a surprising share of easier problems.
- Graph traversal: BFS for shortest paths on unweighted graphs, DFS for connectivity and cycles, Dijkstra once edges carry weights.
- Dynamic programming. Define the state, define the transition, decide the order. Most early DP problems vary knapsack or longest-increasing-subsequence.

Part IA Algorithms covers most of the underlying theory. Contests are about recognising which one applies within a few minutes.

## Where to practise

- [Codeforces](https://codeforces.com/) is the main platform, with regular contests and an archive filterable by difficulty rating. Start around 800 and work up.
- [AtCoder](https://atcoder.jp/) runs Beginner Contests with well-written problems that ramp gently within each contest.
- [Advent of Code](https://adventofcode.com/) has December puzzles with no time pressure, in any language, and is good for getting comfortable with parsing.
- [CUCaTS Codevent](/wiki/events/codevent) is our own December competition, scored on how quickly you solve each day.

## How to improve

Solve problems slightly above comfortable. Problems you can already do teach you nothing, and problems far beyond you teach you nothing either.

Set a time limit on being stuck and then read the editorial, with thirty to forty minutes a reasonable cap. Reading the solution to a problem you genuinely wrestled with is among the fastest ways to learn. Reading it after five minutes is not.

Having read an editorial, close it and implement the solution yourself. Understanding a solution and being able to write one are different skills, and contests test the second.

Keep your own template, holding your includes, fast input setup and common helpers, ready to copy at the start of every problem. It removes a few minutes of overhead every single time.

> [!TIP]
> When a solution fails, generate small random inputs and compare against an obviously-correct brute force. This finds the edge case far faster than staring at the code, and it is what experienced competitors reach for first.

## Where to read more

The [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf) by Antti Laaksonen is free, excellent and the standard recommendation. The [CSES Problem Set](https://cses.fi/problemset/) that goes with it is a well-ordered sequence covering each topic in turn, and working through it is a genuinely good use of a vacation.
