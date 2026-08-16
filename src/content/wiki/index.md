---
title: CUCaTS Wiki
description: Guides, resources and tutorials from the Cambridge University Computing and Technology Society
---

This wiki collects things CUCaTS members have written down so that we stop answering the same questions every October.

Some of it is about the society: what we run, who funds it, how to get involved. Some of it is for people applying to Cambridge. The largest section is a set of tutorials on tools and topics that keep coming up, written by students who had to work them out.

## The sections

[Getting Started](/wiki/getting-started) covers joining the society and getting funding for an event of your own.

[Events](/wiki/events) has a page on each of our three main events, with detail that does not fit on a poster.

[Sponsors](/wiki/sponsors) describes the firms that pay for all this and what they offer students.

[Applying to Cambridge](/wiki/applying-to-cambridge) is for prospective applicants: the TMUA, the personal statement questions, and what interviews are like.

[Tutorials](/wiki/tutorials) is the practical section, from Git and the command line through to concurrency and reading papers.

[Resources](/wiki/resources) points at course material, computing facilities and careers help.

## How much to trust it

> [!WARNING]
> Students write and maintain this wiki. It carries no official standing, and the admissions pages in particular describe requirements that change from cycle to cycle. Check anything that matters against the [official Cambridge undergraduate site](https://www.undergraduate.study.cam.ac.uk/) and your College.

Where a page makes a factual claim about admissions it links to the source it came from. Fix anything you find out of date.

## Writing a page

Pages are Markdown files in the [website repository](https://github.com/cucats/website) under `src/content/wiki`. Adding one means adding a file.

Every page needs frontmatter with a title and a description:

```markdown
---
title: Your Page Title
description: One sentence, shown on navigation cards and in search
---

Your content starts here.
```

Conventions worth knowing before you start:

- Begin the body at `##`. The frontmatter title is rendered as the `h1`, and each `h2` becomes an entry in the "On this page" contents.
- A folder with an `index.md` becomes a section, and the other files in it become its children.
- Number prefixes set the order. `02-testing.md` sorts after `01-git-basics.md`, and the number is stripped from the URL, so the page still lives at `/wiki/tutorials/testing`. Use two digits, since `10-` sorts before `9-`.
- Callouts are blockquotes starting with `[!NOTE]`, `[!TIP]` or `[!WARNING]`.
- Maths goes between dollar signs. Dollar signs inside code blocks are left alone, so shell and LaTeX samples need no escaping. [Math Example](/wiki/tutorials/math-example) has the details.

Run `bun run dev` to preview, and `bun run format` before you commit.
