package ztypes

import (
	"errors"
	"fmt"
	"math"

	"zApi/src/utils"
)

type saleReport struct {
	Overview            *string              `json:"overview,omitempty"`
	Details             *SaleDetailsReport   `json:"details,omitempty"`
	BuyersReports       *[]BuyerReport       `json:"buyers,omitempty"`
	InstallmentsReports *[]InstallmentReport `json:"installments,omitempty"`
}

func (SR *saleReport) hasInvalidField() bool {
	return SR.BuyersReports != nil ||
		SR.Details != nil ||
		SR.Overview != nil ||
		SR.InstallmentsReports != nil
}

func (S *Sale) GetInstallmentsReports() interface{} {
	if S.report == nil {
		return nil
	}

	return &struct {
		Overview *string              `json:"overview,omitempty"`
		Reports  *[]InstallmentReport `json:"reports,omitempty"`
	}{
		Overview: S.report.Overview,
		Reports:  S.report.InstallmentsReports,
	}
}

type Sale struct {
	Details      SaleDetails   `json:"details"`
	Buyers       Buyers        `json:"buyers"`
	Installments *Installments `json:"installments"`
	report       *saleReport
}

func (S *Sale) useSaleReport() *saleReport {
	if S.report == nil {
		S.report = new(saleReport)
	}
	return S.report
}

func (S *Sale) validateInstallmentsLength(installmentsLength float64) (*string, error) {
	if S.Details.InstallmentCount == nil {
		return nil, errors.New("sale has no installments or installmentCount")
	}

	diff := float64(*S.Details.InstallmentCount) - installmentsLength

	if diff > 0 {
		overview := fmt.Sprintf("Falta %v parcela(s)", math.Abs(diff))
		return &overview, nil
	}
	if diff < 0 {
		overview := fmt.Sprintf("Existe %v parcela(s) a mais", math.Abs(diff))
		return &overview, nil
	}

	return nil, nil
}

func (S *Sale) validateBalance(totalInstPrice float64) (*string, error) {
	if S.Details.Price == nil {
		return nil, errors.New("sale price is required")
	}

	salePrice := utils.RoundFloat(*S.Details.Price, 2)
	totalInstPrice = utils.RoundFloat(totalInstPrice, 2)

	if salePrice-totalInstPrice != 0 {
		overview := fmt.Sprintf(
			"Valor de venda difere do total do parcelamento:%v|%v",
			salePrice,
			totalInstPrice)
		return &overview, nil
	}

	return nil, nil
}

func (S *Sale) ParseInstallments(form []InstallmentForm) (err error) {
	installments := Installments{}
	reports := make([]InstallmentReport, len(form))
	paymentDateSet := make(map[string]struct{})
	totalInstPrice := 0.0

	for i := 0; i < len(form); i++ {
		installment := Installment{}
		if err := installment.ParseForm(form[i], S.Details); err != nil {
			return err
		}

		if installment.Price != nil {
			totalInstPrice += *installment.Price
		}

		reports[i] = *installment.Report

		if !installment.Report.HasInvalidField() {
			if _, has := paymentDateSet[*installment.PaymentDate]; has {
				reports[i].PaymentDate = "Data da parcela deve ser única"
			} else {
				paymentDateSet[*installment.PaymentDate] = struct{}{}
				installments = append(installments, installment)
			}
		}
	}

	if len(installments) != len(reports) {
		S.useSaleReport()
		S.report.InstallmentsReports = &reports
		return nil
	}

	overview, err := S.validateInstallmentsLength(float64(len(form)))
	if err != nil {
		return err
	}
	if overview == nil {
		overview, err = S.validateBalance(totalInstPrice)
		if err != nil {
			return err
		}
	}

	if overview != nil {
		if S.report != nil && S.report.Overview == nil {
			S.report.Overview = overview
		} else if S.report == nil {
			S.report = new(saleReport)
			S.report.Overview = overview
		}
	} else {
		S.Installments = &installments
	}

	return nil
}

func (S *Sale) ParseForm(form SaleForm) (*saleReport, error) {
	if len(form.Buyers) == 0 {
		return nil, errors.New("one buyer at least is required")
	}

	var err error
	S.report = new(saleReport)

	S.report.Details, err = S.Details.ParseForm(form.Details)
	if err != nil {
		return nil, err
	}

	if form.Installments != nil && len(*form.Installments) > 0 {
		if err = S.ParseInstallments(*form.Installments); err != nil {
			return nil, err
		}
	}

	S.report.BuyersReports, err = S.Buyers.ParseForm(form.Buyers)
	if err != nil {
		return nil, err
	}

	if S.report.hasInvalidField() {
		return S.report, err
	}

	S.report = nil

	return nil, nil
}
