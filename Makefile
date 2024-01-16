dev:
	docker compose -f docker-compose.yml -f docker-compose-dev.yml  up --build
  
prod: 
		docker compose -f docker-compose.yml -f docker-compose-prod.yml up -d --build

stop: 
	docker compose -f docker-compose.yml -f docker-compose-dev.yml down && docker compose -f docker-compose.yml -f docker-compose-prod.yml down
