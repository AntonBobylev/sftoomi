DOCKER_COMPOSE := docker-compose -f ./docker/docker-compose.yml

up:
	@$(DOCKER_COMPOSE) up -d
down:
	@$(DOCKER_COMPOSE) down
start:
	@$(DOCKER_COMPOSE) start
stop:
	@$(DOCKER_COMPOSE) stop

shell:
	@$(DOCKER_COMPOSE) exec -it php bash
db:
	@$(DOCKER_COMPOSE) exec -it mysql bash
