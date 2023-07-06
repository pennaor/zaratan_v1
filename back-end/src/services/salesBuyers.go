package services

import (
	"errors"

	"zApi/src/database"
	"zApi/src/models"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type SalesBuyersService struct {
	model    *models.SalesBuyersModel
	BuyerSvc *BuyerService
}

func NewSalesBuyersService(model *models.SalesBuyersModel, buyerSvc *BuyerService) *SalesBuyersService {
	return &SalesBuyersService{
		model:    model,
		BuyerSvc: buyerSvc,
	}
}

func (SB *SalesBuyersService) SaleHasBuyer(saleId, buyerId uint64) (bool, *HttpError) {
	has, err := SB.model.SaleHasBuyer(saleId, buyerId)
	if err != nil {
		return false, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	return has, nil
}

func (SB *SalesBuyersService) GetSaleBuyers(saleId uint64) (ztypes.Buyers, *HttpError) {
	buyers, err := SB.model.GetSaleBuyers(saleId)
	if err != nil {
		return ztypes.Buyers{}, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	return buyers, nil
}

func (SB *SalesBuyersService) Attach(saleId, buyerId uint64) *HttpError {
	if err := SB.model.Attach(saleId, buyerId); err != nil {
		return ParseDBError(err)
	}
	return nil
}

func (SB *SalesBuyersService) AttachMany(saleId uint64, buyersIds []uint64) *HttpError {
	var (
		statusCode int
		reports    = make([]string, len(buyersIds))
	)

	tx, err := database.NewTx(SB.model.DB)
	if err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	defer tx.RollBack()

	for i := 0; i < len(buyersIds); i++ {
		if httpError := SB.Attach(saleId, buyersIds[i]); httpError != nil {
			if statusCode != fiber.StatusInternalServerError {
				statusCode = httpError.Code
			}
			reports[i] = httpError.Error()
		}
	}

	if statusCode > 0 {
		return &HttpError{Code: statusCode, UserReport: reports}
	}

	if err = tx.Commit(); err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return nil
}

func (SB *SalesBuyersService) Detach(saleId, buyerId uint64) *HttpError {
	buyers, httpError := SB.GetSaleBuyers(saleId)
	if httpError != nil {
		return httpError
	}

	if len(buyers) == 0 {
		return &HttpError{
			Code: fiber.StatusNotFound,
			Err:  errors.New("sale or buyer does not exists"),
		}
	}
	if len(buyers) == 1 {
		return &HttpError{
			Code:       fiber.StatusUnprocessableEntity,
			UserReport: "Venda precisa possuir ao menos um comprador. Registre outro comprador para então diassociá-lo",
		}
	}

	if _, err := SB.model.Detach(saleId, buyerId); err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return nil
}

func (SB *SalesBuyersService) CreateAttachingBuyer(saleId uint64, form ztypes.BuyerForm) (uint64, *HttpError) {
	buyer := ztypes.Buyer{}

	report, err := buyer.ParseForm(form)
	if err != nil {
		return 0, &HttpError{Code: fiber.StatusBadRequest, Err: err}
	}
	if report != nil {
		return 0, &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	tx, err := database.NewTx(SB.model.DB)
	if err != nil {
		return 0, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	defer tx.RollBack()

	buyerId, httpError := SB.UseTx(tx).CreateAttachingBuyer(saleId, buyer)
	if httpError != nil {
		return 0, httpError
	}

	if err := tx.Commit(); err != nil {
		return 0, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return buyerId, nil
}

type SalesBuyersServiceTx struct {
	tx             *database.Transaction
	model          *models.SalesBuyersModel
	salesBuyersSvc *SalesBuyersService
	buyerSvc       *BuyerService
}

func (SB *SalesBuyersService) UseTx(tx *database.Transaction) *SalesBuyersServiceTx {
	return &SalesBuyersServiceTx{
		tx:             tx,
		model:          SB.model,
		buyerSvc:       SB.BuyerSvc,
		salesBuyersSvc: SB,
	}
}

func (SB *SalesBuyersServiceTx) Attach(saleId, buyerId uint64) *HttpError {
	if err := SB.model.UseTx(SB.tx).Attach(saleId, buyerId); err != nil {
		return ParseDBError(err)
	}
	return nil
}

func (salesBuyersSvc *SalesBuyersServiceTx) CreateAttachingBuyer(saleId uint64, buyer ztypes.Buyer) (uint64, *HttpError) {
	buyerId, httpError := salesBuyersSvc.buyerSvc.UseTx(salesBuyersSvc.tx).Create(buyer)
	if httpError != nil {
		return 0, httpError
	}

	if httpError = salesBuyersSvc.Attach(saleId, buyerId); httpError != nil {
		return 0, httpError
	}

	return buyerId, nil
}

func (svc *SalesBuyersServiceTx) CreateMany(saleId uint64, buyers ztypes.Buyers) *HttpError {
	if len(buyers) == 0 {
		return &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: upsert sales buyers needs one buyer at least"),
		}
	}

	for i := 0; i < len(buyers); i++ {
		if buyers[i].Id == nil {
			if _, httpError := svc.CreateAttachingBuyer(saleId, buyers[i]); httpError != nil {
				return httpError
			}
		} else {
			if httpError := svc.Attach(saleId, *buyers[i].Id); httpError != nil {
				return httpError
			}
		}
	}

	return nil
}

func (svc *SalesBuyersServiceTx) UpsertMany(saleId uint64, buyers ztypes.Buyers) *HttpError {
	if len(buyers) == 0 {
		return &HttpError{
			Code: fiber.StatusInternalServerError,
			Err:  errors.New("transaction: upsert sale buyers needs one buyer at least"),
		}
	}

	for i := 0; i < len(buyers); i++ {
		if buyers[i].Id != nil {
			if httpError := svc.buyerSvc.UseTx(svc.tx).UpdateById(buyers[i]); httpError != nil {
				return httpError
			}
			hasSale, httpError := svc.salesBuyersSvc.SaleHasBuyer(saleId, *buyers[i].Id)
			if httpError != nil {
				return httpError
			}
			if !hasSale {
				if httpError := svc.Attach(saleId, *buyers[i].Id); httpError != nil {
					return httpError
				}
			}
		} else {
			if _, httpError := svc.CreateAttachingBuyer(saleId, buyers[i]); httpError != nil {
				return httpError
			}
		}
	}

	return nil
}
