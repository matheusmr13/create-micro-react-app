# Create React App Microfrontend Examples


Example: 
A simple store, with some pages:

 - Products
 - Cart
 - User

All microfrontends assume that you have a common library or somthing to aggregate all packages.

## Multiple CRA into one (build time)

  Imagine this scenario where you want to create multiple frontends but do not want to recreate all build process

  Steps:

   - Build all child packages (microfrontends)
   - Build parent package (web app)
   - Mount a customized index.html with all packages scripts (import bundle)
   - If offline first, generate a service-worker.js after all packages set up

  Pros:
  
   - Simple way of isolating parts of your system 
   - Easy to develop

  Cons:
   
   - Needs to generate index.html after building all packages
   - Needs to deploy all parts at once


## Multiple CRA into one (runtime)

  Steps:

   - Build all apps (webapp and microfrontends) and host somewhere
   - Create some place to get all current microfrontends
      - could be a bucket with a json (filled by a automated CI) or a service (with endpoints to register and get microfrontends)
      - some json like
      ```
      {
        "cart": [
          "https://cart-cdn/**/*.chunk.js"
        ],
        "user": [
          "https://user-cdn/**/*.chunk.js"
        ]
      }
      ```
   - Web app know how to get this json and import all scripts (if web app made with react, react-helmet could be used)
   - if offline first, all scripts must be cached in some way

Pros:
 
   - Simple way of isolating parts of your system
   - Each frontend can be self hosted in any desired place

Cons:

   - 
