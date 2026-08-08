---
title: Reading Research Papers
description: Getting through a paper without bouncing off the first page
---

The first research paper most people read is a bruising experience. You start at the top, hit unfamiliar notation in the third paragraph, reread it four times, and give up around page two feeling stupid.

The problem is the strategy, not you. Papers are not written to be read linearly by newcomers — they are written to be _scanned_ by people who already know the field, so that they can decide quickly whether to read properly. Read them the way they were written to be read and they get much easier.

You will need this for a Part II project, for a dissertation, and any time you want to know how something actually works rather than what a blog post says about it.

## Read it three times

The standard approach is Keshav's three-pass method, and it works because most papers do not deserve a full read.

**First pass — five minutes.** Read the title, abstract, introduction, section headings, and conclusion. Look at the figures. Skip everything else.

You are answering one question: _is this worth more of my time?_ Also note what kind of paper it is, what it claims, and whether the claim is relevant to you. Most papers should be discarded here, and discarding them is a success rather than a failure.

**Second pass — an hour.** Read the whole thing, but ignore proofs and fine implementation detail. Look carefully at figures, graphs and tables: are the axes labelled, is the baseline fair, what is the sample size?

After this pass you should be able to summarise the paper's argument to somebody else. For most papers you read, this is where you stop, and that is fine.

**Third pass — several hours.** Reconstruct the work. Follow the derivations, question every assumption, and ask what you would have done differently. You do this only for papers you need to build on, implement, or defend — a handful a year, not a hundred.

> [!TIP]
> Deciding to stop after the first pass is the skill. Beginners read every paper they open in full and get through four. Researchers triage dozens and read three properly.

## What each section is for

Papers follow a predictable structure, which you can exploit:

| Section      | What it is really for                                                                  |
| ------------ | -------------------------------------------------------------------------------------- |
| Abstract     | The whole argument in 200 words. Read twice; it is the densest text in the paper.      |
| Introduction | The problem, why it matters, and what this paper adds. Usually the most readable part. |
| Related work | A map of the field. Invaluable when you are new — mine it for what to read next.       |
| Method       | What they actually did. The part you reconstruct on a third pass.                      |
| Evaluation   | Whether it worked. Read the most sceptically.                                          |
| Conclusion   | The claims restated, plus limitations — often the most honest section.                 |

A useful shortcut: read the abstract, then the introduction, then jump straight to the **figures and their captions**. Good papers make their central result visible in one figure, and captions are usually self-contained.

## Reading the evaluation properly

This is where a critical reader earns their keep, because this is where papers oversell.

- **What is the baseline?** Beating a weak or badly-tuned comparison means little. Is the comparison the actual state of the art, or a convenient straw man?
- **What is missing?** If a paper reports results on four datasets and the fifth obvious one is absent, ask why.
- **Do the axes start at zero?** Truncated axes make small differences look enormous. Check every graph.
- **Is the improvement meaningful?** A 0.3% gain with no error bars, on one run, is noise.
- **What do the limitations say?** Read this section carefully; it is where authors admit what the abstract glossed over.

Being sceptical is not being cynical. Published, peer-reviewed papers are usually honest — but "honest" and "the result generalises to your problem" are different claims.

## When the maths defeats you

It will, and that is normal. Some tactics:

- **Keep going.** Notation is often explained after it is introduced, and later context can make an earlier line obvious. Do not stall on line one.
- **Work a concrete example.** Substitute small numbers into the equation. Abstract notation frequently collapses into something simple.
- **Read the sentence before and after.** Authors usually state in prose what the equation says formally. That prose is often all you need.
- **Look for a survey or a lecture course** covering the same ground more slowly. A textbook chapter is written to teach; a paper is not.
- **Accept a black box.** You can understand what a lemma is _for_ without following its proof, and that is often sufficient for your purposes.

## Taking notes that survive

You will forget almost everything about a paper within a month unless you write something down. Keep it short — a few sentences per paper, in your own words:

- What problem it solves
- The core idea, in one sentence
- What it assumes, and where it would break
- Why you cared enough to read it

The one-sentence core idea is the valuable part. Being forced to compress it is what proves you understood, and it is what you will actually search later.

## Finding papers worth reading

- **[Google Scholar](https://scholar.google.com/)** — the broadest search. "Cited by" is the key feature: it finds newer work building on a paper, which is how you get from a classic to the current state.
- **[arXiv](https://arxiv.org/)** — free preprints, particularly in machine learning and theory. Note that most arXiv preprints are not peer reviewed.
- **[DBLP](https://dblp.org/)** — comprehensive computer science bibliography, best for finding everything by an author or in a venue.
- **[Semantic Scholar](https://www.semanticscholar.org/)** — good for following citation graphs.

Cambridge's library subscriptions cover most paywalled venues; access them through the University so you do not hit paywalls unnecessarily.

**Two practical heuristics.** Prefer papers from strong venues — in computer science the top conferences matter more than journals, unlike most sciences. And when starting in an unfamiliar area, find a **survey paper** first: it will summarise twenty papers and tell you which five you actually need.

## Where to go next

Reading properly is a skill that compounds, and the only way to build it is volume. Start with a paper you have a genuine reason to read — one behind a tool you use, or relevant to a project — rather than one you feel you ought to have read.

- [How to Read a Paper](https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf) by S. Keshav — three pages, and the source of the method above. Worth reading before your next paper.
