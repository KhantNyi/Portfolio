---
title: Never trust a single frame
description: How SafeRide turns noisy, one-frame guesses into evidence a person can stand behind.
date: 2026-11-14
tags: [Computer vision, SafeRide]
draft: false
---

SafeRide watches road video and flags motorcycle riders without a helmet, then captures the license plate as evidence. The detection models are the easy part to talk about. The harder part is everything around them, because a model looking at one frame is wrong far more often than you would like.

If a single frame could create a violation, the system would accuse people constantly. So most of the work went into making sure it never acts on one frame alone.

## Small riders get a second look

A rider at the far end of the road might be only a few pixels tall in a full frame. At that size, telling a helmet from a head of dark hair is guesswork.

So the helmet check runs twice. Once on the full frame, and again on a crop focused on each rider. The crop gives the model far more pixels to work with, and that is where most of the improvement for distant riders came from.

## Plates are read from the best moments, not the first

Plates are small, they move, and they blur. Reading the first plate crop you see usually gives you garbage.

Instead, SafeRide follows each motorcycle along its track and collects plate crops for up to six seconds. It keeps the strongest ones and only runs OCR on the best three. A plate that was unreadable in one frame is often perfectly clear half a second later.

## A violation needs votes

Before anything is recorded, a rider needs several no-helmet votes across frames and several plate sightings along their track. One bad frame cannot do it on its own.

When the system does see a no-helmet detection, it also samples frames more densely for a while, so it gathers that evidence quickly instead of waiting for the next regular sample.

## A person makes the final call

Every case lands in front of a reviewer, who accepts or rejects it. Those decisions feed back into the metrics, so I can see how often the system is right in practice, not only on a test set.

There is also an evaluation script that runs against labelled clips and reports precision, recall, duplicate rate, plate capture rate and OCR accuracy. Having those numbers turned tuning from "this looks better" into "this is better".

## What I took from it

- A model's output is a guess. The system around it decides whether that guess becomes a fact.
- Time is a resource. Watching for a few seconds beats squinting harder at one frame.
- When the cost of a false positive is accusing someone, make the system earn every alert, and keep a human in the loop.
