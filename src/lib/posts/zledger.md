---
title: "zledger — an exchange engine in Zig that Node can call"
description: "Building a price-time matching engine, fixed-point ledger, and Node-API bridge without giving up systems performance."
date: "2026-05-31"
cover: "/blog/zledger-hero.jpg"
author: "Mann Lohchab"
published: true
---

I wanted a matching engine that felt honest about money and latency. Not a toy order book in JavaScript. Not a black-box binary I could not read. Something I could step through, measure, and call from a normal Node service.

That is how **zledger** started — a Zig core for the order book, ledger, and matcher, exposed to Node through Node-API, with small services around it for auth, odds, deposits, and wallets.

## Why Zig for the hot path

The hot path of an exchange is unforgiving. Every order update touches balances, price levels, and match records. Floating point is the wrong tool for that: `0.1 + 0.2` is a joke until it is your ledger.

Zig gave me three things I cared about:

- **Fixed-point integers** with no silent rounding
- **Explicit memory** without a garbage collector pausing mid-match
- **A clean C ABI** so Node-API bindings stay boring and stable

The money scale is a single constant:

```zig
pub const SCALE: i64 = 100_000_000; // 1e8
```

Prices and quantities live as `i64`. Arithmetic stays exact. The ledger either balances or it fails loudly.

## The shape of the engine

The Zig side is deliberately split:

- `orderbook.zig` — shared types: orders, sides, statuses, price levels
- `matching.zig` — price-time priority matching
- `ledger.zig` — available vs locked balances with an audit trail
- `napi_orderbook.zig` — the JS ↔ Zig boundary
- `db_writer.zig` — async batch writes toward Postgres

Node never “owns” matching logic. It asks Zig to place an order, gets matches back, and continues with the boring distributed work: sessions, wallets, deposits, odds.

Around the native core sit service boundaries:

- **Auth.Service** — JavaScript
- **Odds.Service** — Python
- **Deposit.Service** — JavaScript
- **Wallet.Service** — JavaScript

That split is intentional. The engine stays small. The product surface stays flexible.

## Price-time priority, written down

Matching is not mysterious. A new buy walks the ask side from the best price up. A new sell walks the bid side from the best price down. At the same price, older orders win — FIFO.

In Zig that looks like a loop over sorted price keys, producing a list of `Match` structs the caller must free. Limit orders that do not fully fill rest on the book. Market orders that do not fully fill do not.

The important part is not the algorithm. Everyone knows price-time priority. The important part is making the data layout and ownership rules boring enough that bugs have nowhere to hide.

## Ledger before swagger

Before flashy APIs, balances have to be dull and correct:

- **available** — spendable now
- **locked** — held for open orders

Every change goes through the ledger: credit, debit, lock, unlock. Each change emits an entry with `balance_after` and `locked_after`. If you cannot reconstruct how you got here, you do not have a ledger. You have vibes.

## Crossing into Node without drama

Node-API is the quiet hero. The addon exposes `initEngine`, order placement, and ledger operations with a stable ABI. Zig functions use `callconv(.c)`. Arguments are unpacked once. Results are packed once. No JSON in the hot path.

That boundary is where most native projects get ugly. Keep it thin. Put intellect in `matching.zig` and `ledger.zig`, not in argument parsing.

## Benchmarks

I care about the Zig core, not HTTP fluff. These numbers are **in-process**, single-threaded, `ReleaseFast`, calling `matching.zig` and `ledger.zig` directly — no Node-API, no Postgres, no JSON.

Setup: 50,000 iterations (20,000 for resting inserts), warmup first, quantity `0.001` BTC, price `50,000` USDT, scale `1e8`.

| Operation | p50 | p99 | Throughput |
| --- | --- | --- | --- |
| Resting limit insert (no cross) | 48 ns | 1.2 µs | ~13.4M ops/s |
| Aggressor match (1 fill) | 26.3 µs | 35.8 µs | ~35k matches/s |
| Sweep 5 price levels | 16.2 µs | 20.2 µs | ~58k sweeps/s |
| Ledger lock + unlock | 44 ns | 53 ns | ~22.3M pairs/s |

A few honest takeaways:

- **Inserts and ledger ops are cheap.** Sub-100 ns for a resting limit and for a lock/unlock pair. That is the part Zig is supposed to win.
- **A single fill is ~26 µs today.** Most of that is allocation on the match path: sorting price keys, growing the match list, freeing the resting node. The match loop itself is not the whole story.
- **Sweeping five levels can beat a lone fill on throughput** because the fixed setup cost is amortized across more fills in one call.
- These are **engine** numbers. Crossing Node-API, HTTP, and Postgres will add milliseconds. The HTTP suite in `test/test.py` measures that outer path separately (orderbook reads, placement, concurrent load).

I want the next round of work to cut match p50 by reusing sort buffers and match scratch space instead of allocating per call. The ledger is already fast enough that I am not worried about it.

## What I learned building it

**1. Fixed-point is a product decision.**  
Choosing `1e8` early forced every layer to agree on units. That saved weeks of “why is this off by one satoshi” later.

**2. Ownership must be written in the type system.**  
Match slices returned to NAPI have a clear free responsibility. Zig’s `errdefer` makes the failure path as intentional as the success path.

**3. Services should not pretend to be the engine.**  
JavaScript is excellent at wiring. Zig is excellent at tight loops and exact math. Let each one do its job.

**4. A matching engine is a teaching tool.**  
Writing comments that explain *why* a field is `extern` or why market orders never rest taught me more than the code alone.

**5. Measure the core, not the socket.**  
HTTP latency numbers hide the engine. In-process benches made it obvious that allocation on the match path mattered more than the FIFO walk.

## Where it sits now

zledger is still a systems project, not a exchange product. The valuable piece is the core: book, matcher, ledger, and a Node-API door you can open from a Bun or Node process.

If you want to read the code, it lives here: [github.com/mannlohchab/zledger](https://github.com/mannlohchab/zledger).

Build the Zig library, load the `.node` addon, and place an order. Watch matches come back in microseconds of in-process work — no serialization tax, no second runtime, just a careful machine doing careful math.
