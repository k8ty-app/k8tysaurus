---
title: Drone CI
id: drone
---

Drone is a Continuous Integration platform that integrates very well with GitHub, and can run in
a k8s cluster.

## Installing Drone via Helm

[Drone IO](https://www.drone.io/) has some good documentation about [installing to k8s](https://docs.drone.io/runner/kubernetes/overview/),
but they also maintain a [helm repo](https://github.com/drone/charts) to [quickly install](https://github.com/drone/charts/blob/master/charts/drone/docs/install.md) the server + runner as well.

## Installing the Drone Server

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

## Installing the Drone Runner

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

