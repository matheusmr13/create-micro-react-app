---
id: build-and-deploy
title: Build and Deploy
---

We recommend the following process to build and deploy your application:

## First build

Build all your modules separately, saving dist output somewhere where you can retrieve.

To build a webapp module (that will be the container to all other microfrontends):

```bash
  @cmra/cli build -s
```

To build all other microfrontends:

```bash
  @cmra/cli build
```

## Then package

In a separate process, choose which version of each microfrontend you would like to deploy.
Get all files from previous step and put it in a folder named `builds`. It should look something like:

```
- builds
 - webapp
  - index.html
  - ...
 - package1
  - index.html
  - ...
 - package2
  - index.html
  - ...
 - ...
```

and then run:

```bash
  @cmra/cli build -p webapp
```

## Finally deploy

Upload `build` folder generated to some static files host (like s3 or even github pages).
