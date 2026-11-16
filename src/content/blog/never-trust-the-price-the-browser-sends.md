---
title: Never trust the price the browser sends
description: Building a wallet for Dotesy that stays correct through retries, stale odds and impatient users.
date: 2026-11-10
tags: [Dotesy, Backend]
draft: true
---

Dotesy runs on play money, but I wanted the wallet to behave as if it were real. If balances can drift, double-charge or be edited from the browser, the leaderboard means nothing and the whole thing stops being fun.

The rule I ended up building everything around was simple: the browser can ask, but only the server decides.

## The browser cannot write bets

Users can read their own bets through row-level security, but direct inserts, updates and deletes on bets are revoked. Every balance change goes through a Postgres function that locks the user's row, applies the change and records it in a ledger, all in one transaction.

Even the app's own API cannot skip that path, and the functions that move money are only callable with the server's key.

## Retries must not charge twice

Networks fail at the worst moment. A user taps "place bet", the request succeeds, the response is lost, and the app tries again.

Each placement carries a reference that the client keeps for that slip. If the same reference arrives twice, the database recognises it while holding the account lock and returns the original receipt instead of debiting a second time.

## The price can change under you

Odds move. The price on screen might be a minute old by the time someone taps the button.

So the server ignores the price the client sends. It fetches the match again, checks the market is still open, and rebuilds the odds with the same model the app uses. If the price has changed, it replies with the new one and an `ODDS_CHANGED` code. The slip shows the new price and return, keeps the stake, and waits for the user to confirm again.

It is a small interaction, but it is the difference between a user agreeing to a price and a user being surprised by one.

## Settled means settled

Once a bet is settled, its receipt is immutable. Asking to settle it again does nothing. This matters because several things can trigger settlement, and they must never pay out twice.

## What I took from it

- Treat the client as a request, never as the source of truth.
- Make retries safe by design, not by hoping they do not happen.
- Put the most important rules in the database, where nothing can walk around them.
