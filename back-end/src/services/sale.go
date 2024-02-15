package services

import (
	"errors"

	"zApi/src/database"
	"zApi/src/models"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type SaleService struct {
	DetailsSvc     *SaleDetailsService
	SalesBuyersSvc *SalesBuyersService
	InstallmentSvc *InstallmentService
}

func NewSaleService(M *models.SaleModel, SD *SaleDetailsService, I *InstallmentService, SB *SalesBuyersService) *SaleService {
	return &SaleService{
		DetailsSvc:     SD,
		InstallmentSvc: I,
		SalesBuyersSvc: SB,
	}
}

func (svc *SaleService) ReportSale(form ztypes.SaleForm) *HttpError {
	sale := ztypes.Sale{}

	report, err := sale.ParseForm(form)
	if err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	if report != nil {
		return &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	return nil
}

func (svc *SaleService) GetAndSetSale(terrain *ztypes.Terrain) *HttpError {
	if terrain.Sale == nil || terrain.Sale.Details.Id == nil {
		return nil
	}

	buyers, httpError := svc.SalesBuyersSvc.GetSaleBuyers(*terrain.Sale.Details.Id)
	if httpError != nil {
		return httpError
	}

	terrain.Sale.Buyers = buyers

	installments, httpError := svc.InstallmentSvc.GetBySaleId(*terrain.Sale.Details.Id)
	if httpError != nil {
		return httpError
	}

	if len(installments) == 0 {
		terrain.Sale.Installments = nil
	} else {
		terrain.Sale.Installments = &installments
	}

	return nil
}

type SaleServiceTx struct {
	tx             *database.Transaction
	DetailsSvc     *SaleDetailsService
	SalesBuyersSvc *SalesBuyersService
	InstallmentSvc *InstallmentService
}

func (SS *SaleService) UseTx(tx *database.Transaction) *SaleServiceTx {
	return &SaleServiceTx{
		tx:             tx,
		DetailsSvc:     SS.DetailsSvc,
		SalesBuyersSvc: SS.SalesBuyersSvc,
		InstallmentSvc: SS.InstallmentSvc,
	}
}

func (saleSvc *SaleServiceTx) Create(sale ztypes.Sale) (uint64, *HttpError) {
	if sale.Details.TerrainId == nil {
		return 0, &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: create sale details without terrain id is not possible"),
		}
	}

	saleId, httpError := saleSvc.DetailsSvc.UseTx(saleSvc.tx).Create(sale.Details)
	if httpError != nil {
		return 0, httpError
	}

	if httpError = saleSvc.SalesBuyersSvc.UseTx(saleSvc.tx).UpsertMany(saleId, sale.Buyers); httpError != nil {
		return 0, httpError
	}

	if sale.Installments != nil {
		if httpError = saleSvc.InstallmentSvc.UseTx(saleSvc.tx).CreateMany(saleId, *sale.Installments); httpError != nil {
			return 0, httpError
		}
	}

	return saleId, nil
}

func (saleSvc *SaleServiceTx) UpsertByTerrainId(terrainId uint64, sale ztypes.Sale) *HttpError {
	if sale.Details.Id == nil {
		if _, httpError := saleSvc.Create(sale); httpError != nil {
			return httpError
		}
	} else {
		if httpError := saleSvc.DetailsSvc.UseTx(saleSvc.tx).UpdateById(sale.Details); httpError != nil {
			return httpError
		}

		if httpError := saleSvc.SalesBuyersSvc.UseTx(saleSvc.tx).UpsertMany(*sale.Details.Id, sale.Buyers); httpError != nil {
			return httpError
		}

		if sale.Installments != nil {
			if httpError := saleSvc.InstallmentSvc.UseTx(saleSvc.tx).UpsertMany(*sale.Details.Id, *sale.Installments); httpError != nil {
				return httpError
			}
		}
	}

	return nil
}
