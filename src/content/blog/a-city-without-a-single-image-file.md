---
title: A city without a single image file
description: Notes from building Tabi, a pixel-art Tokyo where every sprite and every note is made in code.
date: 2026-11-15
tags: [Games, Canvas]
draft: false
---

> My trip to Japan was so memorable to me that I decided to make a game to recreate that feeling.

Tabi is a slow walk through Tokyo. Eight districts, one train line, nothing to fail. The repository contains no images and no audio files.

## Drawing in code

Every building, person, cat and letter is drawn onto a canvas by JavaScript. The canvas renders at double pixel density, with a small set of pixel-drawing helpers and a hand-made bitmap font on top.

The trade is simple. I give up drawing in an art tool, and in return a new shop or a new outfit is a few lines of code rather than a new asset to export. This wouldn't have been possible without Claude. It has allowed me to create where my imagination is my limit.

## Music from an oscillator

The soundtrack is chiptune, synthesized in the browser with the Web Audio API. Sound effects are made the same way.

## No build step

The scripts are plain `<script>` tags sharing one scope, loaded in order: engine, art, world, cities, game. You can open `index.html` straight from disk and play.

Adding a city means copying the Tokyo module, defining its districts and rooms, and adding one script tag.
