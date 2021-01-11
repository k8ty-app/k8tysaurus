---
id: cicd
title: CI/CD
slug: /cicd
---

This section goes over a few examples of CI/CD pipelines using our self-hosted Drone IO system, as well as
some quick info about getting it set up in our Kubernetes cluster.

## Installing Drone via Helm
[Drone IO](https://www.drone.io/) has some good documentation about [installing to k8s](https://docs.drone.io/runner/kubernetes/overview/),
but they also maintain a [helm repo](https://github.com/drone/charts) to [quickly install](https://github.com/drone/charts/blob/master/charts/drone/docs/install.md) the server + runner as well.

### Installing the Server
[Official Server Docs](https://github.com/drone/charts/blob/master/charts/drone/docs/install.md)

A slighly tricky part, if you're not yet familiar with k8s, is adding an ingress to route web traffic to the ui - which 
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
```
you can run 

```bash 
helm install --namespace drone drone drone/drone -f drone-values.yaml
```

### Installing the Runner
[Official Runner Docs](https://github.com/drone/charts/blob/master/charts/drone-runner-kube/docs/install.md)

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

1. Run an `sbt` task to pre-proccess our md files via the scalametals/mdoc plugin.
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

## Building Docker Images

TODO