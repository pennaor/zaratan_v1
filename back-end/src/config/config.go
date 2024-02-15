package config

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

var (
	MYSQL_URL      string
	PORT           int
	HOST           string
	CORS_ORIGIN    string
	JWT_SECRET_KEY []byte
)

func APIEnvironmentInit() {
	var err error

	if !strings.Contains(os.Getenv("API_ENV"), "docker") {
		if err = godotenv.Load(); err != nil {
			log.Fatal(err)
		}
	}

	PORT, err = strconv.Atoi(os.Getenv("API_PORT"))
	if err != nil {
		log.Fatal(err)
	}

	HOST = os.Getenv("API_HOST")

	MYSQL_URL = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_HOST"),
		os.Getenv("MYSQL_PORT"),
		os.Getenv("MYSQL_DATABASE"),
	)

	CORS_ORIGIN = os.Getenv("CORS_ORIGIN")

	JWT_SECRET_KEY = []byte(os.Getenv("JWT_SECRET_KEY"))
}
