---
title: A forecast you can check with a calculator
description: Why Athone Sayate predicts your month with a few lines of arithmetic instead of machine learning.
date: 2026-11-12
tags: [Athone Sayate, Product]
draft: false
---

Athone Sayate shows where your month is likely to land before it gets there. It would have been easy to reach for something clever. I chose a model you can check by hand, because a money forecast you cannot explain is a forecast nobody should trust.

## The idea in one sentence

Take what you have already spent, add the bills you know are coming, and estimate the rest from a blend of your history and how you are spending this month.

## History, weighted towards the recent

The app looks at up to three complete months before this one and works out a daily rate for your non-recurring spending in each. Recent months count more: with three months of history the weights are 3, 2 and 1, newest first.

It only uses months you were actually tracking. If you started using the app halfway through October, October does not count as history, because a half-tracked month would make you look far more frugal than you are.

## A blend that shifts as the month goes on

On the 2nd of the month, two days of spending say very little. By the 25th, they say almost everything. So the forecast blends the two rates by how far through the month you are:

```text
remaining daily rate =
  historical rate × (1 - month progress)
  + current rate × month progress
```

Early on, history keeps the estimate steady. Later, your actual behaviour takes over. With no history at all, it simply uses your current pace.

## Recurring bills are counted separately

Rent and subscriptions are not guesses, so they are not averaged in with coffee and taxis. Any bills still due this month are added as known amounts, and only the variable spending is projected.

```text
projected total =
  spent so far + bills still due + predicted variable spending
```

## Honest about how sure it is

Alongside the number, the app shows a plain confidence label. High means at least three months of history and at least ten days into the month. It is a label for how much evidence there is, not a statistical interval, and the documentation says so.

## What it does not do

The model is linear. It does not know about payday, weekends or the holiday you have planned, and one big purchase can skew a month's baseline. I wrote these limits down rather than hiding them, because knowing where a tool is weak is part of using it well.

## What I took from it

- Simple models are easier to trust, debug and explain.
- Separate what you know from what you are guessing.
- Write down the limitations. They are part of the feature.
