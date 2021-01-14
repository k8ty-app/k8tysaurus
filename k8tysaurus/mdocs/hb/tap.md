---
title: K8ty-Tap
description: Info about the custom homebrew tap
---

These applications can be installed via [Homebrew](https://docs.brew.sh), and are
built via sbt using scalameta/sbt-native-image plugin. Build times are quite slow,
but the startup speeds are quite fast!

*Note* If you are using an MBA/MBP with an M1 chip, you will likely need to use a `brew` that
is in Rosetta mode due to the dependency on sbt (and thus openjdk). Once openjdk supports the M1,
this won't be required.

I have had success building native images on the M1 using the zulu jdk, if you want to build
the apps manually!

## How do I install these formulae?

`brew install k8ty-app/k8ty-tap/<formula>`

Or `brew tap k8ty-app/k8ty-tap` and then `brew install <formula>`.

## Repository

[https://github.com/k8ty-app/homebrew-k8ty-tap](https://github.com/k8ty-app/homebrew-k8ty-tap)
