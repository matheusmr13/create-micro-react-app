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

# Next steps

## Permissions

[ ] Only application owners can manage them
[ ]

## Deploy

[ ] Schedule deploy
[ ] Recurrent deploy with approval versions
[ ]

## Integrations

[ ] Integrate with gitlab
[ ] Integrate with npm (get built packages from npm registry)

## New big features

[ ] Microfrontend types and metainfos (eg: by url, by menu, by custom field)
[ ] Namespaces (multiple application versions with differente microfrontend versions)
[ ] Create a base library (with microfrontend-controller passing uuid and installing this lib)
[ ] Define flux between namespaces (alpha -> beta -> prod)
