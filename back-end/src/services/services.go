package services

import (
	"zApi/src/models"

	"github.com/gofiber/fiber/v2"
)

var ErrHttpCode = map[string]int{
	"DUPLICATE": fiber.StatusConflict,
}

type Services struct {
	Terrain     *TerrainService
	Sale        *SaleService
	SaleDetails *SaleDetailsService
	Buyer       *BuyerService
	SalesBuyers *SalesBuyersService
	Installment *InstallmentService
	User        *UserService
}

func NewServices(Models *models.Models) *Services {
	userService := NewUserService(Models.User)
	buyerService := NewBuyerService(Models.Buyer)
	saleDetailsService := NewSaleDetailsService(Models.SaleDetails)
	installmentService := NewInstallmentService(Models.Installment, saleDetailsService)
	saleBuyersService := NewSalesBuyersService(Models.SaleBuyers, buyerService)
	saleService := NewSaleService(Models.Sale, saleDetailsService, installmentService, saleBuyersService)
	terrainService := NewTerrainService(Models.Terrain, saleService)

	return &Services{
		User:        userService,
		Buyer:       buyerService,
		SaleDetails: saleDetailsService,
		Installment: installmentService,
		SalesBuyers: saleBuyersService,
		Sale:        saleService,
		Terrain:     terrainService,
	}
}
