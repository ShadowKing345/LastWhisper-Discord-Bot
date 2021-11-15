FROM node:16-alpine

WORKDIR /usr/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY ["src/", "tsconfig.json", "./"]

RUN yarn run build
