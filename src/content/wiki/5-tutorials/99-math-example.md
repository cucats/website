---
title: Math Example
description: Demonstrating LaTeX math support
---

This wiki renders LaTeX with [KaTeX](https://katex.org/), so mathematical notation goes straight into Markdown. This page demonstrates what works and doubles as a reference for anyone writing a page that needs mathematics.

## Inline and display

Single dollar signs set an expression inline so it flows with the text: merge sort runs in $O(n \log n)$ time, and binary search needs at most $\lfloor \log_2 n \rfloor + 1$ comparisons on a sorted list of $n$ elements. That first one was written as:

```text
merge sort runs in $O(n \log n)$ time
```

Double dollar signs set it on its own centred line, which is what you want for anything you intend to refer back to:

```text
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

giving:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Display style gives operators room, so sums and integrals put their limits above and below:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Notation that comes up in computer science

Asymptotic notation, set membership and quantifiers all work as expected. The formal definition of an upper bound:

$$
f(n) = O(g(n)) \iff \exists\, c > 0,\ n_0 \in \mathbb{N} \ \text{ such that } \ f(n) \le c\,g(n) \ \text{ for all } n \ge n_0
$$

Geometric sums, which is where the cost of doubling an array comes from:

$$
\sum_{i=0}^{n-1} 2^i = 2^n - 1
$$

The harmonic number, which turns up in the average-case analysis of quicksort:

$$
H_n = \sum_{k=1}^{n} \frac{1}{k} \approx \ln n + \gamma
$$

Multi-line derivations use the `aligned` environment, with `&` marking the alignment point and `\\` ending each line:

$$
\begin{aligned}
T(n) &= 2\,T(n/2) + \Theta(n) \\
     &= 4\,T(n/4) + 2\,\Theta(n) \\
     &= \dots \\
     &= \Theta(n \log n)
\end{aligned}
$$

Matrices and cases work too:

$$
A = \begin{pmatrix} 1 & 0 \\ 1 & 1 \end{pmatrix}
\qquad
\mathrm{sgn}(x) = \begin{cases}
  1 & \text{if } x > 0 \\
  0 & \text{if } x = 0 \\
  -1 & \text{if } x < 0
\end{cases}
$$

## Dollar signs in code

Mathematics gets extracted from the page before the Markdown is parsed, so that the parser cannot mangle it. Code is masked off first, which leaves dollar signs inside fenced code blocks and inline code spans exactly as written.

So all of this renders literally:

```bash
eval $(opam env)
echo "${HOME}/bin"
```

```latex
The area of a circle is $\pi r^2$.
```

And inline: `$HOME`, `$(pwd)`, `$1`.

> [!NOTE]
> `src/lib/server/markdown/renderer.ts` handles this. Fenced blocks and code spans get swapped for placeholders, the math extraction runs, and the code goes back before parsing. Adding a page full of shell or LaTeX needs nothing special from you.

## Everything else KaTeX supports

KaTeX covers the large majority of LaTeX's mathematics mode, including Greek letters, accents, arrays, `\text` for prose inside expressions, and the standard operators and relations. Anything that fails to render is worth checking against the [KaTeX supported functions list](https://katex.org/docs/supported.html). Unsupported commands render as visible errors, so problems are easy to spot in preview.
