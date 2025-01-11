up:
	docker-compose -f docker-compose.yml up -d
down:
	docker-compose -f docker-compose.yml down
start:
	docker-compose -f docker-compose.yml start
stop:
	docker-compose -f docker-compose.yml stop

shell:
	exec docker exec -it php bash
db:
	exec docker exec -it mysql bash
