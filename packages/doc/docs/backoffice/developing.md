---
id: developing
title: Developing
---

### Setup your environment

First of all, you will need a postgresql server to connect to.

If you are using aws s3 as your artifact's host, login in into aws cli and then startup your backoffice

Create a .env.development.local with some envs:

```
# Core configs

database_config='{"host":"my.host", "port": 5432, "username": "my-user", "password": "my-password", "database": "my-db}'
firebase_admin_config='FIREBASE_ADMIN_CONFIG_JSON' # https://firebase.google.com/docs/admin/setup#initialize_the_sdk
firebase_config='FIREBASE_CONFIG_JSON' # https://firebase.google.com/docs/web/setup#config-object

# AWS (needed only if you will use aws s3 as your artifact manager or to deploy some application)
aws_profile='my-profile'
AWS_SDK_LOAD_CONFIG=1 # needed to use a profile
AWS_ARTIFACTS_BUCKET='some-bucket-with-all-artifacts'
```

Run a script:

`./scripts/start.js`

Access your backoffice: http://localhost:3333/
