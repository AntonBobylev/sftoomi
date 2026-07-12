DOCKER_COMPOSE := docker compose -f ./docker/docker-compose.yml
INTERACTIVE := $(shell [ -t 0 ] && echo "-it" || echo "-T")
COMPOSE_EXEC := $(DOCKER_COMPOSE) exec $(INTERACTIVE)

## DOCKER
.PHONY: up
up:
	@$(DOCKER_COMPOSE) up -d

.PHONY: down
down:
	@$(DOCKER_COMPOSE) down --remove-orphans

.PHONY: start
start:
	@$(DOCKER_COMPOSE) start

.PHONY: stop
stop:
	@$(DOCKER_COMPOSE) stop

.PHONY: rebuild
rebuild:
	@$(DOCKER_COMPOSE) up -d --build

.PHONY: rebuild-php
rebuild-php:
	@$(DOCKER_COMPOSE) up -d --build php

.PHONY: rebuild-node
rebuild-node:
	@$(DOCKER_COMPOSE) up -d --build node

# APPLICATION
.PHONY: app-init
app-init: up wait-db composer-install db-migrate front-reinit
	@echo "Application initialization completed!"

.PHONY: app-sync-permissions
app-sync-permissions:
	@$(COMPOSE_EXEC) php php bin/console app:sync-permissions

## PHP
.PHONY: shell
shell:
	@$(DOCKER_COMPOSE) exec php bash

.PHONY: composer-install
composer-install:
	@echo "Installing composer dependencies..."
	@$(COMPOSE_EXEC) php composer install --no-interaction --optimize-autoloader

.PHONY: messenger-start
messenger-start:
	@echo "Running messenger..."
	@$(COMPOSE_EXEC) php php bin/console messenger:consume -vv

## REDIS
.PHONY: redis-monitor
redis-monitor:
	@$(COMPOSE_EXEC) redis redis-cli monitor | grep -v "workers.restart_requested_timestamp"
.PHONY: redis-clear-cache
redis-clear-cache:
	@echo "Clearing redis cache..."
	@$(COMPOSE_EXEC) redis redis-cli FLUSHALL

## DATABASE
.PHONY: db-shell
db-shell:
	@$(COMPOSE_EXEC) mysql mysql -u root -p

.PHONY: wait-db
wait-db:
	@echo "Waiting for MySQL to be ready..."
	@$(COMPOSE_EXEC) mysql sh -c 'until mysqladmin ping -h localhost --silent; do sleep 1; echo "retrying..."; done'
	@echo "MySQL is up!"

.PHONY: db-create
db-create:
	@echo "Creating database..."
	@$(COMPOSE_EXEC) php php bin/console doctrine:database:create --if-not-exists

.PHONY: db-migrate
db-migrate: db-create
	@echo "Running migrations..."
	@$(COMPOSE_EXEC) php php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
	$(MAKE) app-sync-permissions

## FRONT
.PHONY: front-shell front-init front-clear front-reinit

front-shell:
	@$(DOCKER_COMPOSE) exec node sh

front-init:
	@echo "Installing npm dependencies..."
	@$(COMPOSE_EXEC) node npm install

front-clear:
	@echo "Cleaning frontend artifacts..."
	@$(COMPOSE_EXEC) node rm -rf ./node_modules ./.angular ./dist

front-reinit: front-clear front-init

## DOMAIN
.PHONY: domain-init
domain-init:
	@$(COMPOSE_EXEC) php php bin/console app:init-domain

## --- LOGS ---
.PHONY: logs logs-nginx logs-php logs-mysql logs-redis

logs:
	@$(DOCKER_COMPOSE) logs -f --tail=100

logs-nginx:
	@$(DOCKER_COMPOSE) logs -f --tail=100 server

logs-node:
	@$(DOCKER_COMPOSE) logs -f --tail=100 node

logs-php:
	@$(DOCKER_COMPOSE) logs -f --tail=100 php

logs-mysql:
	@$(DOCKER_COMPOSE) logs -f --tail=100 mysql

logs-redis:
	@$(DOCKER_COMPOSE) logs -f --tail=100 redis
