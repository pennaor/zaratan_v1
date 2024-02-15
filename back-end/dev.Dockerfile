FROM golang:1.20-alpine

WORKDIR /back-end

RUN go install github.com/cosmtrek/air@latest

COPY . .

RUN go mod download

EXPOSE 3001

CMD ["air", "-c", ".air.toml"]
