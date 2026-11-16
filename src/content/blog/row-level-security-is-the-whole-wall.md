---
title: Row-level security is the whole wall
description: What changes when a web app has no API layer and the browser talks to the database directly.
date: 2026-11-16
tags: [Supabase, Security]
draft: false
---

> Athonesayate ("expense" in Burmese) is created when there's a need for tracking my personal finance emerged.

Athone Sayate has no CRUD API. The browser talks to Supabase directly, which means there is no server of mine standing between a signed-in user and the tables.

That sounds reckless until you look at where the checks live. Most apps treat row-level security as a second line of defence behind an API. Here it is the only line, so it has to be complete.

## Owning a row is not enough

The obvious policy is that every table restricts rows to their owner: `user_id = auth.uid()`. That stops me reading your transactions.

It does not stop me writing a transaction of my own that points at *your* account or *your* category. So tables that reference other owned rows also check that I own the thing being referenced: the account, the category and the subcategory.

## What I took from it

- Decide where the security boundary is, then put every check there. A boundary that is only mostly complete is not a boundary.
- Write the policy for the reference, not only for the row.
- The service-role key bypasses all of this, so it never gets a public name and never reaches the browser.
