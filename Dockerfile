FROM node:16-alpine

WORKDIR /usr/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY [".env", "tsconfig.json", "./"]
COPY src src

RUN yarn run build
