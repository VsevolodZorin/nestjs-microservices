How to run the project:
open 5 terminal tabs
docker-compose -f docker-compose.yml -f docker-compose.development.yml up --build
cd libs/npm i && tsc
cd apps/api-gateway && npm run start:dev
cd apps/auth-microservice && npm run start:dev
cd apps/posts-microservice && npm run start:dev
