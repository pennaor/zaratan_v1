package main

import (
	"fmt"
	"log"

	"zApi/src/APIRouter"
	"zApi/src/config"
	"zApi/src/database"
)

func main() {
	config.APIEnvironmentInit()

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	err = APIRouter.New(db).Listen(fmt.Sprintf("%s:%d", config.HOST, config.PORT))
	if err != nil {
		log.Fatal(err)
	}
}
