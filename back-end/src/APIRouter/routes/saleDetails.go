package routes

import (
	"zApi/src/controllers"
	"zApi/src/middlewares"

	"github.com/gofiber/fiber/v2"
)

func NewSaleDetailsRoutes(controller *controllers.SaleDetailsController) *fiber.App {
	subRouter := fiber.New()

	subRouter.Use(middlewares.AuthenticateUser)

	subRouter.Post("/report", controller.ReportSaleDetails)

	return subRouter
}
