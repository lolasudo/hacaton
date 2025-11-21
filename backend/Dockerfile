FROM node:22.19.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

# Простая команда запуска без скриптов
CMD ["npm", "run", "start:dev"]