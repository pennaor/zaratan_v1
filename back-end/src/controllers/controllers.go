package controllers

import "zApi/src/services"

type Controllers struct {
	Sale        *SaleController
	SaleDetails *SaleDetailsController
	SalesBuyers *SalesBuyersController
	Buyer       *BuyerController
	Installment *InstallmentController
	Terrain     *TerrainController
}

func NewControllers(svcs *services.Services) *Controllers {
	return &Controllers{
		Sale:        NewSaleController(svcs.Sale),
		SaleDetails: NewSaleDetailsController(svcs.SaleDetails),
		SalesBuyers: NewSalesBuyersController(svcs.Sale.SalesBuyersSvc),
		Buyer:       NewBuyerController(svcs.Buyer),
		Installment: NewInstallmentController(svcs.Installment),
		Terrain:     NewTerrainController(svcs.Terrain),
	}
}
