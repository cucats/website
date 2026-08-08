---
title: The OCaml Toolchain
description: Switches, dune profiles, and the build settings that change generated code
---

Getting a working toolchain is the first ten minutes. This page is about the parts of opam and dune whose defaults you will eventually want to change. The runtime that this produces is covered in [OCaml Internals](/wiki/tutorials/ocaml-internals).

## opam and switches

opam is a source-based package manager, so a switch is a compiler plus a package universe built against it. Local switches, created with `opam switch create . <version>`, put the whole environment under the project directory and pin it in `.opam-switch`, which is what stops one project's dependency bound from constraining another.

The solver is a real dependency solver over version constraints, and `opam install --dry-run` shows what it intends before it starts compiling. Where a solution does not exist, `--unlock-base` and explicit version constraints on the conflicting package narrow the search faster than reading the whole conflict report.

Compiler variants are selected the same way as packages. `ocaml-variants.5.1.0+options` with `ocaml-option-flambda` gives an optimising build; the address and thread sanitiser variants and the statically linked ones are all in the same namespace.

Pinning to a git URL with `opam pin` is how you develop against an unreleased dependency, and pins are recorded per switch, so a pin in a local switch is contained.

```bash
opam switch create . 5.2.0 --deps-only
eval $(opam env)
opam install dune ocaml-lsp-server ocamlformat utop odoc
```

## dune

`dune-project` sets the language version, which controls defaults as well as syntax, so bumping it changes behaviour. Stanzas in `dune` files describe targets, and the build is a sandboxed dependency graph, which is why a rule that reads a file it did not declare works locally and fails in CI.

Profiles are the setting that matters most. `--profile dev` builds with debug information and without cross-module optimisation; `--profile release` turns on `-O3` under flambda and enables cross-module inlining. Benchmarking a dev build measures a program that will not ship.

Per-target flags go in `ocamlopt_flags`, and the ones worth knowing are `-unboxed-types` where available, `-inline` for the non-flambda inliner, and `-unsafe` to drop bounds checks, which is a decision about your invariants and not a free speedup.

`dune build @all` builds everything including targets not reachable from the default alias, `@runtest` runs the tests, and `dune build --watch` gives an incremental loop. `dune exec --profile release ./bench.exe` is the combination people forget.

## Looking at what the compiler produced

`-dlambda` shows the untyped intermediate form after pattern-match compilation, which is where you confirm a match compiled to a jump table. `-dcmm` shows the form where tagging and allocation are explicit, and it is the fastest way to settle whether an expression allocates. `-S` keeps the assembly.

`ocamlopt -dtypedtree` and `-drawlambda` cover the earlier stages when a type-directed transformation is in question.

`landmarks` and `perf` both work on native binaries, and the `Gc` module's counters distinguish minor allocation from promotion, which is usually the number you actually want.

## Editors and formatting

`ocaml-lsp-server` provides the language server, and it resolves the switch from the environment, so an editor launched outside `opam env` reports a missing server. Merlin's configuration comes from dune directly, so there is nothing to maintain by hand in a dune project.

`ocamlformat` requires a `.ocamlformat` file to activate, and pinning its version there is deliberate, since output differs between releases and an unpinned formatter produces diff noise across a team.

## Reading

- [opam documentation](https://opam.ocaml.org/doc/Manual.html) for switch and pin semantics
- [dune documentation](https://dune.readthedocs.io/) for the stanza reference
- [OCaml Internals](/wiki/tutorials/ocaml-internals) for what the generated code is doing
