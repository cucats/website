---
title: Interview Preparation
description: What the interview measures, and what a good answer sounds like out loud
---

The interview is a supervision run for forty minutes with someone deciding whether the next three years of them would be productive. Everything about the format follows from that.

## Format

Invitations arrive in November or early December, interviews sit in early to mid-December, and the timing carries no signal. One or two interviews is standard, occasionally more, online or in person by College, with two or three interviewers.

For Computer Science at least one will be mathematical. Some Colleges set a short written exercise beforehand or on the day and will say so. The [official page](https://www.undergraduate.study.cam.ac.uk/applying/interviews) has the current arrangements.

## What is being measured

Your grades already establish that you can answer questions you have been taught. The interview is the only part of the application that observes what you do at the boundary of what you know, which is why the questions are set beyond it.

Being stuck is therefore the working state, not a failure of it. An interview where you answer everything immediately has produced no data.

## Thinking out loud

Silence is unreadable. The interviewer cannot separate productive thought from a stall, and an answer arrived at silently demonstrates less than a wrong turn narrated well.

Small cases first, then a conjecture, then an attempt to justify it. Clarifying questions are evidence of precision, so asking whether the integers are positive or the list is sorted reads as a strength. Hints are offered because progress is wanted, and declining one is the mistake.

Bluffing is visible and is among the few things that count against you. "I have not met that, but I would guess it behaves like…" is a complete answer.

## What a good answer sounds like

**In how many ways can a 2 × n strip be tiled by 2 × 1 dominoes?**

_"Small cases. n = 1 gives 1, n = 2 gives 2, n = 3 gives 3, n = 4 gives 5._

_That is Fibonacci. Let me justify that, since asserting it proves nothing. Condition on the leftmost column. A vertical domino covers it and leaves a 2 × (n−1) strip. Otherwise the column is covered by the left halves of two horizontals, which forces the 2 × 2 block and leaves 2 × (n−2). Those cases are disjoint and exhaustive, so_

$$
T_n = T_{n-1} + T_{n-2}
$$

_with T₁ = 1, T₂ = 2."_

The conjecture came from computation and the justification came from a case split that is visibly exhaustive. Arriving at the recurrence after a hint would have scored the same.

## Preparation

Reread your personal statement, since it is the opening move and anything in it is fair.

Work unfamiliar problems out loud, to a person or to an empty room. The skill being rehearsed is verbalising a partial idea under observation, and it is separate from the mathematics.

A mock interview with anyone who will push back on your reasoning is worth more than more problems. Memorised answers to anticipated questions are transparent once the question is varied.

> [!NOTE]
> The University does not endorse paid interview preparation, and applicants who buy it are not at an advantage.

## Afterwards

Decisions come in late January. Nearly everyone leaves convinced it went badly, including those who receive offers, because the format is calibrated to find your limit and so it feels like you found it.

The Winter Pool means another College is considering you, which is a good outcome and produces a substantial number of offers each year.
