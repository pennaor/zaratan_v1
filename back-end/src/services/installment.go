package services

import (
	"errors"

	"zApi/src/database"
	"zApi/src/models"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type InstallmentService struct {
	model          *models.InstallmentModel
	saleDetailsSvc *SaleDetailsService
}

func NewInstallmentService(model *models.InstallmentModel, SD *SaleDetailsService) *InstallmentService {
	return &InstallmentService{
		model:          model,
		saleDetailsSvc: SD,
	}
}

func (svc *InstallmentService) ReportInstallments(form ztypes.SaleForm) (*ztypes.SaleInstallments, *HttpError) {
	details, httpError := svc.saleDetailsSvc.ReportSaleDetails(form.Details)
	if httpError != nil {
		return nil, httpError
	}

	sale := ztypes.Sale{Details: *details}
	err := sale.ParseInstallments(*form.Installments)
	if err != nil {
		return nil, &HttpError{Code: fiber.StatusBadRequest, Err: err}
	}
	report := sale.GetInstallmentsReports()
	if report != nil {
		return nil, &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	return nil, nil
}

func (svc *InstallmentService) GetBySaleId(saleId uint64) (ztypes.Installments, *HttpError) {
	installments, err := svc.model.GetSaleInstallments(saleId)
	if err != nil {
		return []ztypes.Installment{}, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	return installments, nil
}

func (svc *InstallmentService) Delete(id uint64) error {
	if err := svc.model.Delete(id); err != nil {
		return err
	}

	return nil
}

func (svc *InstallmentService) DeleteBySaleId(saleId uint64) error {
	if err := svc.model.DeleteBySaleId(saleId); err != nil {
		return err
	}

	return nil
}

type InstallmentServiceTx struct {
	tx    *database.Transaction
	model *models.InstallmentModel
}

func (IS *InstallmentService) UseTx(tx *database.Transaction) *InstallmentServiceTx {
	return &InstallmentServiceTx{tx: tx, model: IS.model}
}

func (svc *InstallmentServiceTx) Create(saleId uint64, installment ztypes.Installment) (uint64, *HttpError) {
	if _, err := svc.model.UseTx(svc.tx).Create(saleId, installment); err != nil {
		return 0, ParseDBError(err)
	}

	return 0, nil
}

func (svc *InstallmentServiceTx) CreateMany(saleId uint64, installments []ztypes.Installment) *HttpError {
	if len(installments) == 0 {
		return &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: create installments needs one installment at least"),
		}
	}

	for i := 0; i < len(installments); i++ {
		if _, httpError := svc.Create(saleId, installments[i]); httpError != nil {
			return httpError
		}
	}

	return nil
}

func (svc *InstallmentServiceTx) UpdateById(installment ztypes.Installment) *HttpError {
	if err := svc.model.UseTx(svc.tx).UpdateBySaleId(installment); err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return nil
}

func (svc *InstallmentServiceTx) UpsertMany(saleId uint64, installments []ztypes.Installment) *HttpError {
	if len(installments) == 0 {
		return &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: upsert installments needs one installment at least"),
		}
	}

	for i := 0; i < len(installments); i++ {
		if installments[i].Id != nil {
			if httpError := svc.UpdateById(installments[i]); httpError != nil {
				return httpError
			}
		} else {
			if _, httpError := svc.Create(saleId, installments[i]); httpError != nil {
				return httpError
			}
		}
	}

	return nil
}
