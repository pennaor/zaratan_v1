package ztypes

import (
	"errors"
	"reflect"
	"strconv"
	"time"

	"zApi/src/utils"
)

type InstallmentReport struct {
	Price       string `json:"price"`
	PaymentDate string `json:"paymentDate"`
	Progress    string `json:"progress"`
}

func (IR *InstallmentReport) HasInvalidField() bool {
	hasInvalidField := false
	r := reflect.ValueOf(IR).Elem()

	for i := 0; i < r.NumField(); i++ {
		report := r.Field(i).Interface()
		if report != "" {
			hasInvalidField = true
		}
	}

	return hasInvalidField
}

type Installment struct {
	Id          *uint64            `json:"id"`
	SaleId      *uint64            `json:"saleId"`
	Price       *float64           `json:"price"`
	PaymentDate *string            `json:"paymentDate"`
	Progress    *string            `json:"progress"`
	Report      *InstallmentReport `json:"report,omitempty"`
}

func (I *Installment) setProgress(input, saleProgress string) {
	if input != "Pendente" && input != "Quitado" && input != "Adiado" {
		I.Report.Progress = "Progresso deve ser Pendente, Quitado ou Adiado"
		return
	}

	if input == "Pendente" && saleProgress == "Fechado" {
		I.Report.Progress = "Venda está fechada. Progresso deve ser Quitado"
		return
	}

	I.Progress = &input
}

func (I *Installment) setPrice(input string) {
	var (
		price float64
		err   error
	)

	price, err = strconv.ParseFloat(input, 64)
	if err != nil {
		I.Report.Price = "Valor da parcela precisa ser número positivo"
		return
	}
	if price == 0 {
		I.Report.Price = "Valor da parcela não pode ser 0"
		return
	}
	if price < 0 {
		I.Report.Price = "Valor da parcela não pode ser negativo"
		return
	}

	I.Price = &price
}

func (I *Installment) setId(input string) error {
	if input != "" {
		id, err := strconv.ParseUint(input, 10, 64)
		if err != nil || id == 0 {
			return errors.New("installment does not have valid id")
		}
		I.Id = &id
	}

	return nil
}

func (I *Installment) setSaleId(input string) error {
	if input != "" {
		id, err := strconv.ParseUint(input, 10, 64)
		if err != nil || id == 0 {
			return errors.New("installment does not have valid sale id")
		}
		I.SaleId = &id
	}

	return nil
}

func (I *Installment) setPaymentDate(input string, saleDetails SaleDetails) {
	const HALF_DAY_SECS = 43200

	instDate, invalidMsg := utils.ParseDate(input)
	if invalidMsg != "" {
		I.Report.PaymentDate = invalidMsg
		return
	}

	openAtDate, err := time.Parse("2006-01-02", *saleDetails.OpenAt)
	if err == nil && (openAtDate.Unix()-instDate.Unix()) >= HALF_DAY_SECS {
		I.Report.PaymentDate = "Parcela não pode datar antes da abertura da venda"
		return
	}

	closeAtDate, err := time.Parse("2006-01-02", *saleDetails.CloseAt)
	if err == nil && (instDate.Unix()-closeAtDate.Unix()) >= HALF_DAY_SECS {
		I.Report.PaymentDate = "Parcela não pode datar depois do fechamento da venda"
		return
	}

	I.PaymentDate = &input
}

type Installments []Installment

func (I *Installment) ParseForm(form InstallmentForm, saleDetails SaleDetails) (err error) {
	I.Report = new(InstallmentReport)

	if err = I.setId(form.Id); err != nil {
		return err
	}

	if err = I.setSaleId(form.Id); err != nil {
		return err
	}

	I.setProgress(form.Progress, *saleDetails.Progress)

	I.setPaymentDate(form.PaymentDate, saleDetails)

	I.setPrice(form.Price)

	return nil
}
