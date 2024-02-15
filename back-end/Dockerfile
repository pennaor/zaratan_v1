######################################################
# first stage - build app binary file - large image  #
######################################################

FROM golang:1.20-alpine3.17 AS builder

WORKDIR /go/src/zaratan-back-end

COPY . .

RUN go build -o api

#################################################################
# second stage - obtain and run binary file - very small image  #
#################################################################

FROM alpine:3.17

WORKDIR /back-end

COPY --from=builder /go/src/zaratan-back-end/api .

EXPOSE 3001

ENTRYPOINT [ "./api" ]
