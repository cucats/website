---
title: Math Rendering Example
description: Demonstrating LaTeX math support
---

This page demonstrates our math rendering capabilities using KaTeX.

## Inline Math

You can write inline math like $E = mc^2$ or the quadratic formula $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ directly in your text.

## Display Math

For larger equations, use display mode:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## More Examples

### The Euler Identity

One of the most beautiful equations in mathematics:

$$e^{i\pi} + 1 = 0$$

### Summation

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

### Matrix

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

## Code Example

Here's some Python code that computes factorials:

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# The factorial function grows as n!
# Stirling's approximation: n! ≈ √(2πn)(n/e)^n
```

> [!NOTE]
> Math expressions are rendered server-side using KaTeX, so they display instantly without client-side JavaScript.
