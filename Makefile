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
	@$(MAKE) front-reinit

.PHONY: rebuild-php
rebuild-php:
	@$(DOCKER_COMPOSE) up -d --build php

.PHONY: rebuild-node
rebuild-node:
	@$(DOCKER_COMPOSE) up -d --build node
	@$(MAKE) front-reinit

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
.PHONY: front-shell front-init front-clear front-reinit front-dev front-kill

front-shell:
	@$(DOCKER_COMPOSE) exec node sh

front-init:
	@echo "Installing frontend dependencies..."
	@$(DOCKER_COMPOSE) exec -u root node chown -R $${USER_ID:-1000}:$${GROUP_ID:-1000} /var/www/project/app
	@$(COMPOSE_EXEC) node npm install

front-clear:
	@echo "Cleaning frontend artifacts..."
	@$(MAKE) front-kill
	@$(COMPOSE_EXEC) node sh -c "rm -rf ./node_modules/* ./node_modules/.* 2>/dev/null || true; rm -rf ./.angular ./dist"

front-kill:
	@echo "Killing old frontend processes..."
	@$(DOCKER_COMPOSE) exec -u root node pkill -9 -f "ng serve" || true
	@$(DOCKER_COMPOSE) exec -u root node pkill -9 -f "npm run start" || true
	@$(DOCKER_COMPOSE) exec -u root node pkill -9 -f "node" || true

front-reinit: front-clear front-init

front-dev:
	@echo "Starting frontend dev server..."
	@$(MAKE) front-kill
	@$(DOCKER_COMPOSE) exec node npm run dev:hot-watch

front-lint:
	@echo "Running a linter..."
	@$(COMPOSE_EXEC) node npm run lint

front-lint-fix:
	@echo "Fixing code by a linter..."
	@$(COMPOSE_EXEC) node npm run lint:fix

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

## TESTS
.PHONY: run-tests run-front-tests run-front-unit-tests run-back-tests

run-tests: run-back-tests run-front-tests
	@echo "All tests completed successfully!"

run-front-tests: run-front-unit-tests
	@echo "All frontend tests completed!"

run-front-unit-tests:
	@$(COMPOSE_EXEC) node npm test

run-back-tests:
	@$(COMPOSE_EXEC) php php bin/phpunit --display-warnings
