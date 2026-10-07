---
title: Understanding `const` vs `var` in Zig
description: A practical explanation of the difference between const and var in Zig and when to use each.
date: 2026-03-08
---

## Understanding `const` and `var` in Zig

When writing Zig programs, one of the first things you'll notice is that variables must be declared using either `const` or `var`. Unlike many other languages where variables are mutable by default, Zig forces you to explicitly decide whether a value should be mutable.

This design encourages safer code and makes intent clearer.

In simple terms:

- `const` is used for **immutable values**
- `var` is used for **mutable values**

Understanding when to use each will make your Zig programs cleaner and easier to reason about.

---

## Using `const`

A `const` declaration means the value **cannot change after initialization**.

This is the most common form of declaration in Zig, because many values in a program never actually change.

Example:

```zig
const std = @import("std");

pub fn main() void {
    const message = "Hello Zig!";
    const number = 42;

    std.debug.print("{s}\n", .{message});
    std.debug.print("{}\n", .{number});
}