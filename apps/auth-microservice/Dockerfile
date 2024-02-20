FROM node:21.6.1-alpine

WORKDIR /app

EXPOSE 4000

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
