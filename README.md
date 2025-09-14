SFTOOMI - system for the operations of medical institutions

# Requirements

* Docker
* Angular CLI

# Installation

* Make your own .env file for docker config: `cp ./docker/.env.dist ./docker/.env` and set it up for you
* In project root directory: `cp ./.env ./.env.local` and set it up for you
* Build docker containers: `make up`
* `cp app/src/environments/environment.ts app/src/environments/environment.development.ts` and configure it as you need
* Go to php container: `make shell`:
  * Install packages there: `composer install`
  * Make the database: `php bin/console doctrine:database:create`
  * Apply all migrations: `php bin/console doctrine:migrations:migrate`
  * Run the latest server command: `php bin/console app:init-domain`
  * `cd app && npm i && exit`
* `make front-dev`
* Go to link Angular CLI provided you. 
