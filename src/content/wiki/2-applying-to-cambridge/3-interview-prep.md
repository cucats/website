---
title: Interview Preparation
description: How to prepare for your Cambridge interview
---

Cambridge interviews have a reputation that does not survive contact with the real thing. They are not designed to humiliate you, there are no trick questions, and nobody is going to ask why a tennis ball is fuzzy. What they are is a short simulation of a supervision — the small-group teaching that the whole degree is built around — and the question being answered is simply _would this person be good to teach?_

## What to expect

Invitations go out in **November or early December**, and interviews are usually held in **early to mid-December**. When your invitation arrives says nothing about how strong your application is. Keep the whole interview period free, since interviews cannot normally be rescheduled.

Most applicants have **one or two interviews**, together lasting somewhere between 35 minutes and an hour, though some subjects and Colleges run three or four. They may be online or in person depending on the College — your invitation will tell you which. You will usually face two or three interviewers.

For Computer Science, expect at least one interview built around **mathematical and problem-solving questions**. Some Colleges also send material in advance, or set a short written exercise on the day, and will tell you beforehand if so. Details are on the [official interviews page](https://www.undergraduate.study.cam.ac.uk/applying/interviews).

## What they are assessing

The official framing is your understanding of the subject area, your readiness to study at a high academic level, your ability to think critically and independently, and your motivation and curiosity.

In practice, interviewers are watching **how you work on a problem you cannot immediately solve**. That is the whole exercise. Your grades already tell them you can answer questions you have been taught; the interview is the only part of the application that shows what you do at the edge of what you know.

This has a direct consequence that is worth stating plainly:

> [!TIP]
> Being stuck is not failure — it is the point. The questions are chosen to be beyond you at first, and an interview where you never get stuck has told your interviewer very little. What matters is what you do next.

## How to actually behave in the room

**Think out loud.** This is the single most important thing, and it is unnatural for most people. Silence is unreadable — the interviewer cannot distinguish productive thought from panic. Narrate: "I'll start with a small case", "I don't think that works, because…", "let me try assuming the opposite".

**Start with small cases.** Almost every problem gets easier if you try it for one, two and three before trying it in general. This is also genuinely how mathematicians and computer scientists work.

**Ask clarifying questions.** Questions are often stated loosely on purpose. Asking whether the numbers are integers, or whether the list is sorted, is a good sign, not a sign of weakness.

**Take hints.** Interviewers give hints because they want you to make progress; accepting one and running with it is exactly the expected behaviour. Ignoring one is a genuine mistake.

**Say when you do not know.** "I haven't met that, but I'd guess it works like…" is a completely acceptable answer, and it is very much better than bluffing. Interviewers detect bluffing instantly and it is one of the few things that actively counts against you.

**Write things down.** Diagrams, tables of small cases, and notation. Use the paper or the shared whiteboard.

## A worked example

Here is a question of the sort that comes up, and — more usefully — what a good response sounds like.

**In how many ways can a 2 × n strip be tiled by 2 × 1 dominoes?**

A weak response guesses a formula. A strong response is a process:

_"Let me try small cases. For n = 1 there's only the vertical domino, so 1 way. For n = 2 I can place two verticals or two horizontals, so 2. For n = 3 I get 3, and for n = 4 I count 5._

_So 1, 2, 3, 5 — that looks like Fibonacci. Let me see whether I can justify it rather than just spotting the pattern. Consider the leftmost column. Either it's covered by a single vertical domino, which leaves a 2 × (n−1) strip, or it's covered by the left halves of two horizontal dominoes, which forces the whole 2 × 2 block and leaves a 2 × (n−2) strip. Those cases are disjoint and cover everything, so_

$$
T_n = T_{n-1} + T_{n-2}
$$

_with T₁ = 1 and T₂ = 2, which is exactly the Fibonacci numbers shifted along."_

Notice what is doing the work there. The candidate found the answer by experiment, then **explained why it must be true** by splitting into cases. Getting to the recurrence with a nudge from the interviewer would have been an equally good outcome.

## Preparing sensibly

**Reread your personal statement.** Interviewers use it as a starting point, so anything in it is fair game. If you named a book or a project, refresh yourself on it.

**Practise mathematics out loud.** Work through unfamiliar problems while explaining yourself to someone else, or to an empty room. It feels ridiculous and it is the most effective preparation there is. TMUA, STEP and Olympiad questions are all good material.

**Get a mock interview if you can** — a teacher, or anyone who will push back on your reasoning. What you are rehearsing is the experience of being questioned, not any particular content.

**Do not try to memorise answers.** Reciting a prepared answer to a question that has been slightly varied is very obvious from the other side of the table.

> [!NOTE]
> The University explicitly does not endorse paid interview preparation services. You do not need to spend money on this, and the applicants who do are not at an advantage.

## On the day

Sleep, arrive early, and take a pen. If it is online, test your camera, microphone and connection beforehand, and sit somewhere quiet where you can write.

You will almost certainly come out convinced it went badly. Nearly everyone does, including people who receive offers — the interview is calibrated to find your limit, so of course it feels like you hit it. That feeling is not evidence.

## Afterwards

Decisions come out in **late January**. Between the interview and then, there is nothing further you can do, so put it down and get on with your A-levels — the offer will be conditional on them.

If you are placed in the Winter Pool, you may be interviewed again by another College in January. This is a good sign rather than a bad one: it means a College thought you were worth passing on, and a substantial number of offers come out of it every year.
