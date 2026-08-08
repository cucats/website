---
title: Hosting on the SRCF
description: Putting a project or a society site online with a free Cambridge account
---

The [Student-Run Computing Facility](https://www.srcf.net/) is a volunteer-run society giving Cambridge students free web hosting, shell accounts, databases, mailing lists and email. It costs nothing, students run it, and it is far more flexible than most free hosting you could otherwise find.

It suits a personal site, a project that wants a URL, or a society website that needs to outlive its current committee.

## Getting an account

Sign up at [control.srcf.net/signup](https://control.srcf.net/signup) with your Raven credentials. Accounts are free and volunteers approve them, so allow a little time.

Once you have one, [control.srcf.net](https://control.srcf.net/) is where you manage web space, databases, mailing lists and group accounts.

## Where your website lives

Files go in a `public_html` directory and anything in it gets served straight away.

For a personal account:

```text
/public/home/<crsid>/public_html
```

which appears at `https://<crsid>.user.srcf.net`.

For a society or group account:

```text
/public/societies/<groupname>/public_html
```

which appears at `https://<groupname>.soc.srcf.net`.

That is the whole mechanism for a static site. Put an `index.html` in `public_html` and it is live.

## Getting files there

Connect over SSH:

```bash
ssh <crsid>@shell.srcf.net
```

For copying a built site up from your own machine, `rsync` is the tool to learn. From the directory holding your built files:

```bash
rsync -avz --delete ./build/ <crsid>@shell.srcf.net:/public/home/<crsid>/public_html/
```

The flags: `-a` preserves permissions and recurses, `-v` prints what it is doing, `-z` compresses in transit, and `--delete` removes files on the server that no longer exist locally.

> [!WARNING]
> `--delete` removes anything in the destination missing from your source directory. Run it once without that flag, or add `--dry-run`, before pointing it at a directory that already has content in it.

Set up an SSH key first, which [Git Basics](/wiki/tutorials/git-basics) covers, so you stop typing a password on every deploy.

## Society accounts

Running a society means you want a group account, over hosting the site under your own CRSid. Group accounts take multiple administrators, so the site stays reachable when whoever built it graduates.

Request one through the control panel. When you hand over to the next committee, add their accounts as administrators and remove people who have left. The SRCF documentation has a handover guide covering exactly this.

> [!TIP]
> This is how society websites usually die: one person builds it under their personal account, graduates, and nobody can update it. Use a group account from the start.

## Beyond static files

The SRCF also offers databases and can run web applications, which covers most of what a society site realistically needs. Membership includes shell accounts, mailing lists, `@srcf.net` email and hosted chat.

Deploying an application, requesting a database and pointing a custom domain at your space are all covered properly in the official documentation, which stays current in a way this page will not:

- [docs.srcf.net](https://docs.srcf.net/) for the full documentation, including getting-started guides and the web hosting reference
- [srcf.net/services](https://www.srcf.net/services) for what is on offer
- support@srcf.net, where a real person will answer

## Being a good citizen

Volunteers run the SRCF on donations, with no obligation to serve you. Mine nothing, saturate nothing, and ask first if you are about to do something unusual, because they are friendly and would much rather have the conversation in advance.

If you get real use out of it, they take donations and are worth supporting.
