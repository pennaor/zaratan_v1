package routes

import (
	"zApi/src/controllers"
	"zApi/src/middlewares"

	"github.com/gofiber/fiber/v2"
)

func NewSaleBuyersRoutes(controller *controllers.SalesBuyersController) *fiber.App {
	subRouter := fiber.New()

	subRouter.Use(middlewares.AuthenticateUser)

	subRouter.Post("/saleId::saleId/many", controller.AttachMany)
	subRouter.Delete("/saleId::saleId/buyerId::buyerId", controller.Detach)
	subRouter.Post("/saleId::saleId", controller.CreateAttachingBuyer)

	return subRouter
}
