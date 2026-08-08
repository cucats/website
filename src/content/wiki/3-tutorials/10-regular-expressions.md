---
title: Regular Expressions
description: Understanding regexes rather than copying them off the internet
---

Regular expressions are a small language for describing patterns in text. Nearly everyone's first encounter is pasting one from a search result and hoping, which works until it doesn't and leaves you unable to fix it.

The language is genuinely small. An hour of deliberate learning replaces years of guessing.

## The building blocks

Most characters match themselves: the pattern `cat` matches the text "cat". The interesting parts are the characters that don't.

### Character classes

Square brackets mean "any one of these":

| Pattern       | Matches                                         |
| ------------- | ----------------------------------------------- |
| `[abc]`       | one character: `a`, `b` or `c`                  |
| `[a-z]`       | any one lowercase letter                        |
| `[a-zA-Z0-9]` | any one letter or digit                         |
| `[^abc]`      | any one character that is _not_ `a`, `b` or `c` |

There are shorthands for the common ones:

| Shorthand      | Means                                             |
| -------------- | ------------------------------------------------- |
| `\d`           | a digit, same as `[0-9]`                          |
| `\w`           | a word character: letter, digit or underscore     |
| `\s`           | whitespace: space, tab, newline                   |
| `\D` `\W` `\S` | the negation of each                              |
| `.`            | any character at all (except newline, by default) |

### Quantifiers

These say how many times the preceding thing may repeat:

| Pattern  | Means                |
| -------- | -------------------- |
| `a*`     | zero or more `a`     |
| `a+`     | one or more `a`      |
| `a?`     | zero or one `a`      |
| `a{3}`   | exactly three        |
| `a{2,5}` | between two and five |
| `a{2,}`  | two or more          |

### Anchors

Anchors match a position rather than a character, which is why they are easy to forget:

| Pattern | Matches                                             |
| ------- | --------------------------------------------------- |
| `^`     | start of the string, or of a line in multiline mode |
| `$`     | end of the string, or of a line                     |
| `\b`    | a word boundary                                     |

`\b` is the one that solves the problem people usually have. Searching for `cat` finds the "cat" inside "concatenate"; searching for `\bcat\b` does not.

### Groups and alternation

Round brackets group, and `|` means "or":

- `(ab)+` matches "ab", "abab", "ababab"
- `cat|dog` matches either word
- `(cat|dog)s?` matches "cat", "cats", "dog" or "dogs"

Groups also **capture** — the text they matched can be extracted afterwards, which is how you pull fields out of a line rather than merely testing it. If you want grouping without capturing, use `(?: ... )`.

## Greedy and lazy

This is the single most common source of regexes that "nearly work". Quantifiers are **greedy** by default: they match as much as they possibly can.

Against the text `<b>bold</b>`, the pattern `<.+>` matches the _entire_ string, not just `<b>`. The `.+` swallows everything to the last `>` it can find.

Adding `?` makes a quantifier **lazy**, matching as little as possible: `<.+?>` matches just `<b>`.

When a regex is capturing far more than you intended, this is almost always why.

## Putting it together

A pattern for a simple email-shaped string:

```text
^[\w.+-]+@[\w-]+\.[\w.]+$
```

Read it left to right: start of string, one or more word characters or `.` `+` `-`, an `@`, one or more word characters or hyphens, a literal dot (escaped, because a bare `.` means any character), then one or more word or dot characters, then end of string.

A pattern for a UK-style date with either separator, capturing the parts:

```text
^(\d{2})[/-](\d{2})[/-](\d{4})$
```

Note that inside a character class, `-` at the end is a literal hyphen rather than a range.

## Using them

**On the command line**, `grep -E` uses extended regex syntax, which is the one worth learning:

```bash
grep -E '^[0-9]+' data.txt
rg '\bTODO\b' src/
```

`ripgrep` (`rg`) is faster and has better defaults if it is available.

**In Python:**

```python
import re

m = re.search(r"(\d{2})/(\d{2})/(\d{4})", "date: 05/11/2025")
if m:
    day, month, year = m.groups()

re.findall(r"\b\w+@\w+\.\w+\b", text)
re.sub(r"\s+", " ", messy)          # collapse whitespace
```

Always use raw strings (`r"..."`) for patterns, or you will be fighting two levels of backslash escaping at once.

**In JavaScript:**

```javascript
const m = "date: 05/11/2025".match(/(\d{2})\/(\d{2})\/(\d{4})/);
const cleaned = messy.replace(/\s+/g, " ");
```

The `g` flag means replace all occurrences rather than only the first.

## When not to use a regex

Regexes match _regular_ languages. Anything requiring arbitrary nesting — HTML, JSON, source code, matched brackets — is not regular, and no regex handles it correctly in general. You can get close enough to be dangerous, which is worse than failing outright.

Use a parser for structured formats. There is one for whatever you are dealing with.

> [!WARNING]
> Some patterns backtrack catastrophically. A pattern like `(a+)+$` against a long string of `a` characters can take exponential time, and this is a real denial-of-service vector when a regex is applied to user input. Be suspicious of nested quantifiers, and never apply a user-supplied regex to your own data without thought.

## Working them out

**Build patterns incrementally.** Start with something that matches too much, then constrain it. Trying to write the whole pattern in one go and debug it afterwards is much harder.

**Use [regex101.com](https://regex101.com/).** It explains each part of your pattern, highlights matches live, and shows the backtracking count. It is the single best tool for learning this, and it will teach you more in twenty minutes than this page will.

**Comment complicated patterns.** Most languages have a verbose or extended mode that allows whitespace and comments inside a pattern. A regex you cannot read in three months is a liability.

## Further reading

- [Python `re` documentation](https://docs.python.org/3/library/re.html) — a good reference regardless of language
- [MDN's regular expressions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
- Part IB Formal Models of Language covers what regular languages actually are, and why the nesting limitation above is a theorem rather than an implementation detail.
