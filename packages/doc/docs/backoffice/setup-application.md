---
id: setup-application
title: Setup application
---

Once we have a **Create Micro React App** backoffice up and running, access it and configure your application/microfrontends:

- Click on "Applications" menu item;
- Click on "New" button;
- Fill up your application's name and container's package name (eg: `webapp`);
- Once in your application's detail page, you should be able to setup your "integration type" and "destination";
  - Integration type: which infrastructure your application is going to be deployed at, eg: amazon s3, github pages, etc;
  - Destination: where your application should be deployed at. If you chose amazon s3 as your infrastructure, you should choose which bucket its going to be deployed at.
- Setup your container microfrontend (click on "Edit" inside microfrontend's card):
  - Integration type: same as above, but point at where your release artifact is at;
  - Origin: where your artifacts are located at (if you are using amazon s3, this list will show folders inside AWS_ARTIFACTS_BUCKET environnement);
  - Click on "Save" and then on "Sync Versions" to fetch current released versions for your container.
- You are good to go. Click on deploy and your destination should be updated (: (if you are curious about what happens when you click this button, check ["how it works" doc](https://matheusmr13.github.io/create-micro-react-app/docs/how-it-works))

These steps above got you up and running with a simple webapp without any microfrontends connected. Let's setup your first microfrontend?

- Go to your application's details page;
- Fill up microfrontend info (very similar to above step where you setup webapp's container);
- Go back to your application and deploy it!
