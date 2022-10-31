FROM node:16-alpine

WORKDIR /usr/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --production

COPY build build
COPY ../config/ProjectConfiguration.json config/ProjectConfiguration.json