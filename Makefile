DOCKER_COMPOSE := docker compose -f ./docker/docker-compose.yml

## DOCKER
.PHONY: up
up:
	@$(DOCKER_COMPOSE) up -d
.PHONY: down
down:
	@$(DOCKER_COMPOSE) down
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

# APPLICATION
.PHONY: app-init
app-init:
	$(MAKE) down && $(MAKE) up
	@echo "Waiting for PHP container to be ready..."
	@while ! $(DOCKER_COMPOSE) ps php | grep -q "Up"; do \
		sleep 1; \
	done
	@echo "Waiting for MySQL container to be ready..."
	@sleep 5
	@echo "Installing composer dependencies..."
	@if ! $(MAKE) composer-install; then \
		echo "Error: composer install failed"; \
		exit 1; \
	fi
	@echo "Creating database (if not exists)..."
	@if ! $(MAKE) db-create; then \
		echo "Warning: Database may already exist, continuing..."; \
	fi
	@echo "Running database migrations..."
	@if ! $(MAKE) db-migrate; then \
		echo "Error: Database migrations failed"; \
		exit 1; \
	fi
	@echo "Initializing the front"
	$(MAKE) front-reinit && $(MAKE) front-init
	@echo "Application initialization completed!"

## PHP
.PHONY: shell
shell:
	@$(DOCKER_COMPOSE) exec -it php bash
.PHONY: composer-install
composer-install:
	@$(DOCKER_COMPOSE) exec -it php composer install

## DATABASE
.PHONY: db
db:
	@$(DOCKER_COMPOSE) exec -it mysql bash
.PHONY: db-create
db-create:
	@$(DOCKER_COMPOSE) exec -it php php bin/console doctrine:database:create --if-not-exists || true
.PHONY: db-migrate
db-migrate:
	@$(DOCKER_COMPOSE) exec -T php php bin/console doctrine:migrations:migrate --no-interaction

## FRONT
.PHONY: front-init
front-init:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app i
.PHONY: front-clear
front-clear:
	@$(DOCKER_COMPOSE) exec -it php rm -rf ./app/node_modules ./app/.angular ./app/build
.PHONY: front-reinit
front-reinit:
	$(MAKE) front-clear && $(MAKE) front-init
.PHONY: front-build
front-build:
	@echo "Cleaning up old public/app..."
	@$(DOCKER_COMPOSE) exec -it php rm -rf ./public/app
	@echo "Building Angular application..."
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run build
	@echo "Frontend build deployed to public/app!"
.PHONY: front-dev
front-dev:
	@echo "Starting Angular with hot reload..."
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run dev:hot-watch
.PHONY: front-watch
front-watch:
	@echo "Starting Angular build in watch mode..."
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run dev:watch

## DOMAIN
.PHONY: domain-init
domain-init:
	@$(DOCKER_COMPOSE) exec -it php php bin/console app:init-domain
