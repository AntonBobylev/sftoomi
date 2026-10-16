<div align="center">

# SFTOOMI
### System For The Operations Of Medical Institutions

![logo](app/public/graphics/sftoomi-logo.png)

</div>

---

### Requirements

* Docker

---

### Installation

* Make your own .env file for docker config: `cp ./docker/.env.dist ./docker/.env` and set it up for you
* In project root directory: `cp ./.env ./.env.local` and set it up for you
* Initialize an application: `make app-init`
* Initialize the domain: `make init-domain` (optional)
* Start the frontend dev server: `make front-dev`
* An application will be available at localhost:{YOUR_SERVER_PORT}.

---

### DEV:

There are few options to run the application in the DEV mode:
* `make front-dev` - runs angular application in watch mode with hot reload option (build files store in the RAM).
* `make front-watch` - runs angular application in watch mode (build files store in the filesystem).

---

### TESTS:

You can run tests using the following `make` commands:
- `make run-tests` — runs all project tests (both backend and frontend).
- `make front-tests` — runs all frontend tests.
- `make front-unit-tests` — runs frontend unit tests (Vitest).

---

### PRODUCTION

The files will be minified, built and moved to the ./public/app directory: <br />
`make front-build`
