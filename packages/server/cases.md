# microfrontend-marketplace

## Actors

[WAD] => WebApp Dev

[MFD] => MicroFrontend Dev

[SYS] => System

# Fluxogram

## Setup

[WAD] Create repo X

[WAD] `> create-micro-react-app my-app`

[WAD] Login with github on **micro-marketplace**

[SYS] Get repos from user

[WAD] Choose repo X as **application**

[SYS] Create `application`

[WAD] `> micro-marketplace publish`

[SYS] Setup container version

## Plugin creation

[MFD] Create repo Y

[MFD] `> create-micro-react-app my-micro`

[MFD] Login with github on **micro-marketplace**

[SYS] Get repos from user

[MFD] Choose repo Y as **microfrontend** and a **application**

[MFD] `> micro-marketplace publish`

[SYS] Upload version artifact to `versions` branch in a folder like `/versions/1.0.0`

[SYS] Create new **version** for this **microfrontend**

## Deploy

[SYS] Get all versions from all microfrontend repositories

[SYS] Package with `microfrontend-controller build -p`
