SFTOOMI - system for the operations of medical institutions

# Requirements

* Docker
* Angular CLI

# Installation

* Make your own .env file for docker config: `cp ./docker/.env.dist ./docker/.env` and set it up for you
* In project root directory: `cp ./.env ./.env.local` and set it up for you
* `cp app/src/environments/environment.ts app/src/environments/environment.development.ts` and configure it as you need
* Initialize an application: `make app-init`
* Initialize the domain: `make init-domain` (optional)
* Build the front: `make front-dev`
* Go to link Angular CLI provided you.
