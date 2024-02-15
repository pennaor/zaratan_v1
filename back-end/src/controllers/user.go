package controllers

import (
	"zApi/src/authentication"
	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type UserController struct {
	service *services.UserService
}

func NewUserController(service *services.UserService) *UserController {
	return &UserController{service: service}
}

func (controller *UserController) ParseToken(c *fiber.Ctx) error {
	user, err := authentication.GetTokenUserData(c.Get("Authorization"))
	if err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	return c.Status(fiber.StatusOK).JSON(struct {
		Id    uint64 `json:"id"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}{
		Id:    user.Id,
		Email: user.Email,
		Name:  user.Name,
	})
}

func (controller *UserController) Login(c *fiber.Ctx) error {
	credentials := ztypes.User{}

	err := c.BodyParser(&credentials)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	foundUser, httpError := controller.service.Login(credentials)
	if httpError != nil {
		return c.Status(httpError.Code).SendString(httpError.Error())
	}

	return c.Status(fiber.StatusOK).JSON(foundUser)
}
