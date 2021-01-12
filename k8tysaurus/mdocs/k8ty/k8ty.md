---
id: k8ty
title: About
slug: /
---

Hello, and welcome to k8ty.app! This site is part personal blog + part docs for some projects - mainly published under
my GitHub Org: k8ty-app. You'll find that most things are Scala and/or Kubernetes related 😁. This particular section of the site goes over some of the dev-ops details of running all this stuff - perhaps you will find it helpful if you're looking to do the same!

As a note about the name of the site, it's a play on Kubernetes and Cats. Kubernetes is often referred to by its [numeronym](https://en.wikipedia.org/wiki/Numeronym) `k8s`. Domestic cat's are some times referred to as kitty-cats. I've named my domesticated k8s cluster k8ty cat, with it's collection of k8ty apps 🤪

If you have any question/comments/feedback/pull-requests feel free to send me a message via EMail (mark@k8ty.app), [Twitter](https://twitter.com/alterationx10), or [GitHub](https://github.com/k8ty-app)!

## Tech Review

Here is a general list of the tech stack used:

### Deployment Hosting

* [Firebase](https://firebase.google.com/) (mainly) for static sites.
* [Kubernetes via DigitalOcean](https://www.digitalocean.com/products/kubernetes/)
* [Digital Ocean Spaces](https://www.digitalocean.com/products/spaces/) for object storage (S3)
* [Managed Databases via DigitalOcean](https://www.digitalocean.com/products/managed-databases/)

Most everything else is shoved into the k8s cluster 🤣. I'll occasionally lean on [Google Cloud Platform](https://cloud.google.com/) if needed. I don't run in all on GCP due to cost. Backed mostly by DigitalOcean, this stack costs ~$50/month - on GCP it was closer to $150.

### Code/Artifact Hosting

* [GitHub](https://github.com/k8ty-app/) for code.
* [GitHub Container Registry](https://github.com/orgs/k8ty-app/packages) for Docker images.
* [Maven Artifacts via Melvin](https://melvin.k8ty.app/)  _coming soon_ 🙃.

### CI/CD + Deployment

* [Drone IO](https://drone.k8ty.app/k8ty-app/k8tysaurus/) for most CI runner tasks (self hosted in k8s).
* [GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions) when it's convenient 🤷‍♀️.
* [Flux](https://fluxcd.io/) for managing k8s deployments of our own apps
* [Helm](https://helm.sh/) for managing k8s deployments of other peoples apps

### Language/Frameworks/Libraries

Wonderful Scala things you'll likely see in use here:

* [Scala](https://www.scala-lang.org/)
* [TypeLevel Projects](https://typelevel.org/projects/) in general.
* [ZIO Projects](https://zio.dev/docs/ecosystem/ecosystem) in general.
* [akka](https://akka.io/) in general.
* [http4s](https://github.com/http4s/http4s) for web servers apps.
* [akka-http](https://doc.akka.io/docs/akka-http/current/index.html) for web servers apps.
* [caliban](https://ghostdogpr.github.io/caliban/) for GraphQL server apps.

Other things that aren't Scala related, but are still wonderful:

* [Docusaurus](https://v2.docusaurus.io/) - What this site is built with!
* [node.js](https://nodejs.org/en/)
* [TypeScript](https://www.typescriptlang.org/)
* [Svelte](https://svelte.dev/)
* [React](https://reactjs.org/)

You'll come to find I haven't settled on a static aesthetic of any particular CSS framework 😆.

### Other Backing Services Worth Mentioning

* [nginx](https://www.nginx.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [Redis](https://redis.io/)
* [RabbitMQ](https://www.rabbitmq.com/)
