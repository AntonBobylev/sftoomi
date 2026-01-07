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
  * Init the domain: `php bin/console app:init-domain`
  * Leave the container: `exit`
* Install front dependencies: `make front-init`
* Build the front: `make front-dev`
* Go to link Angular CLI provided you.

# Some known bugs after installation
* **nvm command doesn't want to install. Workaround: install it manually:**
  * `make shell`
  * `export NVM_DIR="/home/USERNAME/.nvm"` - Do not forget to change USERNAME to your username from docker/.env
  * `curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`
  * `source ~/.nvm/nvm.sh`
  * `nvm -v` - if it's ok the system will show you the version of the nvm
* **ng command doesn't want to install. Workaround: install it manually:**
  * `make shell`
  * `npm i -g @angular/cli`
  * `ng --version`  - if it's ok the system will show you the version of the nvm
