package routes

import (
	"zApi/src/controllers"
	"zApi/src/middlewares"
	"zApi/src/services"

	"github.com/gofiber/fiber/v2"
)

func NewTerrainRoutes(terrainSvc *services.TerrainService) *fiber.App {
	controller := controllers.NewTerrainController(terrainSvc)

	subRouter := fiber.New()

	subRouter.Use(middlewares.AuthenticateUser)

	subRouter.Post("/details/report", controller.ReportTerrainDetails)
	subRouter.Get("/:id", controller.GetByTerrainId)
	subRouter.Get("/", controller.GetAll)
	subRouter.Post("/", controller.Create)
	subRouter.Put("/", controller.UpdateById)
	subRouter.Delete("/:id", controller.DeleteById)

	return subRouter
}
