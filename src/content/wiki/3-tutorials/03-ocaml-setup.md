---
title: Setting Up OCaml
description: Getting a working OCaml environment for Foundations of Computer Science
---

Part IA Foundations of Computer Science is taught in OCaml, and it is the first functional language most people meet. The language itself is covered by the course; what the course does not spend time on is getting a comfortable environment set up, which is what this page is for.

> [!NOTE]
> Where the course's own instructions differ from these, follow the course. The [Part IA course pages](https://www.cl.cam.ac.uk/teaching/current/part1a.html) and the practical class materials are authoritative, and the MCS machines may already have a suitable setup.

## Installing opam

OCaml is installed through **opam**, its package manager. You install opam first, and it installs everything else.

On Debian or Ubuntu:

```bash
sudo apt-get install opam
```

On macOS, with Homebrew:

```bash
brew install opam
```

On Windows, the cleanest route by a wide margin is the **Windows Subsystem for Linux** — install WSL, then follow the Debian instructions inside it. There is a native Windows opam installer, but WSL will match the course materials and everyone else's setup more closely.

Then initialise it, which downloads a compiler and sets up your first switch:

```bash
opam init -y
eval $(opam env)
```

The `eval` line puts the OCaml tools on your `PATH` for the current shell. `opam init` will offer to add this to your shell profile automatically — say yes, or you will be running it in every new terminal.

Check that it worked:

```bash
ocaml -version
```

## Installing the tooling

The bare compiler is usable but unpleasant. Install the standard toolchain:

```bash
opam install dune ocaml-lsp-server odoc ocamlformat utop
```

What each of these gives you:

| Tool               | What it does                                                                          |
| ------------------ | ------------------------------------------------------------------------------------- |
| `dune`             | The build system. Compiles projects, runs tests.                                      |
| `ocaml-lsp-server` | Language server: inline type errors, hover types, go-to-definition in your editor.    |
| `utop`             | A much better interactive toplevel than `ocaml` — history, completion, better errors. |
| `ocamlformat`      | Automatic formatting, so you stop arguing with yourself about layout.                 |
| `odoc`             | Documentation generation. You will not need this in Part IA.                          |

Of these, `ocaml-lsp-server` and `utop` are the two that change your day-to-day experience most.

## Editor setup

For **VS Code**, install the **OCaml Platform** extension. It talks to `ocaml-lsp-server` and gives you types on hover, which is enormously helpful while you are still learning to read OCaml's type errors.

One thing that catches people out: the extension needs to find your opam switch. If it reports that it cannot find the language server, launch your editor from a terminal where `eval $(opam env)` has already run, rather than from the desktop icon.

For **Neovim** or **Emacs**, both have mature OCaml support; point them at `ocaml-lsp-server` through your usual LSP client.

## Using the toplevel

For working through course exercises, `utop` is usually all you need. Start it:

```bash
utop
```

Expressions are terminated with a double semicolon:

```ocaml
# let rec fact n = if n = 0 then 1 else n * fact (n - 1);;
val fact : int -> int = <fun>

# fact 10;;
- : int = 3628800
```

Note what the toplevel prints back: the **inferred type**, `int -> int`. Reading these is a large part of learning OCaml, and the toplevel gives you them for free.

To load a file you have been editing:

```ocaml
# #use "myfile.ml";;
```

The leading `#` is part of the directive, and you type it in addition to the prompt.

## A minimal project with dune

Once exercises grow past a single file, use dune. Create a directory with two files in it.

`dune-project`:

```lisp
(lang dune 3.0)
```

`dune`:

```lisp
(executable
 (name main))
```

Then `main.ml` with your code. Build and run with:

```bash
dune build
dune exec ./main.exe
```

`dune build --watch` rebuilds automatically as you save, which is a pleasant way to work through a problem sheet.

## Errors you will hit early

**`This expression has type int but an expression was expected of type float`** — OCaml does not implicitly convert between numeric types, and the arithmetic operators differ: `+` is for `int`, `+.` is for `float`. This is deliberate, and it stops being annoying surprisingly quickly.

**`This pattern-matching is not exhaustive`** — you have missed a case in a `match`. This is a warning rather than an error, and it is one of the most valuable messages the compiler produces. Do not silence it; it is telling you about a real gap.

**`Unbound value`** — usually a typo, or a function defined after the point where you used it. OCaml processes a file top to bottom, so definitions must precede their uses.

**Forgetting `rec`** — `let f n = ... f (n - 1)` will not compile, because plain `let` does not bring the name into scope in its own body. You want `let rec`.

## Where to go next

- [OCaml documentation](https://ocaml.org/docs) — the official tutorials, well maintained.
- [Real World OCaml](https://dev.realworldocaml.org/) — free online, and much more than you need for Part IA, but excellent once you want to build something real.
- The course's own lecture notes remain the best match for what you are examined on.
