package authentication

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"zApi/src/config"
	"zApi/src/ztypes"

	jwt "github.com/dgrijalva/jwt-go"
)

func getJwtSecret(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("unexpected sign method: %v", token.Header["alg"])
	}
	return config.JWT_SECRET_KEY, nil
}

func CreateToken(user ztypes.User) (string, error) {
	permissions := jwt.MapClaims{}
	permissions["userId"] = user.Id
	permissions["email"] = user.Email
	permissions["name"] = user.Name
	permissions["exp"] = time.Now().Add(time.Hour * 24).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, permissions)
	return token.SignedString(config.JWT_SECRET_KEY)
}

func ValidateToken(token string) (*jwt.Token, error) {
	jwtToken, err := jwt.Parse(token, getJwtSecret)
	if err != nil {
		return nil, err
	}
	return jwtToken, nil
}

func GetTokenUserData(str string) (ztypes.User, error) {
	token, err := ValidateToken(str)
	if err != nil {
		return ztypes.User{}, err
	}

	if permissions, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userId, err := strconv.ParseUint(fmt.Sprintf("%.0f", permissions["userId"]), 10, 64)
		if err != nil || userId == 0 {
			return ztypes.User{}, err
		}

		userEmail, ok := permissions["email"].(string)
		if !ok {
			return ztypes.User{}, errors.New("invalid user token email")
		}

		userName, ok := permissions["name"].(string)
		if !ok {
			return ztypes.User{}, errors.New("invalid user token name")
		}

		return ztypes.User{Id: userId, Email: userEmail, Name: userName}, nil
	}

	return ztypes.User{}, errors.New("invalid token")
}
