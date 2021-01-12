---
id: cicd
title: CI/CD
slug: /cicd
---

This page goes over a few examples of the CI/CD pipelines set up deploy our apps.

## Tech Review

Here are a list of the CI/CD resources used:

* Drone IO
* GitHub Actions

## Drone IO

### Installing Drone via Helm

[Drone IO](https://www.drone.io/) has some good documentation about [installing to k8s](https://docs.drone.io/runner/kubernetes/overview/),
but they also maintain a [helm repo](https://github.com/drone/charts) to [quickly install](https://github.com/drone/charts/blob/master/charts/drone/docs/install.md) the server + runner as well.

### Installing the Drone Server

[Official Server Docs](https://github.com/drone/charts/blob/master/charts/drone/docs/install.md) 👈

A slightly tricky part, if you're not yet familiar with k8s, is adding an ingress to route web traffic to the ui - which 
is a bit out of scope ot their documentation. I have included an example below, which might be different depending on
your usage of Let's Encrypt/Cert Manager.

With a filled-out a `drone-values.yaml` file:

```yaml
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
  hosts:
    - host: drone.k8ty.app
      paths:
        - "/"
  tls:
    - secretName: drone-k8ty-tls
      hosts:
        - drone.k8ty.app
env:
  ## REQUIRED: Set the user-visible Drone hostname, sans protocol.
  ## Ref: https://docs.drone.io/installation/reference/drone-server-host/
  ##
  DRONE_SERVER_HOST: drone.k8ty.app
  ## The protocol to pair with the value in DRONE_SERVER_HOST (http or https).
  ## Ref: https://docs.drone.io/installation/reference/drone-server-proto/
  ##
  DRONE_SERVER_PROTO: https
  ## REQUIRED: Set the secret secret token that the Drone server and its Runners will use
  ## to authenticate. This is commented out in order to leave you the ability to set the
  ## key via a separately provisioned secret (see existingSecretName above).
  ## Ref: https://docs.drone.io/installation/reference/drone-rpc-secret/
  ##
  DRONE_RPC_SECRET: randomly-generated-secret-here
  ## GitHub provider configuration.
  ## Ref: https://docs.drone.io/installation/providers/github/
  DRONE_GITHUB_CLIENT_ID: xxxxxxxxxxxxxxxxxxxxxxx
  DRONE_GITHUB_CLIENT_SECRET: yyyyyyyyyyyyyyyyyyyyy
  ## Especially with an ingress, you will want to limit the users who can access the instance. 
  ## Set yourself as an admin, and filter only your users and/or orgs (which presuambly, you are a part of)
  DRONE_USER_CREATE: "username:yourAccount,admin:true"
  DRONE_USER_FILTER: "yourOrg"
```

you can run

```bash
helm install --namespace drone drone drone/drone -f drone-values.yaml
```

### Installing the Drone Runner

[Official Runner Docs](https://github.com/drone/charts/blob/master/charts/drone-runner-kube/docs/install.md) 👈

The core/minimal settings for the runner are mainly ensuring it's in the same namespace, and using the same `DRONE_RPC_SECRET`:
With a filled out `drone-runner-kube-values.yaml`:

```yaml
## Each namespace listed below will be configured such that the runner can run build Pods in
## it. This comes in the form of a Role and a RoleBinding. If you change env.DRONE_NAMESPACE_DEFAULT
## or the other DRONE_NAMESPACE_* variables, make sure to update this list to include all
## namespaces.
rbac:
  buildNamespaces:
    - drone

env:
  ## REQUIRED: Set the secret secret token that the Kubernetes runner and its runners will use
  ## to authenticate. This is commented out in order to leave you the ability to set the
  ## key via a separately provisioned secret (see existingSecretName above).
  ## Ref: https://kube-runner.docs.drone.io/installation/reference/drone-rpc-secret/
  ##
  # NOTE TO READER: Change this to match the DRONE_RPC_SECRET secret set in your drone server configs. 
  DRONE_RPC_SECRET: xxxxxxxxxxxxx

  ## Determines the default Kubernetes namespace for Drone builds to run in.
  ## Ref: https://kube-runner.docs.drone.io/installation/reference/drone-namespace-default/
  ##
  DRONE_NAMESPACE_DEFAULT: drone
```

you can run

```bash
helm upgrade drone-runner-kube drone/drone-runner-kube --namespace drone --values drone-runner-kube-values.yaml
```

## Deploy to Firebase Hosting

This site is set to deploy on every push to `main`! To accomplish thing, we need to perform several tasks:

1. Run an `sbt` task to pre-process our md files via the scalameta/mdoc plugin.
2. Run a `yarn` task to build the site.
3. Run a `firebase` task to deploying to hosting via a CI token.

### sbt

As elsewhere, we will use [sbt-extras](https://github.com/paulp/sbt-extras) to grab a script to install
sbt, and anything else Scala related that we need! At that point, we need to run the tasks to preprocess
the `docs` and `blog` -- which we can do in a one-liner:

```bash
curl -Ls https://git.io/sbt > sbtx && chmod 0755 sbtx
./sbtx "docs/mdoc; blog/mdoc"
```

### yarn

In lieu of having a purpose-built runner image, we will stick with the openjdk base, but install node,
and install yarn via curl, before running our build. Note the handy `--cwd` flag we can use to not have to
enter the subdirectory.

```shell
apt update && apt install nodejs --yes
curl -o- -L https://yarnpkg.com/install.sh | bash
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
yarn --cwd ./k8tysaurus install
yarn --cwd ./k8tysaurus build
```

### Firebase

Firebase makes is easy to use vi a CI runner via a token. To acquire one, you can run
`firebase login:ci` - we will store this a a secret named `FIREBASE_TOKEN` in out Drone settings.
We will also use yarn to install firebase-tools:

```bash
yarn global add firebase-tools
firebase deploy --only hosting --token $FIREBASE_TOKEN
```

### Pipeline File

Putting it all together we have:

```yaml
---
kind: pipeline
type: kubernetes
name: firebase_deploy

trigger:
  branch:
    - main

steps:
  - name: firebase_deploy
    image: adoptopenjdk/openjdk15:debian-slim
    commands:
      - apt update && apt install nodejs --yes
      - curl -o- -L https://yarnpkg.com/install.sh | bash
      - export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
      - curl -Ls https://git.io/sbt > sbtx && chmod 0755 sbtx
      - ./sbtx "docs/mdoc; blog/mdoc"
      - yarn --cwd ./k8tysaurus install
      - yarn --cwd ./k8tysaurus build
      - yarn global add firebase-tools
      - firebase deploy --only hosting --token $FIREBASE_TOKEN
    environment:
      FIREBASE_TOKEN:
        from_secret: FIREBASE_TOKEN
```

## GitHub Actions

### Build + Push Docker Images

Below is an example of a GitHub Action that will build + push a `:latest` image on every push to the `main` branch to GitHubs Container Registry.

This is fairly well documented thing, so I'll mainly discuss the things unique for building a Scala app (this example is from the `Melvin` app).

After using the `- uses: actions/setup-java@v1`, we will use [sbt-extras](https://github.com/paulp/sbt-extras) to grab a script to install sbt, which will pull in any other dependencies needed! The project this example is from project uses the
`sbt-native-packager` sbt plugin, and is use to compile/stage a Dockerfile for building (via the `./sbtx docker:stage` line).

From this point, it's building a Docker image as normal. Do note, that if you want your pushed image to be publicly accessible, you'll need to go to the package page, and set it to be public access!

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
