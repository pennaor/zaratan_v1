package models

import "database/sql"

type Models struct {
	Terrain        *TerrainModel
	TerrainDetails *TerrainDetailsModel
	Sale           *SaleModel
	SaleDetails    *SaleDetailsModel
	Buyer          *BuyerModel
	SaleBuyers     *SalesBuyersModel
	Installment    *InstallmentModel
	User           *UserModel
}

func NewModels(DB *sql.DB) *Models {
	return &Models{
		Terrain:        NewTerrainModel(DB),
		TerrainDetails: NewTerrainDetailsModel(DB),
		Sale:           NewSaleModel(DB),
		SaleDetails:    NewSaleDetailsModel(DB),
		Buyer:          NewBuyerModel(DB),
		SaleBuyers:     NewSalesBuyersModel(DB),
		Installment:    NewInstallmentModel(DB),
		User:           NewUserModel(DB),
	}
}
