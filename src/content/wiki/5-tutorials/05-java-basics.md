---
title: Java Basics
description: Java for people arriving from Python, OCaml or nothing at all
---

Part IA Object-Oriented Programming is taught in Java, usually running alongside Foundations of Computer Science in OCaml. Meeting a strict, verbose, class-based language in the same term as a terse functional one is disorienting, and most of the early friction comes from Java insisting on things other languages leave implicit.

This page is about getting past that friction. The object-oriented ideas themselves are what the course is for.

## Everything lives in a class

There is no top-level code. The smallest complete program:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```

The file has to be called `Hello.java`, matching the public class name, and the compiler enforces it. Compile and run:

```bash
javac Hello.java
java Hello
```

Modern JDKs also run a single file directly with `java Hello.java`, which is handy while experimenting.

`static` means the method belongs to the class and not to any particular object, which is how `main` runs before any object exists. The static and instance distinction trips people up early: an instance method can use the object's fields and a static one cannot, because there is no object.

## Types are declared and checked

Every variable has a type, fixed at declaration:

```java
int count = 0;
double average = 4.5;
boolean done = false;
String name = "Ada";
```

Java separates primitives, meaning `int`, `double`, `boolean`, `char` and `long`, from objects, meaning everything else including `String`. Primitives are not objects and cannot be null. Each has a wrapper class such as `Integer` or `Double` for the places an object is required, with automatic conversion between them.

`var` lets the compiler infer a local variable's type, cutting some verbosity while keeping the static checking:

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

Three things there are worth noticing. `private` keeps the field inaccessible from outside the class, which is encapsulation, and the course cares about it a great deal; the payoff is being able to change the internals later without breaking anyone using the class. `final` stops the field being reassigned after construction, and is a good default, since immutable objects cause far fewer bugs. And `this.x = x` separates the field from the constructor parameter shadowing it.

## Inheritance and interfaces

A class can extend another, inheriting its behaviour and overriding parts:

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

An interface says what a type can do without saying how:

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

A class extends at most one class and implements any number of interfaces, which is why interfaces are usually the better tool. They describe a capability, and one type can have many.

Polymorphism is the payoff. Code written against `Shape` works for every implementation, including ones written later:

```java
List<Shape> shapes = List.of(new Circle(1), new Circle(2));
double total = 0;
for (Shape s : shapes) {
    total += s.area();       // calls the right area() for each object
}
```

> [!TIP]
> Always write `@Override` when overriding. It is optional, and it makes the compiler check you really are overriding something, catching the case where a typo in the method name quietly creates a new method.

## Collections and generics

Angle brackets specify what a collection holds, checked at compile time:

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

Note the shape of `List<String> names = new ArrayList<>()`. The variable's type is the interface and the object is a concrete implementation, so swapping `ArrayList` for `LinkedList` later changes one line.

## The traps

`==` does not compare values for objects. It compares references, asking whether two names point at the same object. Use `.equals()`:

```java
String a = "hello";
String b = "hel" + "lo";
a == b;        // unreliable, depends on interning
a.equals(b);   // true, and correct
```

This is the most common Java bug for beginners, made worse because `==` happens to work for small integers and interned strings, so it appears fine until it is not.

Override `hashCode` whenever you override `equals`. The contract says equal objects have equal hash codes, and breaking it makes your objects behave bizarrely in a `HashMap` or `HashSet`, where you insert one and then fail to find it.

`null` is not an object, so calling a method on it throws `NullPointerException`, the most common runtime failure in Java. Where you can return an empty collection or an `Optional`, do.

Checked exceptions have to be handled. A method declaring `throws IOException` forces callers to catch it or declare it themselves:

```java
try {
    var content = Files.readString(Path.of("data.txt"));
} catch (IOException e) {
    System.err.println("Could not read file: " + e.getMessage());
}
```

Never write an empty catch block, which turns a clear failure into a mysterious one later.

Arrays are fixed-length. `int[] a = new int[10]` cannot grow, so use `ArrayList` when the size varies.

## Coming from Python

| Python                     | Java                                                 |
| -------------------------- | ---------------------------------------------------- |
| Indentation defines blocks | Braces define blocks, indentation is cosmetic        |
| Types are dynamic          | Types are declared and checked at compile time       |
| `list`, `dict`, `set`      | `List`, `Map`, `Set` with an explicit implementation |
| `len(xs)`                  | `xs.size()`, or `xs.length` for arrays               |
| `str(x)`                   | `x.toString()` or `String.valueOf(x)`                |
| `x == y` compares values   | `x.equals(y)` compares values                        |
| `None`                     | `null`                                               |
| Functions can stand alone  | Everything is a method on a class                    |

The verbosity is deliberate. The compiler does work at compile time that Python leaves until runtime, and it catches a real class of errors before your program runs.

## Where to go next

The [Part IA course pages](https://www.cl.cam.ac.uk/teaching/current/part1a.html) hold what you are examined on, and the practical classes are where the ideas land. The [official Java tutorials](https://dev.java/learn/) are a solid reference alongside them.

Do the exercises. Reading about them achieves very little. Object-oriented design only develops from making design decisions and then living with them.
