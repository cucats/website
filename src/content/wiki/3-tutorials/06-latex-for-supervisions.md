---
title: LaTeX for Supervision Work
description: Typesetting supervision work without fighting the tooling
---

You do not have to typeset your supervision work. Plenty of people hand in neat handwriting for three years and are perfectly happy. But if your handwriting is bad, if you want to revise from your own work later, or if you are writing anything with a lot of mathematics in it, LaTeX pays for itself quickly.

The trick is to learn the fifteen percent you actually need and ignore the rest, because LaTeX is enormous and most of it is irrelevant to a weekly problem sheet.

## Getting it running

The lowest-friction option is **[Overleaf](https://www.overleaf.com/)**, which runs in the browser with nothing to install and handles collaboration. It is the right choice if you want to start writing in the next five minutes.

For a local installation, install a TeX distribution — TeX Live on Linux, MacTeX on macOS, MiKTeX on Windows — and then use **VS Code with the LaTeX Workshop extension**, which gives you a live preview and compiles on save. On Debian or Ubuntu:

```bash
sudo apt-get install texlive-latex-recommended texlive-latex-extra latexmk
```

Compile with `latexmk`, which works out how many passes are needed so you do not have to:

```bash
latexmk -pdf sheet.tex
```

Local is faster and works offline; Overleaf is easier to share. Either is fine.

## A template that covers most of it

This is enough for a typical problem sheet, and you can reuse it every week:

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

`amsmath` and `amssymb` are the packages that make mathematics work properly; include them by reflex.

## Mathematics

Inline mathematics goes between single dollar signs, so that it flows with the text: writing `$O(n \log n)$` gives $O(n \log n)$.

Displayed mathematics goes in an `equation` or `align` environment. Use the starred forms when you do not want an equation number:

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

which produces

$$
\begin{aligned}
  T(n) &= 2\,T(n/2) + \Theta(n) \\
       &= 4\,T(n/4) + 2\,\Theta(n) \\
       &= \Theta(n \log n)
\end{aligned}
$$

> [!TIP]
> Do not use `$$ ... $$` for display mathematics. It is plain TeX, not LaTeX, and it interacts badly with spacing and with `amsmath`. Use `\[ ... \]` or an `equation*` environment instead.

## Notation you will reach for constantly

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
| Big operators sized right | `\left( ... \right)`                                        |

If you cannot remember a symbol's name, [Detexify](https://detexify.kirelabs.org/classify.html) lets you draw it and tells you the command. It is uncannily good.

## Lists and code

For numbered answers, `enumitem` lets you control the labels:

```latex
\begin{enumerate}[label=(\alph*)]
  \item First part.
  \item Second part.
\end{enumerate}
```

For code, `listings` or `minted` both work, but for supervision work `verbatim` is usually enough and has no setup cost:

```latex
\begin{verbatim}
let rec fact n = if n = 0 then 1 else n * fact (n - 1)
\end{verbatim}
```

## Things that go wrong

**The error messages are terrible.** LaTeX reports the line where it noticed a problem, not the line that caused it. A missing closing brace is often reported hundreds of lines later. When an error makes no sense, look above the reported line.

**`Undefined control sequence`** means you have used a command that does not exist — usually a typo, or a package you forgot to include. `\mathbb{N}` without `amssymb` is the classic.

**`Missing $ inserted`** means you have used a maths-only command outside maths mode. Underscores are the usual culprit: `x_i` in ordinary text will trigger this.

**Compile early and often.** If you write three pages and then compile for the first time, you will be debugging three pages at once. Compile every few paragraphs.

**Keep a personal preamble.** Once you have a set of packages and macros you like, save them and start every sheet from the same file. The time saving compounds over three years.

## Is it worth it?

For a problem sheet that is mostly prose, honestly, no — write it by hand and go to bed. For anything heavy in mathematics, for work you want to revise from later, or for anything you might submit or share, yes. The initial investment is a couple of hours and it lasts the whole degree.
