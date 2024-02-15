package routes

import (
	"zApi/src/controllers"
	"zApi/src/middlewares"

	"github.com/gofiber/fiber/v2"
)

func NewSaleRoutes(sale *controllers.SaleController) *fiber.App {
	subRouter := fiber.New()

	subRouter.Use(middlewares.AuthenticateUser)

	subRouter.Post("/report", sale.ReportSale)
	subRouter.Delete("/:saleid/buyer/:buyerId", sale.DetachBuyer)

	return subRouter
}
