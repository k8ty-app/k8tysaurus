---
title: k8ty
id: k8ty
---

Deploy apps to k8s quickly.

## Overview

`k8ty` is a cli app to help you quickly deploy stateless apps to a kubernetes cluster. For example, if you call `k8ty app:create` and will
generate a `k8ty-app` with some heroku-like name (via [Haikunator](https://github.com/Atrox/haikunatorjs)) like
`traveling-whisper-123456`. So, what is a k8ty-app, in kubernetes terms?

## Anatomy of a k8ty-app
A `k8ty-app` creates the following kubernetes resources (all namespaced and generally named after the app's namesake):
* `namespace`
* `secret`
* `deployment`
* `service`
* `ingress`

All resourced are put in and labeled in the `namespace` created. An empty `secret` is also generated. A `deployment` is created
with a stock image (currently nginx), exposing port 80 (named `http`) (overridable via flags on creation, and updatable). This deployment
has and `envFrom` relationship to the `secret`, so any/all values in the secret will be mounted as environment variables in the
`deployment/pods`. A `service` is created with port `80` that maps to the `http` named port of the `deployment`, and an
`ingress` is created to point to that `service`s port.

Assuming you've taken care of the Prerequisites, this means your `traveling-whisper-123456` app will
(near) immediately be available at https://traveling-whisper-123456.yourdomain.com after creation!

## Prerequisites

You will need to have the following things set up to make use of this app:
* A kubernetes cluster + kubectl configured
* Deploy the nginx ingress controller: for ingress routing
    * This should have a public Load Balancer attached to it!
* Deploy CertManager: for automated SSL certificated via Let's Encrypt
* Point a wildcard DNS record to your Load Balancer: This lets *.yourdomain.com route to your ingress controller

## Repository

[https://github.com/k8ty-app/k8ty/](https://github.com/k8ty-app/k8ty/)
