DOCKER_COMPOSE := docker-compose -f ./docker/docker-compose.yml

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

shell:
	@$(DOCKER_COMPOSE) exec -it php bash
db:
	@$(DOCKER_COMPOSE) exec -it mysql bash

db-create:
	@$(DOCKER_COMPOSE) exec -it php bin/console doctrine:database:create

front-init:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app i

front-dev:
	cd app && ng serve
