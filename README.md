# Create Micro React App

[![Build Status](https://travis-ci.com/matheusmr13/create-microfrontend-react-app.svg?branch=master)](https://travis-ci.com/matheusmr13/create-microfrontend-react-app)
[![Build Status](https://dev.azure.com/matheusmr13/create-microfrontend-react-app/_apis/build/status/matheusmr13.create-microfrontend-react-app?branchName=master)](https://dev.azure.com/matheusmr13/create-microfrontend-react-app/_build/latest?definitionId=2&branchName=master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=matheusmr13_create-microfrontend-react-app&metric=alert_status)](https://sonarcloud.io/dashboard?id=matheusmr13_create-microfrontend-react-app)

Create simple microfrontend architecture with tools like [Create React App](https://github.com/facebook/create-react-app).

<p align="center">
  <img src="icon.svg" width="40%">
</p>

## Quick Overview

```
  npx @cmra/cli create my-app --app --microfrontend
  cd my-app
  npm start
```

## What it does

It helps you create a simple application with microfrontend architecture with no build configuration.

### Core Features

- Microfrontend development made easy:

  - Boilerplate and pre configured architechture;

  - Mock all other microfrontends (refering to a stable environment) combined with hotreload on current microfrontend, allowing you to see the changes you make as you develop new feature on a specific module;

  - Choose to split microfrontends into multiple repositories;

- You just need something to host your static files and you are ready to go with a microfrontend app;

- All of this with [Create React App](https://github.com/facebook/create-react-app) beautiful configuration.

- Integrates easy with a simple management interface that helps you organizing your microfrontends.

## Service

Splited on marketplace-backend and marketplace-frontend packages.

It helps you organizing your application integrated with the best tools (like github), like a backoffice for your architechtur.
You can have a simple microfrontend architechture on your application, and deploy it easily with many options.
Check our [site](https://matheusmr13.github.io/create-micro-react-app) for a demo.

## CLI Docs

Contained on @cmra/cli package.

```
  npx @cmra/cli --help
  npx @cmra/cli start --help
  npx @cmra/cli build --help
  npx @cmra/cli create --help
```

Icon made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](https://www.flaticon.com/)

## Next steps

- Rename packages
  - Create "cmra" namespace
  - @cmra/cli -> "@cmra/cli"
  - react-microfrontend -> "@cmra/lib"
  - marketplace-frontend -> "@cmra/web"
  - marketplace-backend -> "@cmra/server"
  - export models from backend -> "@cmra/model"
- Make it easy to deploy
  - server -> create package to extend -> `import Server from '@cmra/server'; Server.run();`
  - frontend -> create package to extend -> `import Webapp from '@cmra/web'; await Webapp.build(); Server.addStatic('build');`
  - docker image with all together
- Permission
  - get things separate between users (currently works if you create your own environment)
- Deploy
  - Schedule deploy to date
  - Recurrent deploy
  - Integrations to publish final package to:
    - Amazon s3
- Package management integration, get packages from:
  - NPM
  - Amazon s3
  - Gitlab?
- Extends command line
  - Application template (create-micro-react-app --from <APPLICATION_UUID>)
  - CLI for general uses such as preparing a next deploy
- Flux between multiple namespaces
  - Define an order for each namespace (such as alpha->beta->main)
- Expand namespaces
  - Create hidden "next deploy preview"
  - Integrate react-microfrontend with setting namespaces
- Custom microfrontends
  - Set microfrontends meta infos (nav bar label? url? custom field)
  - Lazy loading
  - Changelog by version ()
- Notifications
  - Changes to next deploy on namespace
  - Next deploy started (and done)
  - Integrations:
    - slack
    - email
- Cannary deploy Vs Quality checks
  - Define some rules to get things checked and move to next deploy (really next to flux iniciative)
