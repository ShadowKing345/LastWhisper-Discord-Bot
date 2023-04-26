FROM node:19-alpine

WORKDIR /var/app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --prod

COPY ["tsconfig.json", "./"]
COPY ["src", "./src"]

RUN yarn build
CMD yarn start