---
title: Java Basics
description: Java for people arriving from Python, OCaml or nothing at all
---

Part IA Object-Oriented Programming is taught in Java, usually alongside Foundations of Computer Science in OCaml. Meeting a strict, verbose, class-based language in the same term as a terse functional one is disorienting, and most of the early friction is Java insisting on things other languages let you leave implicit.

This page is about getting over that friction. The object-oriented ideas themselves are what the course is for.

## Everything lives in a class

There is no top-level code. The smallest complete program is:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```

The file must be called `Hello.java`, matching the public class name — this is enforced, not a convention. Compile and run with:

```bash
javac Hello.java
java Hello
```

Modern JDKs will also run a single file directly with `java Hello.java`, which is convenient while experimenting.

`static` means the method belongs to the class rather than to any particular object, which is why `main` can run before any object exists. This distinction between **static** and **instance** members trips people up early: an instance method can use the object's fields, a static one cannot, because there is no object.

## Types are declared and checked

Every variable has a type, fixed when you declare it:

```java
int count = 0;
double average = 4.5;
boolean done = false;
String name = "Ada";
```

Java distinguishes **primitives** (`int`, `double`, `boolean`, `char`, `long`) from **objects** (everything else, including `String`). Primitives are not objects and cannot be null; each has a wrapper class (`Integer`, `Double`) used where an object is required, with automatic conversion between them.

`var` lets the compiler infer a local variable's type, which cuts some of the verbosity without losing any static checking:

```java
var names = new ArrayList<String>();
```

## Classes and objects

A class bundles data with the operations on it:

```java
public class Point {
    private final double x, y;

    public Point(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double distanceTo(Point other) {
        double dx = x - other.x;
        double dy = y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
```

Used as:

```java
Point a = new Point(0, 0);
Point b = new Point(3, 4);
System.out.println(a.distanceTo(b));   // 5.0
```

Three things worth noticing:

- **`private`** means the field is inaccessible from outside the class. This is encapsulation, and the course cares about it a great deal — the point is that you can change the internals later without breaking anyone who uses the class.
- **`final`** means the field cannot be reassigned after construction. Prefer it by default; immutable objects cause dramatically fewer bugs.
- **`this.x = x`** distinguishes the field from the constructor parameter that shadows it.

## Inheritance and interfaces

A class can **extend** another, inheriting its behaviour and overriding parts of it:

```java
public class Animal {
    public String speak() {
        return "...";
    }
}

public class Dog extends Animal {
    @Override
    public String speak() {
        return "Woof";
    }
}
```

An **interface** specifies what a type can do without saying how:

```java
public interface Shape {
    double area();
}

public class Circle implements Shape {
    private final double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}
```

A class extends at most one class but may implement any number of interfaces. This is why interfaces are usually the better tool: they describe a capability, and a type can have many capabilities.

**Polymorphism** is the payoff. Code written against `Shape` works for every implementation, including ones written later:

```java
List<Shape> shapes = List.of(new Circle(1), new Circle(2));
double total = 0;
for (Shape s : shapes) {
    total += s.area();       // calls the right area() for each object
}
```

> [!TIP]
> Always write `@Override` when overriding. It is optional, but it makes the compiler check that you really are overriding something — catching the case where a typo in the method name silently creates a new method instead.

## Collections and generics

The angle brackets specify what a collection holds, checked at compile time:

```java
List<String> names = new ArrayList<>();
names.add("Ada");
names.add("Grace");

Map<String, Integer> counts = new HashMap<>();
counts.put("apples", 3);
int n = counts.getOrDefault("pears", 0);

Set<Integer> seen = new HashSet<>();
seen.add(42);

for (String name : names) {
    System.out.println(name);
}
```

Note the pattern `List<String> names = new ArrayList<>()` — the variable's type is the **interface**, the object is a concrete **implementation**. Doing it this way means swapping `ArrayList` for `LinkedList` later changes exactly one line.

## The traps

**`==` does not compare values for objects.** It compares references — whether two names point at the same object. Use `.equals()`:

```java
String a = "hello";
String b = "hel" + "lo";
a == b;        // unreliable, depends on interning
a.equals(b);   // true, and correct
```

This is the single most common Java bug for beginners, made worse because `==` happens to work for small integers and interned strings, so it appears to work until it doesn't.

**If you override `equals`, override `hashCode` too.** The contract is that equal objects must have equal hash codes. Break it and your objects will behave bizarrely in a `HashMap` or `HashSet` — you will insert one and fail to find it.

**`null` is not an object.** Calling a method on it throws `NullPointerException`, the most common runtime failure in Java. Avoid returning `null` where you can return an empty collection or an `Optional`.

**Checked exceptions must be handled.** If a method declares `throws IOException`, callers must either catch it or declare it themselves:

```java
try {
    var content = Files.readString(Path.of("data.txt"));
} catch (IOException e) {
    System.err.println("Could not read file: " + e.getMessage());
}
```

Never write an empty catch block. Swallowing an exception converts a clear failure into a mysterious one later.

**Arrays are fixed-length.** `int[] a = new int[10]` cannot grow. Use `ArrayList` when the size varies.

## If you are coming from Python

| Python                     | Java                                                 |
| -------------------------- | ---------------------------------------------------- |
| Indentation defines blocks | Braces define blocks; indentation is cosmetic        |
| Types are dynamic          | Types are declared and checked at compile time       |
| `list`, `dict`, `set`      | `List`, `Map`, `Set` with an explicit implementation |
| `len(xs)`                  | `xs.size()`, or `xs.length` for arrays               |
| `str(x)`                   | `x.toString()` or `String.valueOf(x)`                |
| `x == y` compares values   | `x.equals(y)` compares values                        |
| `None`                     | `null`                                               |
| Functions can stand alone  | Everything is a method on a class                    |

The verbosity is the point rather than an accident: the compiler is doing work at compile time that Python defers to runtime, and it catches a real class of errors before your program runs.

## Where to go next

The course materials on the [Part IA course pages](https://www.cl.cam.ac.uk/teaching/current/part1a.html) are what you are examined on, and the practical classes are where the ideas land. Alongside them, the [official Java tutorials](https://dev.java/learn/) are a solid reference.

Do the exercises rather than reading about them. Object-oriented design is a skill that only develops from making design decisions and then living with them.
