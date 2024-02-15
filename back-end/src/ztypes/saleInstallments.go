package ztypes

import (
	"errors"
	"time"

	"zApi/src/utils"
)

type SaleInstallments struct {
	Overview       string              `json:"-"`
	Installments   *Installments       `json:"-"`
	SaleDetails    SaleDetails         `json:"-"`
	Reports        []InstallmentReport `json:"-"`
	AreValid       bool                `json:"-"`
	TotalPrice     float64             `json:"-"`
	PaymentDateSet map[string]struct{} `json:"-"`
}

func NewSaleInstallments(details SaleDetails) (*SaleInstallments, error) {
	if details.OpenAt == nil || details.CloseAt == nil || details.Progress == nil {
		return nil, errors.New("new sale installments error: sale details is invalid")
	}

	return &SaleInstallments{
		Installments:   &Installments{},
		Reports:        make([]InstallmentReport, 0),
		AreValid:       false,
		TotalPrice:     0,
		PaymentDateSet: make(map[string]struct{}),
		SaleDetails:    details,
	}, nil
}

func (SI *SaleInstallments) setInstallmentPaymentDate(inst *Installment, input string) {
	const HALF_DAY_SECS = 43200

	instDate, invalidMsg := utils.ParseDate(input)
	if invalidMsg != "" {
		inst.Report.PaymentDate = invalidMsg
		return
	}

	openAtDate, err := time.Parse("2006-01-02", *SI.SaleDetails.OpenAt)
	if err == nil && (openAtDate.Unix()-instDate.Unix()) >= HALF_DAY_SECS {
		inst.Report.PaymentDate = "Parcela não pode datar antes da abertura da venda"
		return
	}

	closeAtDate, err := time.Parse("2006-01-02", *SI.SaleDetails.CloseAt)
	if err == nil && (instDate.Unix()-closeAtDate.Unix()) >= HALF_DAY_SECS {
		inst.Report.PaymentDate = "Parcela não pode datar depois do fechamento da venda"
		return
	}

	if _, has := SI.PaymentDateSet[input]; has {
		inst.Report.PaymentDate = "Data da parcela deve ser única"
		return
	}
	SI.PaymentDateSet[input] = struct{}{}

	inst.PaymentDate = &input
}

func (SI *SaleInstallments) ParseForm(input *InstallmentsForm) (err error) {
	if input == nil || *SI.SaleDetails.PaymentType == "Vista" {
		SI.Overview = "Vendas pagas a vista não possuem parcelamento"
		return
	}

	forms := *input

	for i := 0; i < len(forms); i++ {
		var installment Installment
		installment.Report = new(InstallmentReport)

		if err = installment.setId(forms[i].Id); err != nil {
			return err
		}

		if err = installment.setSaleId(forms[i].Id); err != nil {
			return err
		}

		installment.setProgress(forms[i].Progress, *SI.SaleDetails.Progress)

		SI.setInstallmentPaymentDate(&installment, forms[i].PaymentDate)

		installment.setPrice(forms[i].Price)
		if installment.Price != nil {
			SI.TotalPrice += *installment.Price
		}

		if !installment.Report.HasInvalidField() {
			*SI.Installments = append(*SI.Installments, installment)
		}

		SI.Reports = append(SI.Reports, *installment.Report)
	}

	if len(*SI.Installments) != len(forms) {
		SI.Installments = nil
	}

	return nil
}
