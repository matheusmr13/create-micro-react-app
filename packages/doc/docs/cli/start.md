---
id: start
title: start
---

## All on watch mode

### Mono repo

On your root project just use a script command on your `package.json`, specifing what project is the container.

```json
  "start": "cmra start -a webapp"
```

### Multi repo

Create a json specifing the path of all your packages, `microfrontends.json`:

```json
{
  "microfrontends": {
    "my-microfrontend1": "/path/to/microfrontend1/root",
    "my-microfrontend2": "/path/to/microfrontend2/root"
  },
  "app": {
    "my-webapp": "/path/to/app/root"
  }
}
```

On your root project just use a script command on your `package.json`, specifing config file.

Example:

```json
  "start": "cmra start -c microfrontends.json"
```

## Simulate production environment

(with some microfrontend on watch mode)

On your specific microfrontend, add a script to your `package.json`:

```json
  "start:prod": "cmra start -p https://myapp.site.com"
```
