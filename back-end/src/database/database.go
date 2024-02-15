package database

import (
	"database/sql"

	"zApi/src/config"

	_ "github.com/go-sql-driver/mysql"
)

func Connect() (*sql.DB, error) {
	zdb, err := sql.Open("mysql", config.MYSQL_URL)
	if err != nil {
		return nil, err
	}
	zdb.SetMaxOpenConns(5)
	zdb.SetMaxIdleConns(5)

	if err := zdb.Ping(); err != nil {
		return nil, err
	}

	return zdb, nil
}
