---
title: Getting Started with Competitive Programming
description: Complexity budgets, input parsing, and the patterns that come up first
---

Competitive programming is solving tightly-specified algorithmic problems against a time limit, judged automatically. It is a good way to get fast at the material in Algorithms, it is directly useful for technical interviews, and a fair number of people find it genuinely fun.

[UCCPS](https://uccps.soc.srcf.net) runs practice sessions and contests in Cambridge, and is the best place to start if you want company while learning. This page covers the things that are obvious to everyone who already does it and mystifying to everyone who does not.

## Read the constraints first

This is the single habit that separates people who make progress from people who spend an hour on a hopeless approach. Before thinking about how to solve a problem, look at how large the input can be. That number tells you which complexities are allowed, and therefore which family of algorithm you are looking for.

Judges typically allow something on the order of $10^8$ simple operations per second. Working backwards:

| If n is up to | You can afford | Typical approach              |
| ------------- | -------------- | ----------------------------- |
| 10            | $O(n!)$        | Try every permutation         |
| 20            | $O(2^n)$       | Try every subset, bitmask DP  |
| 500           | $O(n^3)$       | Floyd–Warshall, some DP       |
| 5 000         | $O(n^2)$       | Nested loops, simple DP       |
| $10^6$        | $O(n \log n)$  | Sorting, heaps, binary search |
| $10^8$        | $O(n)$         | A single pass                 |

If n is up to $10^5$ and your idea is $O(n^2)$, that is $10^{10}$ operations and it will not pass. Knowing this before you start writing saves the hour.

## Pick a language and stick to it

**C++** is the default, because it is fast and its standard library has the data structures you need. **Python** is far more pleasant to write but often too slow for the tightest limits, though for many problems it is perfectly adequate. **Java** sits in between.

Learn one properly rather than three badly. If you are choosing fresh and expect to do this seriously, C++ is the pragmatic answer.

## Input parsing

Reading input is the first thing that trips people up, and it is entirely mechanical. Problems specify input precisely, so parsing is the same every time.

In C++, turn off the C-stream synchronisation or large inputs will be slow:

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

Use `"\n"` rather than `endl` — `endl` flushes the stream every time and is a genuine cause of time-limit failures.

In Python, avoid `input()` in loops:

```python
import sys

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    a = list(map(int, data[1 : 1 + n]))
    print(len(a))

main()
```

Reading everything at once and slicing is dramatically faster than reading line by line.

## Patterns worth knowing first

In rough order of how often they come up early:

- **Sorting, then a linear scan.** An enormous number of problems become easy once the input is sorted.
- **Prefix sums.** Precompute cumulative totals so any range sum is one subtraction. Turns $O(n)$ per query into $O(1)$.
- **Two pointers and sliding windows.** For subarray problems on sorted or monotonic data.
- **Binary search — including on the answer.** If you can cheaply check "is a result of at least x achievable?", you can binary search x rather than computing it directly. This is the trick people find least obvious and use most.
- **Hash maps for counting.** Frequency tables solve a surprising share of easier problems.
- **Graph traversal.** BFS for shortest paths on unweighted graphs, DFS for connectivity and cycles, Dijkstra once edges have weights.
- **Dynamic programming.** Define the state, define the transition, decide the order. Most early DP problems are a variation on knapsack or longest-increasing-subsequence.

Part IA Algorithms covers most of the underlying theory; contests are about recognising which one applies within a few minutes.

## Where to practise

- **[Codeforces](https://codeforces.com/)** — the main platform. Regular contests, and an archive filterable by difficulty rating. Start around rating 800 and work up.
- **[AtCoder](https://atcoder.jp/)** — Beginner Contests are well-written, and the problems increase in difficulty gently within each contest.
- **[Advent of Code](https://adventofcode.com/)** — December puzzles, no time pressure, any language. Much gentler, and good for getting comfortable with parsing.
- **[CUCaTS Codevent](https://cc.cucats.org/about)** — our own December competition, scored on how quickly you solve each day.

## How to actually improve

**Solve problems slightly above what is comfortable.** Problems you can already do teach you nothing; problems far beyond you teach you nothing either.

**Set a time limit for being stuck, then read the editorial.** Thirty to forty minutes is a reasonable cap. Reading the solution to a problem you have genuinely wrestled with is one of the fastest ways to learn. Reading it after five minutes is not.

**After reading an editorial, close it and implement the solution yourself.** Understanding a solution and being able to write it are different skills, and only the second one is tested.

**Keep your own template.** A file with your includes, fast input setup and common helpers, ready to copy at the start of every problem, removes a few minutes of overhead every time.

> [!TIP]
> When your solution fails, generate small random inputs and compare against an obviously-correct brute force. This finds the edge case far faster than staring at the code, and it is what experienced competitors do first rather than last.

## Where to read more

The [Competitive Programmer's Handbook](https://cses.fi/book/book.pdf) by Antti Laaksonen is free, excellent, and the standard recommendation. The [CSES Problem Set](https://cses.fi/problemset/) that accompanies it is a well-ordered sequence of problems covering each topic in turn — working through it is a genuinely good use of a vacation.
