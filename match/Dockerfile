FROM node:10.15-alpine

WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install

COPY . /app

RUN yarn migrate:latest
RUN yarn seed

CMD yarn start
