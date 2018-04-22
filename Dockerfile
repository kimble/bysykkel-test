FROM node:9.8.0
MAINTAINER Kim A. Betti

EXPOSE 3000

RUN mkdir /app

COPY ./package.json /app/package.json
COPY ./server.js /app/server.js
COPY ./src/ /app/src

RUN cd /app && npm install

ENTRYPOINT cd /app && node server.js
