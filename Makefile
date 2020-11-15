default: help

up:
	docker-compose up -d

down:
	docker-compose down

destroy: down

stop:
	docker-compose stop

start:
	docker-compose up -d
	npm run start-dev

ssh-db: ## Enters the postgres container
	@docker-compose exec postgres /bin/bash

pg-cli: ## Enter the postgres database
	@docker-compose exec postgres psql -U postgres -d connector

db: pg-cli

pg-cli-test: ## Enter the postgres database
	@docker-compose exec postgres_test psql -U postgres -d connector_test

help: ## This help message
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' -e 's/:.*#/: #/' | column -t -s '##'
