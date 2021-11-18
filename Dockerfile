FROM node:16-alpine

WORKDIR /usr/app

COPY ["package.json", "yarn.lock", ".env", "tsconfig.json", "./"]

RUN yarn

COPY src src

RUN yarn run build
