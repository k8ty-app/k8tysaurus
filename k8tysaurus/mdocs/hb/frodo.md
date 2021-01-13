---
title: Frodo
---

[GitHub Project](https://github.com/k8ty-app/frodo/)

Frodo is a simple app to help you turn your `application.conf` file into a `k8s-secret.yaml` file.

For example, if we have an `application.conf` file that looked like

```hocon
host = "0.0.0.0"
host = ${?HOST}
port = 9000
port = ${?PORT}

endpoint = "http://localhost:9001"
endpoint = ${?S3_ENDPOINT}
access-key = "MELVIN4MAVEN"
access-key = ${?S3_ACCESS_KEY}
secret-key = "MELVIN4MAVEN"
secret-key = ${?S3_SECRET_KEY}
bucket = "melvin.k8ty.app"
bucket = ${?S3_BUCKET}

pg-driver = "org.postgresql.Driver"
pg-url = "jdbc:postgresql://localhost:5432/postgres"
pg-url = ${?PG_URL}
pg-user = "postgres"
pg-user = ${?PG_USER}
pg-pass = "password"
pg-pass = ${?PG_PASS}
```

then our k8s `deployment.yaml` template might look like

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8ty-melvin
  namespace: k8ty-melvin
  labels:
    app: k8ty-melvin
  annotations:
    fluxcd.io/automated: "true"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: k8ty-melvin
  template:
    metadata:
      labels:
        app: k8ty-melvin
    spec:
      containers:
        - name: k8ty-melvin
          image: ghcr.io/k8ty-app/melvin:latest
          imagePullPolicy: Always
          stdin: true
          tty: true
          ports:
            - name: http
              containerPort: 9000
          env:
            - name: S3_ENDPOINT
              valueFrom:
                secretKeyRef:
                  name: k8ty-melvin
                  key: S3_ENDPOINT
            - name: S3_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: k8ty-melvin
                  key: S3_ACCESS_KEY
            - name: S3_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: k8ty-melvin
                  key: S3_SECRET_KEY
            - name: PG_URL
              valueFrom:
                secretKeyRef:
                  name: k8ty-melvin
                  key: PG_URL
            - name: PG_USER
              valueFrom:
                secretKeyRef:
                  name: k8ty-melvin
                  key: PG_USER
            - name: PG_PASS
              valueFrom:
                secretKeyRef:
                  name: k8ty-melvin
                  key: PG_PASS
          livenessProbe:
            httpGet:
              path: /_health
              port: 9000
          readinessProbe:
            httpGet:
              path: /_health
              port: 9000
          resources: { }
---
```

which means we will need to load a those secrets into kubernetes secret via something like

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: k8ty-melvin
  namespace: k8ty-melvin
data:
  S3_SECRET_KEY: ???
  PG_URL: ???
  PG_USER: ???
  S3_ACCESS_KEY: ???
  PG_PASS: ???
  S3_ENDPOINT: ???
```

where all those `???` are base64 encoded values for your secrets.

Frodo reads your application.conf file, looks for any lines containing `${?`, and then asks you
for the values. It will then base64 encode those, and print out the yaml template that you can adjust
and apply.

If you pass it a (relative) file path, it will only look for that file. If you pass it no arguments, it will look for 
`./src/main/resources/application.conf` and then `./src/main/resources/reference.conf`

Leaving a field blank will omit it from the output.

Here is an example of filled in values going through the above refernece file:

```yaml
HOST: localhost
PORT: 9000
S3_ENDPOINT: http://my.s3
S3_ACCESS_KEY: abc123
S3_SECRET_KEY: babyunme
S3_BUCKET: muh-bucket
PG_URL: jdbc:url
PG_USER: postgres
PG_PASS: password
---
apiVersion: v1
kind: Secret
metadata:
  name: secret
  namespace: default
data:
 S3_SECRET_KEY: YmFieXVubWU=
 HOST: bG9jYWxob3N0
 PG_URL: amRiYzp1cmw=
 S3_BUCKET: bXVoLWJ1Y2tldA==
 PORT: OTAwMA==
 PG_USER: cG9zdGdyZXM=
 S3_ACCESS_KEY: YWJjMTIz
 PG_PASS: cGFzc3dvcmQ=
 S3_ENDPOINT: aHR0cDovL215LnMz
 ```
