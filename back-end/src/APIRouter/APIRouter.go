package APIRouter

import (
	"database/sql"

	"zApi/src/APIRouter/routes"
	"zApi/src/controllers"
	"zApi/src/models"
	"zApi/src/services"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func New(DB *sql.DB) *fiber.App {
	models := models.NewModels(DB)
	services := services.NewServices(models)
	controllers := controllers.NewControllers(services)

	APIRouter := fiber.New()

	APIRouter.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
		AllowMethods: "*",
	}))

	APIRouter.Use(logger.New())

	APIRouter.Mount("/installment", routes.NewInstallmentRoutes(controllers.Installment))

	APIRouter.Mount("/buyer", routes.NewBuyerRoutes(controllers.Buyer))

	saleRoutes := routes.NewSaleRoutes(controllers.Sale)
	saleRoutes.Mount("/details", routes.NewSaleDetailsRoutes(controllers.SaleDetails))
	saleRoutes.Mount("/buyer", routes.NewSaleBuyersRoutes(controllers.SalesBuyers))
	APIRouter.Mount("/sale", saleRoutes)

	APIRouter.Mount("/terrain", routes.NewTerrainRoutes(services.Terrain))

	APIRouter.Mount("/user", routes.NewUserRoutes(services.User))

	return APIRouter
}
