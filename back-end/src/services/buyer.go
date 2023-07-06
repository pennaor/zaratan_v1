package services

import (
	"errors"

	"zApi/src/database"
	"zApi/src/models"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type BuyerService struct {
	model *models.BuyerModel
}

func NewBuyerService(model *models.BuyerModel) *BuyerService {
	return &BuyerService{
		model: model,
	}
}

func (svc *BuyerService) ReportBuyers(form ztypes.BuyersForm) (*ztypes.Buyers, *HttpError) {
	if len(form) == 0 {
		return nil, &HttpError{Code: fiber.StatusBadRequest, Err: errors.New("one buyer at least is required")}
	}

	buyers := ztypes.Buyers{}

	report, err := buyers.ParseForm(form)
	if err != nil {
		return nil, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	if report != nil {
		return nil, &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	return &buyers, nil
}

func (SB *BuyerService) GetAll() (ztypes.Buyers, *HttpError) {
	buyers, err := SB.model.GetAll()
	if err != nil {
		return ztypes.Buyers{}, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	return buyers, nil
}

func (svc *BuyerService) UpdateById(id uint64, form ztypes.BuyerForm) *HttpError {
	buyer := ztypes.Buyer{}

	report, err := buyer.ParseForm(form)
	if err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	if report != nil {
		return &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	if err := svc.model.UpdateById(id, buyer); err != nil {
		return ParseDBError(err)
	}

	return nil
}

type BuyerServiceTx struct {
	tx    *database.Transaction
	model *models.BuyerModel
}

func (BS *BuyerService) UseTx(tx *database.Transaction) *BuyerServiceTx {
	return &BuyerServiceTx{
		tx:    tx,
		model: BS.model,
	}
}

func (svc *BuyerServiceTx) Create(buyer ztypes.Buyer) (uint64, *HttpError) {
	id, err := svc.model.UseTx(svc.tx).Create(buyer)
	if err != nil {
		return 0, ParseDBError(err)
	}

	return uint64(id), nil
}

func (svc *BuyerServiceTx) UpdateById(buyer ztypes.Buyer) *HttpError {
	if buyer.Id == nil {
		return &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: update buyer needs id"),
		}
	}

	if err := svc.model.UseTx(svc.tx).UpdateById(buyer); err != nil {
		return ParseDBError(err)
	}

	return nil
}
