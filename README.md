SFTOOMI - system for the operations of medical institutions

# Requirements

* Docker
* Angular CLI

# Installation

* Make your own .env file for docker config: `cp ./docker/.env.dist ./docker/.env` and set it up for you
* In project root directory: `cp ./.env ./.env.local` and set it up for you
* Build docker containers: `make up`
* Go to php container: `make shell`:
  * Install packages there: `composer install`
  * Make the database: `php bin/console doctrine:database:create`
  * Apply all migrations: `php bin/console doctrine:migrations:migrate`
* Go to [app/src/environment.ts](app/src/environments/environment.ts) and copy it to environment.development.ts and configure as you need
* In app folder: `ng serve`
* Go to link Angular CLI command provided you. 
