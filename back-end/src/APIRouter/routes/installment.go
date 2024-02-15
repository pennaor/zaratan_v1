package routes

import (
	"zApi/src/controllers"
	"zApi/src/middlewares"

	"github.com/gofiber/fiber/v2"
)

func NewInstallmentRoutes(controller *controllers.InstallmentController) *fiber.App {
	subRouter := fiber.New()

	subRouter.Use(middlewares.AuthenticateUser)

	subRouter.Post("/report", controller.ReportInstallments)
	subRouter.Delete("/sale/:id", controller.DeleteBySaleId)
	subRouter.Delete("/:id", controller.Delete)

	return subRouter
}
