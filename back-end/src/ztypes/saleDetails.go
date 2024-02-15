package ztypes

import (
	"errors"
	"reflect"
	"strconv"
	"time"

	"zApi/src/utils"
)

type SaleDetailsReport struct {
	OpenAt           string `json:"openAt"`
	CloseAt          string `json:"closeAt"`
	InstallmentCount string `json:"installmentCount"`
	Price            string `json:"price"`
	DownPayment      string `json:"downPayment"`
	PaymentType      string `json:"paymentType"`
	Progress         string `json:"progress"`
}

func (SDR *SaleDetailsReport) HasInvalidField() bool {
	hasInvalidField := false
	r := reflect.ValueOf(SDR).Elem()

	for i := 0; i < r.NumField(); i++ {
		report := r.Field(i).Interface()
		if report != "" {
			hasInvalidField = true
		}
	}

	return hasInvalidField
}

type SaleDetails struct {
	Id               *uint64  `json:"id,omitempty"`
	TerrainId        *uint64  `json:"terrainId,omitempty"`
	OpenAt           *string  `json:"openAt"`
	CloseAt          *string  `json:"closeAt"`
	InstallmentCount *uint64  `json:"installmentCount"`
	Price            *float64 `json:"price"`
	DownPayment      *float64 `json:"downPayment"`
	PaymentType      *string  `json:"paymentType"`
	Progress         *string  `json:"progress"`
	Report           *SaleDetailsReport
}

func (details *SaleDetails) SetDates(openAt string, closeAt string) {
	openAtDate, openInvalidMsg := utils.ParseDate(openAt)
	if openInvalidMsg == "" && openAtDate.UnixMilli() > time.Now().UnixMilli() {
		openInvalidMsg = "Data não pode ser no futuro"
	}
	closeAtDate, closeInvalidMsg := utils.ParseDate(closeAt)
	if openInvalidMsg != "" || closeInvalidMsg != "" {
		details.Report.OpenAt = openInvalidMsg
		details.Report.CloseAt = closeInvalidMsg
		return
	}

	if openAtDate.UnixMilli() > closeAtDate.UnixMilli() {
		details.Report.OpenAt = "Data de abertura deve ser igual ou anterior a data de encerramento"
		details.Report.CloseAt = "Data de encerramento deve ser igual ou posterior a de abertura"
		return
	}

	details.OpenAt = &openAt
	details.CloseAt = &closeAt
}

func (D *SaleDetails) SetPaymentType(paymentType, installmentCount string) {
	if paymentType != "Vista" && paymentType != "Parcelado" {
		D.Report.PaymentType = "Forma de pagamento deve ser Vista ou Parcelado"
		return
	}

	count, err := strconv.ParseUint(installmentCount, 10, 64)
	if err != nil {
		D.Report.InstallmentCount = "Número de parcelas precisa ser número inteiro positivo"
		return
	}
	if paymentType == "Parcelado" && count < 2 {
		D.Report.InstallmentCount = "Número de parcelas precisa ser no mínimo 2"
		return
	}

	D.InstallmentCount = &count
	D.PaymentType = &paymentType
}

func (D *SaleDetails) setId(input string) error {
	if input != "" {
		id, err := strconv.ParseUint(input, 10, 64)
		if err != nil || id == 0 {
			return errors.New("sale details does not have valid id")
		}
		D.Id = &id
	}

	return nil
}

func (D *SaleDetails) setTerrainId(input string) error {
	if D.TerrainId == nil && input != "" {
		id, err := strconv.ParseUint(input, 10, 64)
		if err != nil || id == 0 {
			return errors.New("sale details does not have valid terrain id")
		}
		D.TerrainId = &id
	}

	return nil
}

func (D *SaleDetails) SetProgress(input string) {
	if input != "Aberto" && input != "Fechado" {
		D.Report.Progress = "Progresso deve ser Aberto ou Fechado"
		return
	}

	D.Progress = &input
}

func (D *SaleDetails) setPrice(input string) {
	price, err := strconv.ParseFloat(input, 64)
	if err != nil || price <= 0 {
		D.Report.Price = "Preço precisa ser número positivo maior que zero"
		return
	}
	D.Price = &price
}

func (D *SaleDetails) setDownPayment(input string) {
	downPayment, err := strconv.ParseFloat(input, 64)
	if err != nil || downPayment <= 0 {
		D.Report.DownPayment = "Sinal precisa ser número positivo maior que zero"
		return
	}
	D.DownPayment = &downPayment
}

func (D *SaleDetails) ParseForm(form SaleDetailsForm) (*SaleDetailsReport, error) {
	D.Report = new(SaleDetailsReport)

	if err := D.setId(form.Id); err != nil {
		return nil, err
	}

	if err := D.setTerrainId(form.TerrainId); err != nil {
		return nil, err
	}

	D.SetProgress(form.Progress)
	D.SetDates(form.OpenAt, form.CloseAt)
	D.SetPaymentType(form.PaymentType, form.InstallmentCount)
	D.setPrice(form.Price)
	D.setDownPayment(form.DownPayment)

	if D.Report.HasInvalidField() {
		return D.Report, nil
	}

	D.Report = nil

	return nil, nil
}
