---
title: Concurrency Basics
description: Race conditions, locks and deadlock, as a companion to the theory
---

Concurrency is where correct-looking code stops being correct. A program that works every time you run it can still be broken, and it will prove that in front of a user, long after it has behaved perfectly for you.

Part IB Concurrent and Distributed Systems covers the theory properly, and Part IA Operating Systems introduces some of it. This page is about the practical shape of the problem: what goes wrong, why, and the habits that avoid it.

## The core problem

Threads share memory, and operations that look atomic in your source code are not atomic on the machine.

This line:

```c
counter++;
```

is really three steps: load `counter` into a register, add one, store it back. Two threads running it at once can interleave:

```text
Thread A: load counter (0)
Thread B: load counter (0)
Thread A: add 1 -> 1
Thread B: add 1 -> 1
Thread A: store 1
Thread B: store 1
```

Two increments happened and the counter reads 1. That is a race condition, where the result depends on timing you do not control.

The dangerous part is how rare that interleaving is. Run it a thousand times and it may be right every time, and the bug is still there.

## Mutual exclusion

The region that two threads must not run at once is the critical section, and a mutex enforces that only one thread is inside it.

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

In Python, a context manager releases the lock even when an exception is thrown:

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

- Every access to shared mutable state needs the lock, reads included. A read racing with a write can observe a half-updated value.
- The same lock must protect the same data everywhere. Two locks guarding one variable protect nothing.
- Hold the lock briefly, while keeping one logical operation inside one critical section.
- Do no I/O and call no unknown code while holding a lock, since you have no idea how long it will take or what it will try to lock.

## Deadlock

Locks bring a new failure, where threads wait on each other forever.

```text
Thread A holds lock 1, wants lock 2
Thread B holds lock 2, wants lock 1
```

Neither proceeds. Deadlock needs four conditions to hold at once, the Coffman conditions:

1. Mutual exclusion, so resources cannot be shared.
2. Hold and wait, so a thread holding one resource requests another.
3. No preemption, so resources cannot be taken back by force.
4. Circular wait, so a cycle of threads each waits on the next.

Break any one and deadlock becomes impossible. The fourth is the easiest to break in practice:

> [!TIP]
> Acquire locks in a fixed global order. If every thread takes lock 1 before lock 2, no cycle can form. Write the ordering down somewhere, since it is an invariant of your whole program and not of one function.

## Waiting for a condition

Locks handle "not at the same time". They do nothing for "wait until something is true", which is what condition variables are for.

The canonical use is a producer-consumer queue, where consumers wait when the queue is empty:

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

Note the `while` there, in place of an `if`. A thread can wake without the condition being true, through a spurious wakeup or because another consumer took the item first. Always re-check the condition in a loop after waking. This is the most common bug in code using condition variables.

## Threads or processes

Threads share memory, which makes communication free and data races free too.

Processes have separate memory and must communicate explicitly through pipes, sockets or shared memory. That is more work, and it eliminates a whole category of bug by making the isolation enforced.

Where tasks are largely independent, processes are often the better default for exactly that reason.

> [!NOTE]
> CPython has a global interpreter lock, so threads do not execute Python bytecode in parallel. They still help for I/O-bound work, where they spend their time waiting, and CPU-bound work wants `multiprocessing`. Recent versions offer an experimental free-threaded build removing this limit, so check what your interpreter actually does before assuming either way.

## The alternative: stop sharing

Most concurrency bugs come from shared mutable state. Remove either word and they go away.

Immutable data can be shared freely by any number of threads with no locking at all. Message passing, as in Go's channels, Erlang's processes or Rust's ownership model, gives each piece of data one owner and passes it along.

Where you can structure a problem so threads communicate by sending values, do. It is less clever and much more likely to be right.

## Debugging concurrency

Concurrency bugs break the usual debugging method, since observing the program changes its timing. A bug that vanishes when you add a print statement, a heisenbug, is a strong signal you have a race.

What works:

- Thread sanitizer. `gcc -fsanitize=thread` instruments your program and reports races it detects, including ones that did not manifest on that run. It finds real bugs that testing does not.
- Stress and vary. Run with many more threads than cores, on a loaded machine, thousands of times. Rare interleavings need many attempts.
- Add deliberate delays. Sleeping inside a suspected critical section widens the window and makes a race reproducible.
- Reason from invariants. Concurrency is one area where arguing about the code beats experimenting on it, because the failing case may be one interleaving in millions.

The general method still applies, and [Debugging Effectively](/wiki/tutorials/debugging) covers it.

## Rules worth internalising

1. Shared mutable state is the enemy. Reduce it before adding locks to it.
2. Document which lock protects which data, next to the data.
3. Acquire locks in a consistent order, always.
4. Re-check conditions in a `while` loop after waiting.
5. Prefer the highest-level primitive that does the job: a thread-safe queue over hand-rolled condition variables, a parallel map over raw threads.
6. Code that works while you cannot explain why it is race-free is not race-free. You have been lucky.

## Further reading

- [The `pthreads` manual page](https://man7.org/linux/man-pages/man7/pthreads.7.html)
- Part IB Concurrent and Distributed Systems notes, on the [course pages](https://www.cl.cam.ac.uk/teaching/current/part1b.html)
