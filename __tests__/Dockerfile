FROM node:18.16-alpine

RUN apk add --no-cache \
    chromium \
    chromium-lang

WORKDIR /__tests__

COPY ./__tests__ .

COPY ./sql/dev-db.sql ./sql/dev-db.sql

RUN npm install && chmod +x ./entrypoint.sh

ENV LANGUAGE=pt_BR CHROMIUM_BIN_PATH=/usr/bin/chromium-browser

ENTRYPOINT [ "./docker-entrypoint.sh" ]
