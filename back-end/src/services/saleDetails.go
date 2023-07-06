package services

import (
	"errors"

	"zApi/src/database"
	"zApi/src/models"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type SaleDetailsService struct {
	model *models.SaleDetailsModel
}

func NewSaleDetailsService(model *models.SaleDetailsModel) *SaleDetailsService {
	return &SaleDetailsService{
		model: model,
	}
}

type SaleDetailsServiceTx struct {
	tx    *database.Transaction
	model *models.SaleDetailsModel
}

func (SD *SaleDetailsService) UseTx(tx *database.Transaction) *SaleDetailsServiceTx {
	return &SaleDetailsServiceTx{
		tx:    tx,
		model: SD.model,
	}
}

func (svc *SaleDetailsService) ReportSaleDetails(form ztypes.SaleDetailsForm) (*ztypes.SaleDetails, *HttpError) {
	details := ztypes.SaleDetails{}

	report, err := details.ParseForm(form)
	if err != nil {
		return nil, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	if report != nil {
		return nil, &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	return &details, nil
}

func (svc *SaleDetailsService) GetByTerrainId(terrainId uint64) (*ztypes.SaleDetails, error) {
	return svc.model.GetByTerrainId(terrainId)
}

func (svc *SaleDetailsServiceTx) Create(details ztypes.SaleDetails) (uint64, *HttpError) {
	id, err := svc.model.UseTx(svc.tx).Create(details)
	if err != nil {
		return 0, ParseDBError(err)
	}

	return uint64(id), nil
}

func (svc *SaleDetailsServiceTx) UpdateById(details ztypes.SaleDetails) *HttpError {
	if details.Id == nil {
		return &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: update sale without id is not possible"),
		}
	}

	if err := svc.model.UseTx(svc.tx).UpdateById(details); err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return nil
}
