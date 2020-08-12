---
id: roadmap
title: Roadmap
---

This is not a promise of what is going to be implemented.
This is just a simple overview of cool things that could come up one day.

Have suggestions of new features? [Open an issue](https://github.com/matheusmr13/create-micro-react-app/issues/new) and/or [contribute](https://github.com/matheusmr13/create-micro-react-app/blob/master/CONTRIBUTING.md)!

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
