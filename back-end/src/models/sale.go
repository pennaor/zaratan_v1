package models

import (
	"database/sql"
)

type SaleModel struct {
	DB               *sql.DB
	SaleDetailsModel *SaleDetailsModel
	SalesBuyersModel *SalesBuyersModel
	InstallmentModel *InstallmentModel
}

func NewSaleModel(db *sql.DB) *SaleModel {
	return &SaleModel{
		DB:               db,
		SaleDetailsModel: NewSaleDetailsModel(db),
		SalesBuyersModel: NewSalesBuyersModel(db),
		InstallmentModel: NewInstallmentModel(db),
	}
}

// func (model *SaleModel) GetByTerrain(terrain *ztypes.Terrain) (err error) {
// 	if terrain == nil || terrain.Sale == nil {
// 		return nil
// 	}

// 	terrain.Sale.Buyers, err = model.SalesBuyersModel.GetSaleBuyers(*terrain.Sale.Details.Id)
// 	if err != nil {
// 		return err
// 	}

// 	terrain.Sale.Installments, err = model.InstallmentModel.GetSaleInstallments(*terrain.Sale.Details.Id)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }

// func (model *SaleModel) GetByTerrains(terrains []ztypes.Terrain) error {
// 	for i := 0; i < len(terrains); i++ {
// 		terrain := (terrains)[i]
// 		if err := model.GetByTerrain(&terrain); err != nil {
// 			return err
// 		}
// 	}

// 	return nil
// }
