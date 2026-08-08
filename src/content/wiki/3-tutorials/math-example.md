---
title: Math Example
description: Demonstrating LaTeX math support
---

This wiki renders LaTeX with [KaTeX](https://katex.org/), so mathematical notation can be written directly in Markdown. This page doubles as a demonstration of what is supported and a reference for anyone writing a page that needs mathematics.

## Inline and display

Wrap an expression in single dollar signs to set it inline, so that it flows with the surrounding text: merge sort runs in $O(n \log n)$ time, and binary search needs at most $\lfloor \log_2 n \rfloor + 1$ comparisons on a sorted list of $n$ elements.

Wrap it in double dollar signs to set it on its own centred line, which is what you want for anything you intend to refer back to:

$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Display style gives operators room to breathe, so sums and integrals render with their limits above and below rather than beside:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Notation that comes up in computer science

Asymptotic notation, set membership and quantifiers all work as you would expect. The formal definition of an upper bound reads:

$$
f(n) = O(g(n)) \iff \exists\, c > 0,\ n_0 \in \mathbb{N} \ \text{ such that } \ f(n) \le c\,g(n) \ \text{ for all } n \ge n_0
$$

Geometric sums, which is where the cost of doubling an array comes from:

$$
\sum_{i=0}^{n-1} 2^i = 2^n - 1
$$

The harmonic number, which shows up in the average-case analysis of quicksort:

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

## One caveat for authors

> [!WARNING]
> Mathematics is extracted from the page **before** the Markdown is parsed, and the extraction does not skip fenced code blocks. A pair of dollar signs inside a code block will therefore be rendered as mathematics rather than shown literally.

In practice this means two things when you are writing a page:

- **Avoid dollar signs in code samples.** Write shell commands bare, without a leading prompt character, and avoid shell variable interpolation. If you need to show either, describe it in prose instead.
- **You cannot show raw math syntax literally**, which is why this page describes the delimiters in words rather than printing them.

If you hit a case where you genuinely need a literal dollar sign in a code block, it is worth fixing the renderer in `src/lib/server/markdown/renderer.ts` rather than working around it — the extraction step would need to skip fenced regions, in the same way that `is_in_code_block` is already used when collecting headings.

## Everything else KaTeX supports

KaTeX covers the large majority of LaTeX's mathematics mode, including Greek letters, accents, arrays, `\text` for prose inside expressions, and the standard operators and relations. If something does not render, check it against the [KaTeX supported functions list](https://katex.org/docs/supported.html) — unsupported commands render as visible errors rather than failing silently, so problems are easy to spot in preview.
