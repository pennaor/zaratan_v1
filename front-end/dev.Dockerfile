###########################
# installing dependencies #
###########################

FROM node:18.16-alpine

WORKDIR /front-end

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
