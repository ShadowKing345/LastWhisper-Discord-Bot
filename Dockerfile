FROM node:16-alpine

WORKDIR /usr/app

COPY ["package.json", "package-lock.json", "./"]

RUN npm i --production=true --quiet

COPY . .

RUN npm run build
