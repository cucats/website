---
title: Concurrency Basics
description: Race conditions, locks and deadlock, as a companion to the theory
---

Concurrency is where correct-looking code stops being correct. A program that works every time you run it can still be broken, and will prove it in front of an examiner or a user rather than in front of you.

Part IB Concurrent and Distributed Systems covers the theory properly, and Part IA Operating Systems introduces some of it. This page is about the practical shape of the problem: what goes wrong, why, and the habits that avoid it.

## The core problem

Threads share memory. Operations that look atomic in your source code are not atomic on the machine.

This line:

```c
counter++;
```

is really three steps: load `counter` into a register, add one, store it back. Two threads running it at the same time can interleave like this:

```text
Thread A: load counter (0)
Thread B: load counter (0)
Thread A: add 1 -> 1
Thread B: add 1 -> 1
Thread A: store 1
Thread B: store 1
```

Two increments have happened and the counter reads 1. This is a **race condition**: the result depends on timing you do not control.

The dangerous part is that the interleaving above is rare. Run it a thousand times and it may be right every time. The bug is still there.

## Mutual exclusion

The region of code that must not be run by two threads at once is the **critical section**, and a **mutex** (mutual exclusion lock) enforces that only one thread is inside it.

In C with pthreads:

```c
#include <pthread.h>

int counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *worker(void *arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&lock);
        counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}
```

Compile with `gcc -pthread program.c -o program`.

In Python, a context manager releases the lock for you even if an exception is thrown:

```python
import threading

counter = 0
lock = threading.Lock()

def worker():
    global counter
    for _ in range(100000):
        with lock:
            counter += 1
```

The rules that matter:

- **Every access to shared mutable state needs the lock**, reads included. A read racing with a write can observe a half-updated value.
- **The same lock must protect the same data everywhere.** Two locks guarding one variable protect nothing.
- **Hold the lock for as short a time as possible** — but not so short that you split one logical operation into two critical sections.
- **Never do I/O or call unknown code while holding a lock.** You do not know how long it will take or what it will try to lock.

## Deadlock

Locks introduce a new failure: threads waiting for each other forever.

```text
Thread A holds lock 1, wants lock 2
Thread B holds lock 2, wants lock 1
```

Neither can proceed. Deadlock requires four conditions to hold simultaneously — the **Coffman conditions**:

1. **Mutual exclusion** — resources cannot be shared.
2. **Hold and wait** — a thread holding one resource requests another.
3. **No preemption** — resources cannot be forcibly taken back.
4. **Circular wait** — a cycle of threads each waiting on the next.

Break any one and deadlock becomes impossible. In practice the easiest to break is the fourth:

> [!TIP]
> **Always acquire locks in a fixed global order.** If every thread takes lock 1 before lock 2, no cycle can form. Write the ordering down somewhere, because it is an invariant of your whole program rather than of one function.

## Waiting for a condition

Locks handle "not at the same time". They do not handle "wait until something is true" — for that you need a **condition variable**.

The canonical use is a producer–consumer queue, where consumers must wait when the queue is empty:

```python
import threading
from collections import deque

queue = deque()
cond = threading.Condition()

def produce(item):
    with cond:
        queue.append(item)
        cond.notify()

def consume():
    with cond:
        while not queue:
            cond.wait()
        return queue.popleft()
```

Note the `while`, not `if`. A thread can wake without the condition being true — a spurious wakeup, or another consumer taking the item first. **Always re-check the condition in a loop after waking.** This is the most common bug in code that uses condition variables.

## Threads or processes

**Threads** share memory. Communication is free, and so are data races.

**Processes** have separate memory. They must communicate explicitly through pipes, sockets or shared memory, which is more work and eliminates a whole category of bug.

If tasks are largely independent, processes are often the better default, precisely because the isolation is enforced rather than remembered.

> [!NOTE]
> In CPython, a global interpreter lock means threads do not execute Python bytecode in parallel. Threads still help for I/O-bound work, where they are waiting rather than computing, but for CPU-bound work use `multiprocessing`. Recent versions offer an experimental free-threaded build that removes this limit; check what your interpreter actually does before assuming either way.

## The alternative: don't share

Most concurrency bugs come from shared mutable state. Remove either word and they go away.

- **Immutable data** can be shared freely by any number of threads, with no locking at all.
- **Message passing** — Go's channels, Erlang's processes, Rust's ownership model — gives each piece of data one owner and passes it along rather than sharing it.

When you can structure a problem so that threads communicate by sending values instead of by writing to the same memory, do. It is less clever and much more likely to be right.

## Debugging concurrency

Concurrency bugs break the usual debugging method, because observing the program changes its timing. A bug that vanishes when you add a print statement — a "heisenbug" — is a strong signal that you have a race.

What actually works:

- **Thread sanitizer.** `gcc -fsanitize=thread` instruments your program and reports races it detects, including ones that did not manifest on that run. This finds real bugs that testing does not.
- **Stress and vary.** Run with many more threads than cores, on a loaded machine, thousands of times. Rare interleavings need many attempts.
- **Add deliberate delays.** Sleeping inside a suspected critical section widens the window and makes a race reproducible.
- **Reason, don't experiment.** Concurrency is one area where staring at the code and arguing from invariants genuinely beats trial and error, because the failing case may be one interleaving in millions.

The general debugging method still applies — see [Debugging Effectively](/wiki/tutorials/debugging).

## Rules worth internalising

1. Shared mutable state is the enemy. Reduce it before adding locks to it.
2. Document which lock protects which data, next to the data.
3. Acquire locks in a consistent order, always.
4. Re-check conditions in a `while` loop after waiting.
5. Prefer the highest-level primitive that does the job — a thread-safe queue over hand-rolled condition variables, a parallel map over raw threads.
6. If it works but you cannot explain _why_ it is race-free, it is not race-free. You have been lucky.

## Further reading

- [The `pthreads` manual page](https://man7.org/linux/man-pages/man7/pthreads.7.html) — the reference for the C API
- Part IB Concurrent and Distributed Systems lecture notes, on the [course pages](https://www.cl.cam.ac.uk/teaching/current/part1b.html)
