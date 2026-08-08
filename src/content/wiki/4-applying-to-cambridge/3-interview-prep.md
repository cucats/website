---
title: Interview Preparation
description: How to prepare for your Cambridge interview
---

Cambridge interviews have a reputation that does not survive contact with the real thing. They are not designed to humiliate you, there are no trick questions, and nobody will ask why a tennis ball is fuzzy. What happens is a short simulation of a supervision, the small-group teaching the whole degree runs on, and the question being answered is whether you would be good to teach.

## What to expect

Invitations go out in **November or early December**, with interviews usually in **early to mid-December**. When yours arrives says nothing about how strong your application is. Keep the whole period free, since interviews cannot normally be rescheduled.

Most applicants get one or two interviews, together lasting between 35 minutes and an hour, though some subjects and Colleges run three or four. They may be online or in person depending on the College, and your invitation will say which. Expect two or three interviewers.

For Computer Science, at least one interview will be built around mathematical and problem-solving questions. Some Colleges send material in advance or set a short written exercise on the day, and will tell you beforehand. The [official interviews page](https://www.undergraduate.study.cam.ac.uk/applying/interviews) has the details.

## What they are assessing

Officially: your understanding of the subject area, your readiness for high-level study, your ability to think critically and independently, and your motivation and curiosity.

In practice they are watching how you work on a problem you cannot immediately solve. That is the whole exercise. Your grades already show you can answer questions you have been taught, and the interview is the only part of the application that shows what you do at the edge of what you know.

> [!TIP]
> Getting stuck is the point. The questions are chosen to be beyond you at first, and an interview where you sail through has told the interviewer very little. What matters is what you do next.

## How to behave in the room

Think out loud. This is the single most important thing and it feels unnatural to almost everyone. Silence is unreadable, and the interviewer cannot tell productive thought from panic. Narrate: "I'll start with a small case", "I don't think that works, because…", "let me try assuming the opposite".

Start with small cases. Almost every problem opens up if you try it for one, two and three before attempting it in general, and this is genuinely how mathematicians work.

Ask clarifying questions. Questions are often stated loosely on purpose, and asking whether the numbers are integers or whether the list is sorted is a good sign.

Take hints. Interviewers offer them because they want you to make progress. Accepting one and running with it is the expected behaviour, and ignoring one is a genuine mistake.

Say when you do not know. "I haven't met that, but I'd guess it works like…" is a completely acceptable answer. Interviewers spot bluffing immediately, and it is one of the few things that actively counts against you.

Write things down. Diagrams, tables of small cases, notation. Use the paper or the shared whiteboard.

## A worked example

Here is the kind of question that comes up, and more usefully, what a good answer sounds like.

**In how many ways can a 2 × n strip be tiled by 2 × 1 dominoes?**

A weak response guesses a formula. A strong one is a process:

_"Let me try small cases. For n = 1 there's only the vertical domino, so 1 way. For n = 2 I can place two verticals or two horizontals, so 2. For n = 3 I get 3, and for n = 4 I count 5._

_So 1, 2, 3, 5, which looks like Fibonacci. Let me see whether I can justify that. Consider the leftmost column. Either a single vertical domino covers it, leaving a 2 × (n−1) strip, or the left halves of two horizontal dominoes cover it, which forces the whole 2 × 2 block and leaves a 2 × (n−2) strip. Those cases are disjoint and cover everything, so_

$$
T_n = T_{n-1} + T_{n-2}
$$

_with T₁ = 1 and T₂ = 2, which is the Fibonacci numbers shifted along."_

Look at what did the work there. The candidate found the answer by experiment and then explained why it must hold, by splitting into cases. Reaching the recurrence with a nudge from the interviewer would have been just as good an outcome.

## Preparing sensibly

Reread your personal statement, since interviewers use it as a starting point and anything in it is fair game. If you named a book or a project, refresh yourself on it.

Practise mathematics out loud. Work through unfamiliar problems while explaining yourself to someone else, or to an empty room. It feels ridiculous and it is the most effective preparation available. TMUA, STEP and Olympiad questions all work as material.

Get a mock interview if you can, with a teacher or anyone who will push back on your reasoning. You are rehearsing the experience of being questioned, and the particular content matters much less.

Do not memorise answers. Reciting a prepared answer to a question that has been slightly varied is obvious from the other side of the table.

> [!NOTE]
> The University explicitly does not endorse paid interview preparation services. You do not need to spend money on this, and applicants who do are not at an advantage.

## On the day

Sleep, arrive early, take a pen. Online, test your camera, microphone and connection beforehand and find somewhere quiet where you can write.

You will almost certainly come out convinced it went badly. Nearly everyone does, including people who get offers, because the interview is calibrated to find your limit and so it feels like you hit it. That feeling is not evidence.

## Afterwards

Decisions arrive in **late January**. Nothing you do between the interview and then changes anything, so put it down and get on with your A-levels, since the offer will be conditional on them.

If you land in the Winter Pool, another College may interview you in January. This is a good sign: it means a College thought you were worth passing on, and a substantial number of offers come out of it each year.
