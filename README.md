# Create React App Microfrontend

[![Build Status](https://travis-ci.com/matheusmr13/cra-microfrontend.svg?branch=master)](https://travis-ci.com/matheusmr13/cra-microfrontend)

Create simple microfrontend architecture with tools like [Create React App](https://github.com/facebook/create-react-app).

## Quick Overview

  ```
    npx microfrontend-controller create my-app --app --microfrontend
    cd my-app
    npm start
  ```

## What it does

  It helps you create a simple application with microfrontend architecture with no build configuration.

  ### Core Features

  - Microfrontend development made easy:

    * Boilerplate and pre configured architecture;

    * Mock all other microfrontends (refering to a stable environment) combined with hotreload on current microfrontend, allowing you to see the changes you make as you develop new feature on a specific module;

    * Choose to split microfrontends into multiple repositories;

  - You just need something to host your files and you are ready to go with a microfrontend app;

  - All of this with [Create React App](https://github.com/facebook/create-react-app) beautiful configuration.


## CLI Docs

  ```
    npx microfrontend-controller --help
    npx microfrontend-controller start --help
    npx microfrontend-controller build --help
    npx microfrontend-controller create --help
  ```
