# Create React App Microfrontend

[![Build Status](https://travis-ci.com/matheusmr13/cra-microfrontend.svg?branch=master)](https://travis-ci.com/matheusmr13/cra-microfrontend)

Create simple microfrontend architecture with tools like [Create React App](https://github.com/facebook/create-react-app).

## Quick Overview

  ```
    npx microfrontend-controller create-app my-app
    npx microfrontend-controller create-microfrontend my-micro ./my-app
    cd my-app
    npm start
  ```

## What it does

  It helps you create a simple application with microfrontend architecture with no build configuration.

## CLI Docs

### build
  Build your module.

  `IS_MICROFRONTEND=true` Defines if you are building as microfrontend or base app

### start
  Build your module.

  `IS_MICROFRONTEND=true` Defines if you are starting as microfrontend or base app

### build-all
  Build all your modules and create a `build` folder containing all assets necessary to serve with microfrontend structure.



### start-mock
  Start your specific module simulating the current environment.

  Let's say your application is already deployed to `https://market.xyz`, it has a webapp and 3 other microfrontends. If you want to developed some feature on one of this 3 microfrontend, just create this script on your package json:

  ```
    "start-mock": "microfrontend-controller start-mock",
  ```

  and then: 
  ```
    npm start-mock https://market.xyz
  ```

  Access `http://localhost:3001` and you will have a environment with:
   - current webapp version
   - current 2 other microservices versions
   - a devserver running just your current microfrontend in development

### start-with-repo

### create-app

  Create a new app with one microfrontend.

  Example:

  `microfrontend-controller create-app my-app`

### create-microfrontend

  Create a new microfrontend on a specified app

  Example:
  
  `npx microfrontend-controller create-microfrontend my-micro ./my-app`

## Configuration Docs [IMPROVE]

 Create a file named `build-configuration.js` in your project's root:
 ```
  module.exports = () => ({
    shouldBuildPackages: true
  });
 ```


 ### shouldBuildPackages

  If set `true`, `build-all` will build all microfrontends in `./packaged`. This is recommended only if you want to build a quick application.

  The best aproach to this is to build your modules separated before mounting your final folder.

  First step:
   - Build each module
   - Save your build folder from each module

  Second step:
   - Get all your build folder and setup on a `builds` folder
   ```
     - project
     -- src
        ...
     -- builds
     --- webapp
     ---- index.html
           ...
     --- microfrontend1
           ...
     --- microfrontend2
           ...
   ```
   - Run `microfrontend-controller build-all` and `build` folder is made <3

  This is strategy is recommended to avoid building modules with no changes.




