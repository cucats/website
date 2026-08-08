---
title: Reading Research Papers
description: Getting through a paper without bouncing off the first page
---

The first research paper most people read is a bruising experience. You start at the top, hit unfamiliar notation in the third paragraph, reread it four times and give up around page two feeling stupid.

That is a problem with the strategy. Papers are written to be scanned by people who already know the field, so they can decide quickly whether to read properly. Read one the way it was written to be read and it gets much easier.

You will want this for a Part II project, for a dissertation, and any time you want to know how something works beyond what a blog post says about it.

## Read it three times

Keshav's three-pass method is the standard approach, and it works because most papers do not deserve a full read.

The first pass takes five minutes: title, abstract, introduction, section headings, conclusion, and a look at the figures. Skip everything else. You are answering one question, which is whether this deserves more of your time. Note what kind of paper it is, what it claims, and whether the claim is relevant to you. Most papers should be discarded here, and discarding them is the method working.

The second pass takes an hour. Read the whole thing while ignoring proofs and fine implementation detail. Look carefully at figures, graphs and tables: are the axes labelled, is the baseline fair, what is the sample size? Afterwards you should be able to summarise the argument to somebody else, and for most papers this is where you stop.

The third pass takes several hours and reconstructs the work. Follow the derivations, question every assumption, ask what you would have done differently. Reserve it for papers you need to build on, implement or defend, which is a handful a year.

> [!TIP]
> Stopping after the first pass is the skill. Beginners read every paper they open in full and get through four. Researchers triage dozens and read three properly.

## What each section is for

Papers follow a predictable structure you can exploit:

| Section      | What it is really for                                                              |
| ------------ | ---------------------------------------------------------------------------------- |
| Abstract     | The whole argument in 200 words. Read twice; it is the densest text in the paper   |
| Introduction | The problem, why it matters, what this paper adds. Usually the most readable part  |
| Related work | A map of the field, and invaluable when you are new. Mine it for what to read next |
| Method       | What they actually did, and the part you reconstruct on a third pass               |
| Evaluation   | Whether it worked. Read the most sceptically                                       |
| Conclusion   | The claims restated, plus limitations, and often the most honest section           |

A shortcut worth knowing: read the abstract, then the introduction, then jump to the figures and their captions. Good papers make the central result visible in one figure, and captions are usually self-contained.

## Reading the evaluation properly

A critical reader earns their keep here, since this is where papers oversell.

Ask what the baseline is, because beating a weak or badly-tuned comparison means little; check whether it is the actual state of the art. Ask what is missing, since four datasets and a conspicuously absent fifth is a question worth raising. Check whether the axes start at zero, because truncated axes make small differences look enormous. Ask whether the improvement is meaningful, since a 0.3% gain with no error bars on one run is noise. And read the limitations section carefully, because it is where authors admit what the abstract glossed over.

Scepticism here is not cynicism. Published, peer-reviewed papers are usually honest, and "honest" and "the result generalises to your problem" are separate claims.

## When the maths defeats you

It will, and that is normal.

Keep going, since notation is often explained after it is introduced and later context makes an earlier line obvious. Work a concrete example, because substituting small numbers into an equation frequently collapses abstract notation into something simple. Read the sentence either side, since authors usually state in prose what the equation says formally, and that prose is often all you need.

Look for a survey or a lecture course covering the same ground more slowly; a textbook chapter is written to teach and a paper is not. And accept a black box where you can, since understanding what a lemma is for without following its proof is often enough for your purposes.

## Taking notes that survive

You will forget almost everything about a paper within a month unless you write something down. Keep it to a few sentences in your own words:

- What problem it solves
- The core idea, in one sentence
- What it assumes, and where it would break
- Why you cared enough to read it

The one-sentence core idea is the valuable part. Compressing it is what proves you understood, and it is what you will search for later.

## Finding papers worth reading

- [Google Scholar](https://scholar.google.com/) has the broadest search, and "Cited by" is the key feature, since it finds newer work building on a paper and takes you from a classic to the current state.
- [arXiv](https://arxiv.org/) carries free preprints, particularly in machine learning and theory, most of which have not been peer reviewed.
- [DBLP](https://dblp.org/) is a comprehensive computer science bibliography, best for everything by one author or in one venue.
- [Semantic Scholar](https://www.semanticscholar.org/) is good for following citation graphs.

Cambridge's library subscriptions cover most paywalled venues, so go through the University and stop hitting paywalls unnecessarily.

Two heuristics. Prefer strong venues, and note that in computer science the top conferences carry more weight than journals, which surprises people coming from other sciences. And starting in an unfamiliar area, find a survey first, since it summarises twenty papers and tells you which five you need.

## Where to go next

Reading well compounds, and volume is the only way to build it. Start with a paper you have a real reason to read, behind a tool you use or relevant to a project, over one you feel you ought to have read.

- [How to Read a Paper](https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf) by S. Keshav runs to three pages and is the source of the method above. Worth reading before your next paper.
