package ztypes

import (
	"errors"
	"reflect"
	"strconv"
	"unicode/utf8"
)

type BuyerReport struct {
	FullName      string `json:"fullName"`
	Cpf           string `json:"cpf"`
	Cnpj          string `json:"cnpj"`
	LandLinePhone string `json:"landLinePhone"`
	MobilePhone   string `json:"mobilePhone"`
	Email         string `json:"email"`
	Address       string `json:"address"`
	City          string `json:"city"`
	State         string `json:"state"`
	Cep           string `json:"cep"`
}

func (BR *BuyerReport) HasInvalidField() bool {
	hasInvalidField := false
	r := reflect.ValueOf(BR).Elem()

	for i := 0; i < r.NumField(); i++ {
		if report := r.Field(i).Interface(); report != "" {
			hasInvalidField = true
		}
	}

	return hasInvalidField
}

type Buyer struct {
	Id            *uint64 `json:"id"`
	FullName      *string `json:"fullName"`
	Cpf           *string `json:"cpf"`
	Cnpj          *string `json:"cnpj"`
	LandLinePhone *string `json:"landLinePhone"`
	MobilePhone   *string `json:"mobilePhone"`
	Email         *string `json:"email"`
	Address       *string `json:"address"`
	City          *string `json:"city"`
	State         *string `json:"state"`
	Cep           *string `json:"cep"`
	report        *BuyerReport
}

func (B *Buyer) setFullName(name string) {
	if utf8.RuneCountInString(name) < 12 {
		B.report.FullName = "Nome completo deve possuir ao menos 12 caracteres"
		return
	}
	if utf8.RuneCountInString(name) > 80 {
		B.report.FullName = "Nome completo deve possuir até 80 caracteres"
		return
	}

	B.FullName = &name
}

func (B *Buyer) setRegister(cpf, cnpj string) {
	if cnpj == "" {
		if utf8.RuneCountInString(cpf) > 0 {
			if utf8.RuneCountInString(cpf) == 14 {
				B.Cpf = &cpf
				return
			}
			B.report.Cpf = "CPF deve possuir formato '000.000.000-00'"
			return
		}
	}

	if cpf == "" {
		if utf8.RuneCountInString(cnpj) > 0 {
			if utf8.RuneCountInString(cnpj) == 18 {
				B.Cnpj = &cnpj
				return
			}
			B.report.Cnpj = "CNPJ deve possuir formato '00.000.000/0000-00'"
			return
		}
	}

	B.report.Cpf = "Comprador deve possuir CPF ou CNPJ"
	B.report.Cnpj = "Comprador deve possuir CPF ou CNPJ"
}

func (B *Buyer) setAdress(input string) {
	if input != "" && utf8.RuneCountInString(input) > 125 {
		B.report.Address = "Endereço deve possuir até 125 caracteres"
		return
	}

	B.Address = &input
}

func (B *Buyer) setCity(input string) {
	if input != "" && utf8.RuneCountInString(input) > 20 {
		B.report.City = "Cidade deve possuir até 20 caracteres"
		return
	}

	B.City = &input
}

func (B *Buyer) setState(input string) {
	if input != "" && utf8.RuneCountInString(input) > 20 {
		B.report.State = "Estado deve possuir até 20 caracteres"
		return
	}

	B.State = &input
}

func (B *Buyer) setCep(input string) {
	if input != "" && utf8.RuneCountInString(input) != 9 {
		B.report.Cep = "CEP deve possuir 9 caracteres"
		return
	}

	B.Cep = &input
}

func (B *Buyer) setMobilePhone(phone string) {
	if utf8.RuneCountInString(phone) > 0 && utf8.RuneCountInString(phone) != 16 {
		B.report.MobilePhone = "Celular deve possuir formato '(DDD) 90000-0000'"
		return
	}

	B.MobilePhone = &phone
}

func (B *Buyer) setLandLinePhone(phone string) {
	if utf8.RuneCountInString(phone) > 0 && utf8.RuneCountInString(phone) != 15 {
		B.report.LandLinePhone = "Telefone deve possuir formato '(DDD) 0000-0000'"
		return
	}

	B.LandLinePhone = &phone
}

func (B *Buyer) setEmail(email string) {
	if email != "" {
		B.Email = &email
	}
}

func (B *Buyer) setID(input string) error {
	if input != "" {
		id, err := strconv.ParseUint(input, 10, 64)
		if err != nil || id == 0 {
			return errors.New("buyer does not have valid id")
		}
		B.Id = &id
	}

	return nil
}

func (B *Buyer) ParseForm(form BuyerForm) (*BuyerReport, error) {
	B.report = new(BuyerReport)

	if err := B.setID(form.Id); err != nil {
		return nil, err
	}

	B.setFullName(form.FullName)
	B.setRegister(form.Cpf, form.Cnpj)
	B.setAdress(form.Address)
	B.setCity(form.City)
	B.setState(form.State)
	B.setCep(form.Cep)
	B.setLandLinePhone(form.LandLinePhone)
	B.setMobilePhone(form.MobilePhone)
	B.setEmail(form.Email)

	if B.report.HasInvalidField() {
		return B.report, nil
	}

	B.report = nil

	return nil, nil
}

type Buyers []Buyer

func (B *Buyers) ParseForm(form BuyersForm) (*[]BuyerReport, error) {
	reports := make([]BuyerReport, len(form))

	for i := 0; i < len(form); i++ {
		buyer := Buyer{}

		report, err := buyer.ParseForm(form[i])
		if err != nil {
			return nil, err
		}

		if report != nil {
			reports[i] = *buyer.report
		} else {
			*B = append(*B, buyer)
		}
	}

	if len(*B) < len(reports) {
		return &reports, nil
	}

	return nil, nil
}
