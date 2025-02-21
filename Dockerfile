FROM node:18-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY src ./src
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json

ARG MONGO_URI

ENV MONGO_URI=$MONGO_URI

RUN echo "MONGO_URI=${MONGO_URI}" > .env

RUN npm i -g pnpm

RUN pnpm build

EXPOSE 8080

CMD ["node", "./dist/main"]