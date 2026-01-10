DOCKER_COMPOSE := docker compose -f ./docker/docker-compose.yml

## DOCKER
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

# APPLICATION
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
shell:
	@$(DOCKER_COMPOSE) exec -it php bash
composer-install:
	@$(DOCKER_COMPOSE) exec -it php composer install

## DATABASE
db:
	@$(DOCKER_COMPOSE) exec -it mysql bash
db-create:
	@$(DOCKER_COMPOSE) exec -it php php bin/console doctrine:database:create --if-not-exists || true
db-migrate:
	@$(DOCKER_COMPOSE) exec -T php php bin/console doctrine:migrations:migrate --no-interaction

## FRONT
front-init:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app i
front-clear:
	@$(DOCKER_COMPOSE) exec -it php rm -rf ./app/node_modules ./app/.angular ./app/build
front-reinit:
	$(MAKE) front-clear && $(MAKE) front-init
front-build:
	@echo "Building Angular application..."
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run build
	@echo "Cleaning up old public/app..."
	@$(DOCKER_COMPOSE) exec -it php rm -rf ./public/app
	@echo "Copying build to public/app..."
	@$(DOCKER_COMPOSE) exec -it php mkdir -p ./public/app
	@$(DOCKER_COMPOSE) exec -it php bash -c "cp -r ./app/build/browser/* ./public/app/"
	@echo "Frontend build deployed to public/app!"
front-dev:
	@$(DOCKER_COMPOSE) exec -it php npm --prefix app run watch

## DOMAIN
domain-init:
	@$(DOCKER_COMPOSE) exec -it php php bin/console app:init-domain
