package models

import (
	"database/sql"

	"zApi/src/ztypes"
)

type UserModel struct {
	DB *sql.DB
}

func NewUserModel(db *sql.DB) *UserModel {
	return &UserModel{DB: db}
}

func (u *UserModel) GetByCredentials(email, password string) (ztypes.User, error) {
	rows, err := u.DB.Query(`
		SELECT 
			id, name, email
		FROM 
			users
		WHERE 
			email = ? AND password = ?
	`,
		email, password,
	)
	if err != nil {
		return ztypes.User{}, err
	}
	defer rows.Close()

	user := ztypes.User{}
	if rows.Next() {
		if err := rows.Scan(&user.Id, &user.Name, &user.Email); err != nil {
			return ztypes.User{}, err
		}
	}

	return user, nil
}
