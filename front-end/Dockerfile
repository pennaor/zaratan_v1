######################################################
# first stage - build app binary file - large image #
######################################################

FROM node:18.16-alpine AS builder

ARG REACT_APP_API_PROTOCOL=http REACT_APP_API_HOST=localhost REACT_APP_API_PORT=3001

WORKDIR /front-end

COPY . .

RUN echo REACT_APP_API_PROTOCOL=${REACT_APP_API_PROTOCOL} REACT_APP_API_HOST=${REACT_APP_API_HOST} REACT_APP_API_PORT=${REACT_APP_API_PORT} >> .env \
  && npm install \
  && npm run build

###############################################################
# second stage - obtain and run binary file - very small image  #
###############################################################

FROM nginx:1.24-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /front-end/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
