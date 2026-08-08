---
title: TeX and LaTeX
description: Expansion, boxes and glue, and the parts of the stack that explain the error messages
---

TeX is a macro expander driving a typesetter, and LaTeX is a macro package on top of it. Almost every confusing error is the boundary between those two showing through.

## Expansion

TeX processes input in stages that the documentation calls the mouth and the stomach. The mouth tokenises and expands macros; the stomach executes primitives that build boxes. A macro is expanded before its arguments mean anything, which is why `\edef` and `\expandafter` exist and why moving an expansion one token earlier changes the result.

Category codes are assigned at tokenisation, so a character's meaning is fixed when it is read and not when it is used. That is why `\verb` cannot appear inside a macro argument: by the time the argument is being read, the catcodes have already been assigned under the normal regime.

Fragile commands and `\protect` are the same phenomenon in the moving arguments that get written to auxiliary files and re-read. `\DeclareRobustCommand` sidesteps it, and LaTeX3 avoids the whole area with a cleaner expansion model.

## Boxes and glue

Everything on the page is a box. Characters go into horizontal boxes, lines stack into vertical boxes, and glue is the stretchable space between them with a natural size, a stretch component and a shrink component.

Badness measures how far glue has been stretched from natural size, and the underfull and overfull warnings are that measure crossing a threshold. An overfull hbox means the paragraph breaker found no acceptable set of line breaks, which is usually a long unhyphenatable token and seldom anything about your prose.

The paragraph breaker is global. TeX optimises breaks over the whole paragraph with a dynamic program, which is why changing one word can reflow every line, and why the result is better than a greedy line breaker. Penalties are the tuning knob, with `\widowpenalty` and `\clubpenalty` the ones worth setting.

Float placement is a separate algorithm with its own parameters, and figures moving to the end of a document means the placement constraints are unsatisfiable, and LaTeX has not ignored you. `[htbp]` widens the search, and `\clearpage` forces the queue to drain.

## Mathematics

`amsmath` is not optional. It fixes spacing around display environments, provides `align` and its relatives with correct alignment points, and adds `\text` for prose inside maths.

Maths mode has its own spacing rules driven by atom classes: `\mathbin`, `\mathrel`, `\mathopen` and so on determine the space around a symbol. A symbol that looks wrongly spaced is nearly always declared in the wrong class, and `\mathrel{}` around it is the fix.

`\left` and `\right` size delimiters to their contents and also make the whole group an inner atom, which changes the surrounding spacing. Where that matters, the manual `\bigl` and `\bigr` family gives control.

`$$` is plain TeX and interacts badly with `amsmath` spacing. `\[` and `\]` or a named environment is the LaTeX spelling.

## The toolchain

`latexmk` resolves the multi-pass dependency between the document, the aux files, the bibliography and the index, and running it is preferable to counting passes by hand.

The engines differ in ways that decide the project. pdfTeX is the classic 8-bit engine. XeTeX and LuaTeX are Unicode-native and can use system fonts through `fontspec`, and LuaTeX embeds Lua so that callbacks into the typesetting process are available. `biber` with `biblatex` supersedes `bibtex` for anything with non-ASCII or unusual citation styles.

Reading a `.log` beats reading the terminal, since the terminal truncates and the log holds the full context including which file the error came from.

## Where the errors come from

The reported line is where TeX noticed the problem, and unbalanced braces are noticed at the end of the group, which may be pages later. Bisecting the document with `\end{document}` moved upward finds it faster than reading.

`Missing $ inserted` means a maths-mode primitive appeared in text mode, and the usual culprit is an underscore. `Undefined control sequence` is a typo or an absent package. `Runaway argument` is an unterminated argument, usually a missing brace or a blank line inside a command that forbids one.

Package clashes are real and ordering-sensitive. `hyperref` wants to be loaded late, `cleveref` after it, and `geometry` before anything that reads the page dimensions.

## Reading

- [The TeXbook](https://www-cs-faculty.stanford.edu/~knuth/abcde.html), which is the specification of the underlying engine
- [The LaTeX3 project](https://www.latex-project.org/) and the `expl3` interfaces
- [Detexify](https://detexify.kirelabs.org/classify.html) for symbol lookup by drawing
- [TeX StackExchange](https://tex.stackexchange.com/), which is unusually high quality
