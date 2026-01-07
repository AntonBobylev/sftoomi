DOCKER_COMPOSE := docker compose -f ./docker/docker-compose.yml

up:
	@$(DOCKER_COMPOSE) up -d
down:
	@$(DOCKER_COMPOSE) down
start:
	@$(DOCKER_COMPOSE) start
stop:
	@$(DOCKER_COMPOSE) stop
rebuild:
	@$(DOCKER_COMPOSE) up -d --build
rebuild-php:
	@$(DOCKER_COMPOSE) up -d --build php

shell:
	@$(DOCKER_COMPOSE) exec -it php bash
db:
	@$(DOCKER_COMPOSE) exec -it mysql bash

db-create:
	@$(DOCKER_COMPOSE) exec -it php bin/console doctrine:database:create

front-init:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app i

front-clear:
	@$(DOCKER_COMPOSE) exec -it php rm -rf ./app/node_modules ./app/.angular ./app/build

front-reinit:
	$(MAKE) front-clear && $(MAKE) front-init

front-dev:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run watch

front-build:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run build
