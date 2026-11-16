---
title: Settling bets on a free tier
description: How Dotesy settles every bet on time without a server that is always running.
date: 2026-11-08
tags: [Dotesy, Infrastructure]
draft: false
---

When a match ends, every bet on it should settle and every user should hear about it. The obvious answer is a background worker that runs all the time. Dotesy is hosted on Vercel's free Hobby plan, which has no always-on worker and only allows a cron job to run once a day.

Waiting up to a day to find out whether you won is not much fun. So settlement needed a different shape.

## One worker, three ways to start it

All settlement goes through a single server function. It finds unsettled bets whose matches should be over, fetches results from the provider, grades each bet with shared rules, applies the payout through the wallet function, and writes a notification. What changes is only who starts it:

1. **A GitHub Actions schedule, every ten minutes or so.** This is the main trigger. It is free, and it calls the settlement endpoint with a secret.
2. **A daily Vercel cron.** A fallback in case the scheduled runs stop.
3. **The user's own app.** When someone opens Dotesy, returns to the tab, or leaves it open, the app asks the server to settle their bets right away. It runs at most every few minutes and skips hidden tabs.

Because all three call the same server logic, and a settled bet cannot be settled twice, it does not matter if two of them overlap.

## Finished matches only

Live scores never settle a bet. Only finished matches do, and a finished match with missing data cancels and refunds rather than guessing. A parlay loses as soon as any leg loses, and otherwise waits until every leg is resolved.

## Written once, delivered twice

Each settlement writes one notification row. That row shows up in the in-app notification centre, and the same write is sent as a Web Push to the user's devices, so the result reaches them even when the app is closed.

## The trade-offs

GitHub's schedule can drift by a few minutes when it is busy. For play money that is fine, and I wrote it down as a known trade-off rather than pretending it is exact.

## What I took from it

- Free tiers shape architecture. Design around the limits instead of fighting them.
- If several triggers can start the same job, make the job safe to run twice.
- Let users speed things up, but never depend on them being there.
