SFTOOMI - system for the operations of medical institutions

---

### Requirements

* Docker

---

### Installation

* Make your own .env file for docker config: `cp ./docker/.env.dist ./docker/.env` and set it up for you
* In project root directory: `cp ./.env ./.env.local` and set it up for you
* `cp app/src/environments/environment.ts app/src/environments/environment.development.ts` and configure it as you need
* Initialize an application: `make app-init`
* Initialize the domain: `make init-domain` (optional)
* Build the front: `make front-dev`
* Go to link Angular CLI provided you.

---

### DEV:

There are few options to run the application in the DEV mode:
* `make front-dev` - runs angular application in watch mode with hot reload option (build files store in the RAM).
* `make front-watch` - runs angular application in watch mode (build files store in the filesystem).

---

### PRODUCTION

The files will be minified, built and moved to the ./public/app directory: <br />
`make front-build`
