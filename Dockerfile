FROM node:16-alpine

WORKDIR /var/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY ["tsconfig.build.json", "tsconfig.json", "./"]
COPY ["src", "./src"]

RUN yarn build
CMD yarn start