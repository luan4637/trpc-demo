# --------------- Development install ---------------
## add host
127.0.0.1 host.docker.internal

## start services
docker compose up -d localstack postgres

## setup
npm install

npm run migrate

## start server
npm run devserver

## start client
npm run dev

## run app
http://localhost:3000

username/password: luan4637@gmail.com/123456

# --------------- Docker compose install ---------------
## add host
127.0.0.1 host.docker.internal

## setup
npm install

npm run esbuild

npm run build

npm run migrate

## start server
docker compose up

## run app
http://localhost

username/password: luan4637@gmail.com/123456
