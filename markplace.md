# microfrontend-marketplace

# Setup your application

## Setup

1.  Create your repository on github
2.  `create-micro-react-app my-app -am`
3.  `cd my-app/packages/webapp`
4.  `npm run build`
5.  `microfrontend-marketplace publish`
6.  `cd ../microfrontend`
7.  `npm run build`
8.  `microfrontend-marketplace publish`

## Register your application

1. Login using github
2. Repositories -> Search for your repo -> Import -> packageName = webapp -> Import Button
3. Import New Microfrontend -> Search your repo again -> Import -> packageName = microfrontend -> Import Button
4. New deploy -> Choose versions -> deploy -> Go to `https://<YOUR_USERNAME>.github.io/<YOUR_REPO_NAME>/`

# Features

- Manage application and microfrontends deploy with github integration

  - A simple application would cost nothing thanks for github free public repositories and gh-pages

- Create multiple versions of your application in one single site

  - Rollout your changes progressively using multiple applications at once

- All of this using `create-micro-react-app` and `micro-react`
  - Easy to use and maintain

## Next steps

[ ] Permission - Separate application between users/company
[ ] Deploy - Schedule deploy
[ ] Deploy - Recurrent deploy with approval versions
[ ] New integrations - Integrate with gitlab (same as github if possible)
[ ] New integrations - Integrate with amazon s3 (get artifacts and publish them)
[ ] New integrations - Integrate with npm (get built packages from npm registry)
[ ] Microfrontend types and metainfos (eg: by url, by menu, by custom field)
[ ] Create a base library (with microfrontend-controller passing uuid and installing this lib)
[ ] Define flux between namespaces (alpha -> beta -> prod)
[ ] Cannary deploy based on some request that checks if it is all fine with app
