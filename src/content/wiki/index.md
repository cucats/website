---
title: CUCaTS Wiki
description: Guides, resources and tutorials from the Cambridge University Computing and Technology Society
---

Welcome to the CUCaTS wiki — a growing collection of guides written by members of the Cambridge University Computing and Technology Society.

The wiki exists because the same questions come round every year. How do I actually get involved with the society? What happens in a Cambridge interview? Which resources are worth using for a first-year course? Rather than answering those one Discord message at a time, we write the answers down here.

## What's in here

**[Getting Started](/wiki/getting-started)** is about the society itself: how to join, what we run, and how to get funding and support for an event of your own.

**[Applying to Cambridge](/wiki/applying-to-cambridge)** is for prospective students. It covers the shape of a Computer Science application, the TMUA, the personal statement questions, and what interviews are actually like.

**[Tutorials](/wiki/tutorials)** collects practical, hands-on guides on computing topics.

**[Resources](/wiki/resources)** is a signposting page: course material, computing facilities, competitive programming, and careers.

## A note on accuracy

> [!WARNING]
> This wiki is written and maintained by students, not by the University. It is not an official admissions resource. Entry requirements, admissions tests and deadlines change from one cycle to the next, so always confirm the details against the [official Cambridge undergraduate study site](https://www.undergraduate.study.cam.ac.uk/) and your College before relying on them.

Where a page makes a factual claim about admissions, it links to the official source. If you spot something out of date, please fix it.

## Contributing

Every page here is plain Markdown living in the [website repository](https://github.com/cucats/website) under `src/content/wiki`. Adding a page means adding a file — there is no database and no CMS.

A page needs frontmatter with a `title` and a `description`:

```markdown
---
title: Your Page Title
description: One sentence that shows up on navigation cards and in search
---

Your content starts here.
```

A few conventions worth knowing:

- **Start at `##`.** The page title from the frontmatter is rendered as the `h1`, and every `h2` becomes an entry in the "On this page" table of contents.
- **Directories become sections.** A folder with an `index.md` becomes a section, and the other files in it become its child pages.
- **Number prefixes control order.** A file or folder named `2-admissions-test.md` sorts after `1-personal-statement.md`, but the number is stripped from the URL, so the page still lives at `/wiki/applying-to-cambridge/admissions-test`. This also drives the previous/next links at the foot of each page.
- **Callouts** are written as blockquotes beginning with `[!NOTE]`, `[!TIP]` or `[!WARNING]`.
- **Maths** is written with LaTeX between dollar signs. See [Math Example](/wiki/tutorials/math-example) for the details and one caveat.

Run `bun run dev` to preview your changes locally, and `bun run format` before committing.
