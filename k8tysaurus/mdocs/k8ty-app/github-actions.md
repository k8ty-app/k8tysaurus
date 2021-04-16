---
title: GitHub Actions
id: gh-actions
---

## Build + Push Docker Images

Below is an example of a GitHub Action that will build + push a `:latest` image on every push to the `main` branch to
GitHubs Container Registry. It requires you have environment variables/secrets `GHCR_USER` and `GHCR_PASS` set (
credentials to log into GHCR - you could anme them whatever you want)

This is fairly well documented thing, so I'll mainly discuss the things unique for building a Scala app, which uses
the sbt docker plugin (which uses `sbt docker:stage` to prep things for building).

After using the `- uses: actions/setup-java@v1`, we will use [sbt-extras](https://github.com/paulp/sbt-extras) to grab a
script to install sbt, which will pull in any other dependencies needed! The project this example is from project uses
the `sbt-native-packager` sbt plugin, and is use to compile/stage a Dockerfile for building (via the `./sbtx docker:stage` line).

From this point, it's building a Docker image as normal. Do note, that if you want your pushed image to be publicly
accessible, you'll need to go to the package page, and set it to be public access!

```yaml
name: Publish Latest Docker Image
on:
  push:
    branches: main

jobs:
  push_latest:
    name: Push image:latest
    runs-on: ubuntu-latest
    steps:
      - name: Check Meowt
        uses: actions/checkout@v2
      - uses: actions/setup-java@v1
        name: JavaJavaJava
        with:
          java-version: '15'
          java-package: jdk
          architecture: x64
      - run: |
          curl -Ls https://git.io/sbt > sbtx && chmod 0755 sbtx
          ./sbtx docker:stage
        name: Compile + Docker Stage
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ghcr.io
          username: ${{ secrets.GHCR_USER }}
          password: ${{ secrets.GHCR_PASS }}
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: ./target/docker/stage
          file: ./target/docker/stage/Dockerfile
          push: true
          tags: ghcr.io/k8ty-app/melvin:latest
          labels: |
            org.opencontainers.image.source=${{ github.event.repository.html_url }}
            org.opencontainers.image.revision=${{ github.sha }}
```
