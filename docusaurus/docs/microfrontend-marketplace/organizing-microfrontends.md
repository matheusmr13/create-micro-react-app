---
id: organizing-microfrontends
title: Organizing your microfrontends
---

A way you can organize your application:

Divide your users in groups. Each group must have some examples of all your user types to assure that all namespaces test all your features.

Create namespaces with each user group, something like:

- Alpha: 5%
- Beta: 15%
- Stable: 30%
- Production: 50%

When you finish developing your microfrontend changes, update its latest version.
Schedule your application deploy window to the period where your users rarely uses your system.
Lets suppose these days are: monday, tuesday and wednesday.

If some of your microfrontends has a new version to be deployed, every chosen day will check any new versions to deploy to next namespace.
To promote a version to another namespace, someone has to check some metrics and then say that all went fine, allowing this version to follow its path.

Micro A -> v1
Micro B -> v1
Micro C -> v1

Alpha -> Av1 | Bv1 | Cv1
Beta -> Av1 | Bv1 | Cv1
Stable -> Av1 | Bv1 | Cv1
Production -> Av1 | Bv1 | Cv1

Monday

- New A version (v2).
- Alpha updates -> Av2 | Bv1 | Cv1

Tuesday

- Ask if everything went well on Alpha
- Someone says it went fine
- Beta updates -> Av2 | Bv1 | Cv1

Wedneday

- New C version (v2)
- Alpha updates -> Av2 | Bv1 | Cv2
- Ask if everything went well on Beta

...

Monday

- Someone says it went fine
- Stable updates -> Av2 | Bv1 | Cv1
- Beta updatee -> Av2 | Bv1 | Cv2

Tuesday

- Ask if everything went well on Stable
- Someone says it went fine
- Production updates -> Av2 | Bv1 | Cv1
