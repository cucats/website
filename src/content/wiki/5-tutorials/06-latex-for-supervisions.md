---
title: LaTeX for Supervision Work
description: Typesetting supervision work without fighting the tooling
---

Nobody has to typeset supervision work. Plenty of people hand in neat handwriting for three years and are perfectly happy with that. LaTeX earns its keep if your handwriting is bad, if you want to revise from your own work later, or if you are writing anything with much mathematics in it.

The trick is learning the fifteen percent you need and ignoring the rest, since LaTeX is enormous and most of it has nothing to do with a weekly problem sheet.

## Getting it running

[Overleaf](https://www.overleaf.com/) has the least friction. It runs in the browser with nothing to install and handles collaboration, so it is the right choice if you want to start writing in the next five minutes.

Locally, install a TeX distribution, meaning TeX Live on Linux, MacTeX on macOS or MiKTeX on Windows, then use VS Code with the LaTeX Workshop extension for a live preview and compile-on-save. On Debian or Ubuntu:

```bash
sudo apt-get install texlive-latex-recommended texlive-latex-extra latexmk
```

Compile with `latexmk`, which works out how many passes are needed:

```bash
latexmk -pdf sheet.tex
```

Local is faster and works offline. Overleaf is easier to share. Either does the job.

## A template that covers most of it

Enough for a typical problem sheet, and reusable every week:

```latex
\documentclass[11pt]{article}

\usepackage[margin=2.5cm]{geometry}
\usepackage{amsmath, amssymb, amsthm}
\usepackage{enumitem}

\title{Foundations of Computer Science, Sheet 3}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section*{Question 1}

Your answer here.

\end{document}
```

`amsmath` and `amssymb` make mathematics work properly. Include them by reflex.

## Mathematics

Inline mathematics goes between single dollar signs and flows with the text, so `$O(n \log n)$` gives $O(n \log n)$.

Displayed mathematics goes in an `equation` or `align` environment, starred where you want no equation number:

```latex
\begin{equation*}
  \sum_{i=1}^{n} i = \frac{n(n+1)}{2}
\end{equation*}
```

For a multi-line derivation, `align*` lines things up at the `&`:

```latex
\begin{align*}
  T(n) &= 2\,T(n/2) + \Theta(n) \\
       &= 4\,T(n/4) + 2\,\Theta(n) \\
       &= \Theta(n \log n)
\end{align*}
```

which gives

$$
\begin{aligned}
  T(n) &= 2\,T(n/2) + \Theta(n) \\
       &= 4\,T(n/4) + 2\,\Theta(n) \\
       &= \Theta(n \log n)
\end{aligned}
$$

> [!TIP]
> Keep `$$ ... $$` out of your display mathematics. It is plain TeX, it interacts badly with spacing and with `amsmath`, and `\[ ... \]` or an `equation*` environment does the job properly.

## Notation you reach for constantly

| You want                  | You write                                                   |
| ------------------------- | ----------------------------------------------------------- |
| Fractions                 | `\frac{a}{b}`                                               |
| Subscript and superscript | `x_i`, `x^2`, `x_{i+1}`                                     |
| Sums and products         | `\sum_{i=1}^{n}`, `\prod_{i=1}^{n}`                         |
| Greek letters             | `\alpha`, `\beta`, `\Theta`, `\lambda`                      |
| Sets                      | `\mathbb{N}`, `\mathbb{R}`, `\in`, `\subseteq`, `\emptyset` |
| Logic                     | `\land`, `\lor`, `\lnot`, `\implies`, `\forall`, `\exists`  |
| Relations                 | `\leq`, `\geq`, `\neq`, `\approx`, `\equiv`                 |
| Floor and ceiling         | `\lfloor x \rfloor`, `\lceil x \rceil`                      |
| Text inside maths         | `\text{if } x > 0`                                          |
| Brackets sized to fit     | `\left( ... \right)`                                        |

Forgotten the name of a symbol? [Detexify](https://detexify.kirelabs.org/classify.html) lets you draw it and tells you the command, and it is uncannily good.

## Lists and code

For numbered answers, `enumitem` controls the labels:

```latex
\begin{enumerate}[label=(\alph*)]
  \item First part.
  \item Second part.
\end{enumerate}
```

For code, `listings` and `minted` both work, though `verbatim` is usually enough for supervision work and needs no setup:

```latex
\begin{verbatim}
let rec fact n = if n = 0 then 1 else n * fact (n - 1)
\end{verbatim}
```

## Things that go wrong

The error messages are terrible. LaTeX reports the line where it noticed a problem, which is often hundreds of lines below the line that caused it, so when an error makes no sense look above the line it points at. A missing closing brace is the usual culprit.

`Undefined control sequence` means a command that does not exist, so a typo or a package you forgot to include. `\mathbb{N}` without `amssymb` is the classic.

`Missing $ inserted` means a maths-only command has escaped into ordinary text. Underscores cause most of these; `x_i` in a normal paragraph will trigger it.

Compile early and often. Writing three pages before your first compile leaves you debugging three pages at once.

Keep a personal preamble. Once you have packages and macros you like, start every sheet from the same file, and the saving compounds over three years.

## Is it worth it

For a problem sheet that is mostly prose, honestly no. Write it by hand and go to bed. For anything heavy in mathematics, for work you want to revise from, or for anything you might submit or share, yes. The initial investment runs to a couple of hours and lasts the whole degree.
