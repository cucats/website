---
title: Hosting on the SRCF
description: Putting a project or a society site online with a free Cambridge account
---

The [Student-Run Computing Facility](https://www.srcf.net/) is a volunteer-run society that gives Cambridge students free web hosting, shell accounts, databases, mailing lists and email. It costs nothing, it is run by students, and it is substantially more flexible than most free hosting you could otherwise find.

It is the natural home for a personal site, a project you want a URL for, or a society website that needs to outlive its current committee.

## Getting an account

Sign up at **[control.srcf.net/signup](https://control.srcf.net/signup)** with your Raven credentials. Accounts are free and approved by volunteers, so allow a little time rather than expecting it instantly.

Once you have an account you get a control panel at [control.srcf.net](https://control.srcf.net/), which is where you manage web space, databases, mailing lists and group accounts.

## Where your website lives

Your files live in a `public_html` directory, and anything in it is served straight away.

For a **personal account**, files go in:

```text
/public/home/<crsid>/public_html
```

and appear at `https://<crsid>.user.srcf.net`.

For a **society or group account**, files go in:

```text
/public/societies/<groupname>/public_html
```

and appear at `https://<groupname>.soc.srcf.net`.

That is the whole mechanism for a static site. Put an `index.html` in `public_html` and it is live.

## Getting files there

Connect over SSH:

```bash
ssh <crsid>@shell.srcf.net
```

To copy a built site up from your own machine, `rsync` is the tool worth learning. From the directory containing your built files:

```bash
rsync -avz --delete ./build/ <crsid>@shell.srcf.net:/public/home/<crsid>/public_html/
```

What the flags do: `-a` preserves permissions and recurses, `-v` prints what it is doing, `-z` compresses in transit, and `--delete` removes files on the server that no longer exist locally.

> [!WARNING]
> `--delete` will remove anything in the destination that is not in your source directory. Run the command once without it, or add `--dry-run`, before trusting it against a directory that already has content in it.

Set up an SSH key first — see the [Git Basics](/wiki/tutorials/git-basics) page for how to generate one — so that you are not typing your password on every deploy.

## Society accounts

If you are running a society, a **group account** is what you want rather than hosting the site under your own CRSid. Group accounts have multiple administrators, so the site does not become inaccessible when whoever built it graduates.

Request one through the control panel. When you hand over to the next committee, add their accounts as administrators and remove people who have left — the SRCF documentation has a handover guide covering exactly this.

> [!TIP]
> This is the single most common way society websites die: one person builds it under their personal account, graduates, and nobody can update it. Use a group account from the start.

## Beyond static files

The SRCF also offers databases, and can run web applications rather than just serving files, which covers most of what a society site realistically needs. Membership also includes shell accounts, mailing lists, `@srcf.net` email and hosted chat.

The specifics of deploying an application, requesting a database, or pointing a custom domain at your space are all covered properly in the official documentation, which is kept current in a way this page will not be:

- **[docs.srcf.net](https://docs.srcf.net/)** — the full documentation, including getting-started guides and web hosting reference
- **[srcf.net/services](https://www.srcf.net/services)** — what is on offer
- **support@srcf.net** — a real human will answer

## A note on being a good citizen

The SRCF is run by volunteers and funded by donations, with no obligation to serve you. Do not use it to mine anything, do not run something that will saturate the network, and if you are about to do something unusual, ask first — they are friendly and would much rather have the conversation in advance.

If you get real use out of it, they take donations, and they are worth supporting.
