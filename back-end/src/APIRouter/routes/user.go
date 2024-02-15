package routes

import (
	"zApi/src/controllers"
	"zApi/src/services"

	"github.com/gofiber/fiber/v2"
)

func NewUserRoutes(svc *services.UserService) *fiber.App {
	controller := controllers.NewUserController(svc)

	subRouter := fiber.New()

	subRouter.Get("/token", controller.ParseToken)
	subRouter.Post("/login", controller.Login)

	return subRouter
}
