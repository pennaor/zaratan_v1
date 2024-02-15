package services

import (
	"errors"
	"net/http"

	"zApi/src/authentication"
	"zApi/src/models"
	"zApi/src/ztypes"
)

type UserService struct {
	model *models.UserModel
}

func NewUserService(model *models.UserModel) *UserService {
	return &UserService{model: model}
}

func (service *UserService) Login(credentials ztypes.User) (ztypes.User, *HttpError) {
	if credentials.Email == "" || credentials.Password == "" {
		return ztypes.User{}, &HttpError{Code: http.StatusBadRequest, Err: errors.New("email and password is required")}
	}

	foundUser, err := service.model.GetByCredentials(credentials.Email, credentials.Password)
	if err != nil {
		return ztypes.User{}, &HttpError{Code: http.StatusInternalServerError, Err: err}
	}

	if foundUser.Id == 0 {
		return ztypes.User{}, &HttpError{Code: http.StatusUnauthorized, Err: errors.New("user not found")}
	}

	foundUser.Token, err = authentication.CreateToken(foundUser)
	if err != nil {
		return ztypes.User{}, &HttpError{Code: http.StatusInternalServerError, Err: err}
	}

	return foundUser, nil
}
