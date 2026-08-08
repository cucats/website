---
title: Setting Up OCaml
description: Getting a working OCaml environment for Foundations of Computer Science
---

Part IA Foundations of Computer Science is taught in OCaml, which is the first functional language most people meet. The course covers the language. What it spends no time on is getting a comfortable environment set up, which is what this page is for.

> [!NOTE]
> Follow the course where its instructions differ from these. The [Part IA course pages](https://www.cl.cam.ac.uk/teaching/current/part1a.html) and the practical class materials are authoritative, and the MCS machines may already have a suitable setup.

## Installing opam

OCaml gets installed through opam, its package manager. Install opam and it installs everything else.

On Debian or Ubuntu:

```bash
sudo apt-get install opam
```

On macOS with Homebrew:

```bash
brew install opam
```

On Windows the cleanest route by a wide margin is the Windows Subsystem for Linux: install WSL and follow the Debian instructions inside it. A native Windows opam installer exists, though WSL matches the course materials and everyone else's setup much more closely.

Then initialise, which downloads a compiler and sets up your first switch:

```bash
opam init -y
eval $(opam env)
```

That `eval` puts the OCaml tools on your `PATH` for the current shell. `opam init` offers to add it to your shell profile, and you should say yes unless you enjoy running it in every new terminal.

Check it worked:

```bash
ocaml -version
```

## Installing the tooling

The bare compiler works and is unpleasant. Install the standard toolchain:

```bash
opam install dune ocaml-lsp-server odoc ocamlformat utop
```

| Tool               | What it gives you                                                            |
| ------------------ | ---------------------------------------------------------------------------- |
| `dune`             | the build system: compiles projects, runs tests                              |
| `ocaml-lsp-server` | inline type errors, hover types and go-to-definition in your editor          |
| `utop`             | a much better interactive toplevel than `ocaml`, with history and completion |
| `ocamlformat`      | automatic formatting, so you stop arguing with yourself about layout         |
| `odoc`             | documentation generation, which Part IA will not need                        |

Of those, `ocaml-lsp-server` and `utop` change your day-to-day experience most.

## Editor setup

In VS Code, install the OCaml Platform extension. It talks to `ocaml-lsp-server` and gives you types on hover, which helps enormously while you are still learning to read OCaml's type errors.

One thing catches people out: the extension has to find your opam switch. If it reports that it cannot find the language server, launch your editor from a terminal where `eval $(opam env)` has already run. Starting it from the desktop icon will not work.

Neovim and Emacs both have mature OCaml support. Point your usual LSP client at `ocaml-lsp-server`.

## Using the toplevel

For course exercises, `utop` is usually all you need:

```bash
utop
```

Expressions end with a double semicolon:

```ocaml
# let rec fact n = if n = 0 then 1 else n * fact (n - 1);;
val fact : int -> int = <fun>

# fact 10;;
- : int = 3628800
```

Notice what comes back: the inferred type, `int -> int`. Reading those is a large part of learning OCaml, and the toplevel hands them to you free.

To load a file you have been editing:

```ocaml
# #use "myfile.ml";;
```

The leading `#` there is part of the directive, typed in addition to the prompt.

## A minimal project with dune

Once exercises outgrow a single file, use dune. Two files set it up.

`dune-project`:

```lisp
(lang dune 3.0)
```

`dune`:

```lisp
(executable
 (name main))
```

Put your code in `main.ml`, then:

```bash
dune build
dune exec ./main.exe
```

`dune build --watch` rebuilds as you save, which is a pleasant way to work through a problem sheet.

## Errors you will hit in week one

`This expression has type int but an expression was expected of type float` means you have mixed numeric types, which OCaml never converts for you. The operators differ too: `+` for `int`, `+.` for `float`. This is deliberate and stops being annoying quickly.

`This pattern-matching is not exhaustive` means you missed a case in a `match`. It is a warning, and one of the most valuable messages the compiler produces. Never silence it; it is telling you about a real gap.

`Unbound value` is usually a typo, or a function defined below the point where you used it. OCaml reads a file top to bottom, so definitions come before uses.

Forgetting `rec` will stop `let f n = ... f (n - 1)` compiling, since plain `let` does not bring the name into scope in its own body. You want `let rec`.

## Where to go next

- [OCaml documentation](https://ocaml.org/docs), the official tutorials, well maintained
- [Real World OCaml](https://dev.realworldocaml.org/), free online, well past what Part IA needs and excellent once you want to build something
- The course lecture notes, which remain the best match for what you are examined on

Worth knowing: [Jane Street](/wiki/sponsors/jane-street), one of our sponsors, runs almost its entire codebase in OCaml and maintains much of the open-source ecosystem around it.
