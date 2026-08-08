---
title: Regular Expressions
description: Understanding regexes, so you can stop copying them off the internet
---

Regular expressions are a small language for describing patterns in text. Nearly everyone's first encounter involves pasting one from a search result and hoping, which works until it stops working and leaves you unable to fix it.

The language really is small. An hour of deliberate learning replaces years of guessing.

## The building blocks

Most characters match themselves, so the pattern `cat` matches the text "cat". The interesting parts are the characters that do something else.

### Character classes

Square brackets mean any one of these:

| Pattern       | Matches                                      |
| ------------- | -------------------------------------------- |
| `[abc]`       | one character: `a`, `b` or `c`               |
| `[a-z]`       | any one lowercase letter                     |
| `[a-zA-Z0-9]` | any one letter or digit                      |
| `[^abc]`      | any one character other than `a`, `b` or `c` |

Shorthands cover the common ones:

| Shorthand      | Means                                           |
| -------------- | ----------------------------------------------- |
| `\d`           | a digit, same as `[0-9]`                        |
| `\w`           | a word character: letter, digit or underscore   |
| `\s`           | whitespace: space, tab, newline                 |
| `\D` `\W` `\S` | the negation of each                            |
| `.`            | any character at all, except newline by default |

### Quantifiers

How many times the preceding thing may repeat:

| Pattern  | Means                |
| -------- | -------------------- |
| `a*`     | zero or more `a`     |
| `a+`     | one or more `a`      |
| `a?`     | zero or one `a`      |
| `a{3}`   | exactly three        |
| `a{2,5}` | between two and five |
| `a{2,}`  | two or more          |

### Anchors

Anchors match a position and not a character, which is why they are easy to forget:

| Pattern | Matches                                             |
| ------- | --------------------------------------------------- |
| `^`     | start of the string, or of a line in multiline mode |
| `$`     | end of the string, or of a line                     |
| `\b`    | a word boundary                                     |

`\b` solves the problem people usually have. Searching for `cat` finds the "cat" inside "concatenate", and searching for `\bcat\b` does not.

### Groups and alternation

Round brackets group and `|` means or:

- `(ab)+` matches "ab", "abab", "ababab"
- `cat|dog` matches either word
- `(cat|dog)s?` matches "cat", "cats", "dog" or "dogs"

Groups also capture, so the text they matched can be pulled out afterwards, which is how you extract fields from a line and do more than test it. For grouping with no capture, use `(?: ... )`.

## Greedy and lazy

Here is the most common source of regexes that nearly work. Quantifiers are greedy by default and match as much as they possibly can.

Against the text `<b>bold</b>`, the pattern `<.+>` matches the entire string, since `.+` swallows everything up to the last `>` it can find. Adding `?` makes a quantifier lazy, matching as little as possible, so `<.+?>` matches just `<b>`.

When a regex captures far more than you intended, this is almost always why.

## Putting it together

A pattern for a simple email-shaped string:

```text
^[\w.+-]+@[\w-]+\.[\w.]+$
```

Left to right: start of string, one or more word characters or `.` `+` `-`, an `@`, one or more word characters or hyphens, a literal dot escaped because a bare `.` means any character, then one or more word or dot characters, then end of string.

A UK-style date with either separator, capturing the parts:

```text
^(\d{2})[/-](\d{2})[/-](\d{4})$
```

Inside a character class, a `-` at the end is a literal hyphen and not a range.

## Using them

On the command line, `grep -E` uses extended regex syntax, which is the one worth learning:

```bash
grep -E '^[0-9]+' data.txt
rg '\bTODO\b' src/
```

`ripgrep` is faster and has better defaults where it is available.

In Python:

```python
import re

m = re.search(r"(\d{2})/(\d{2})/(\d{4})", "date: 05/11/2025")
if m:
    day, month, year = m.groups()

re.findall(r"\b\w+@\w+\.\w+\b", text)
re.sub(r"\s+", " ", messy)          # collapse whitespace
```

Always use raw strings for patterns, or you fight two levels of backslash escaping at once.

In JavaScript:

```javascript
const m = "date: 05/11/2025".match(/(\d{2})\/(\d{2})\/(\d{4})/);
const cleaned = messy.replace(/\s+/g, " ");
```

The `g` flag replaces every occurrence, where leaving it off stops at the first.

## When to use something else

Regexes match regular languages. Anything with arbitrary nesting, so HTML, JSON, source code or matched brackets, is not regular, and no regex handles it correctly in general. You can get close enough to be dangerous, which is worse than failing outright.

Use a parser for structured formats. One exists for whatever you are dealing with.

> [!WARNING]
> Some patterns backtrack catastrophically. `(a+)+$` against a long string of `a` characters can take exponential time, which is a real denial-of-service vector when a regex is applied to user input. Treat nested quantifiers with suspicion, and think hard before applying a user-supplied regex to your own data.

## Working them out

Build patterns incrementally. Start with something matching too much and then constrain it, since writing the whole pattern in one go and debugging it afterwards is much harder.

Use [regex101.com](https://regex101.com/). It explains each part of your pattern, highlights matches live and shows the backtracking count. It will teach you more in twenty minutes than this page will.

Comment complicated patterns. Most languages have a verbose mode allowing whitespace and comments inside a pattern, and a regex you cannot read in three months is a liability.

## Further reading

- [Python `re` documentation](https://docs.python.org/3/library/re.html), a good reference whatever language you use
- [MDN's regular expressions guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
- Part IB Formal Models of Language, which covers what regular languages are and why the nesting limitation above is a theorem
