package routes

import (
	"zApi/src/controllers"

	"github.com/gofiber/fiber/v2"
)

func NewBuyerRoutes(controller *controllers.BuyerController) *fiber.App {
	subRouter := fiber.New()

	subRouter.Get("/", controller.GetAll)
	subRouter.Post("/report", controller.ReportBuyers)
	subRouter.Put("/:id", controller.UpdateById)

	return subRouter
}
