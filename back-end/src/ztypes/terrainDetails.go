package ztypes

import (
	"errors"
	"reflect"
	"strconv"
	"unicode/utf8"

	"zApi/src/utils"
)

type terrainDetailsReport struct {
	Block        string `json:"block"`
	Number       string `json:"number"`
	Address      string `json:"address"`
	Area         string `json:"area"`
	Shape        string `json:"shape"`
	Dimensions   string `json:"dimensions"`
	Deed         string `json:"deed"`
	DeedDate     string `json:"deedDate"`
	Registry     string `json:"registry"`
	Observations string `json:"observations"`
}

func (TDR *terrainDetailsReport) hasInvalidField() bool {
	hasInvalidField := false
	r := reflect.ValueOf(TDR).Elem()

	for i := 0; i < r.NumField(); i++ {
		report := r.Field(i).Interface()
		if report != "" {
			hasInvalidField = true
		}
	}

	return hasInvalidField
}

type TerrainDetails struct {
	Id           *uint64  `json:"id"`
	Block        *uint64  `json:"block"`
	Number       *uint64  `json:"number"`
	Address      *string  `json:"address"`
	Area         *float64 `json:"area"`
	Shape        *string  `json:"shape"`
	Dimensions   *string  `json:"dimensions"`
	Deed         *string  `json:"deed"`
	DeedDate     *string  `json:"deedDate"`
	Registry     *string  `json:"registry"`
	Observations *string  `json:"observations"`
	report       *terrainDetailsReport
}

func (TD *TerrainDetails) setID(input string) error {
	if input != "" {
		id, err := strconv.ParseUint(input, 10, 64)
		if err != nil || id == 0 {
			return errors.New("terrain details does not have valid id")
		}
		TD.Id = &id
	}

	return nil
}

func (TD *TerrainDetails) setBlock(input string) {
	block, err := strconv.ParseUint(input, 10, 64)
	if err == nil && block > 0 {
		TD.Block = &block
		return
	}

	TD.report.Block = "Quadra precisa ser número inteiro positivo acima de 0"
}

func (TD *TerrainDetails) setNumber(input string) {
	number, err := strconv.ParseUint(input, 10, 64)
	if err == nil && number > 0 {
		TD.Number = &number
		return
	}

	TD.report.Number = "Lote precisa ser número inteiro positivo acima de 0"
}

func (TD *TerrainDetails) setAddress(input string) {
	if utf8.RuneCountInString(input) < 8 || utf8.RuneCountInString(input) > 125 {
		TD.report.Address = "Endereço deve possuir de 8 a 125 caracteres"
		return
	}

	TD.Address = &input
}

func (TD *TerrainDetails) setArea(input string) {
	area, err := strconv.ParseFloat(input, 64)
	if err == nil && area > 0 {
		TD.Area = &area
		return
	}

	TD.report.Area = "Área precisa ser número positivo acima de 0"
}

func (TD *TerrainDetails) setShape(input string) {
	if utf8.RuneCountInString(input) < 4 || utf8.RuneCountInString(input) > 25 {
		TD.report.Shape = "Formato deve possuir de 4 a 25 caracteres"
		return
	}

	TD.Shape = &input
}

func (TD *TerrainDetails) setDimensions(input string) {
	if utf8.RuneCountInString(input) < 4 || utf8.RuneCountInString(input) > 125 {
		TD.report.Dimensions = "Dimensões deve possuir de 4 a 125 caracteres"
		return
	}

	TD.Dimensions = &input
}

func (TD *TerrainDetails) setDeed(deed, deedDate string) {
	if deed == "" {
		TD.Deed = &deed
		return
	}

	if len(deed) < 8 || len(deed) > 125 {
		TD.report.Deed = "Escritura deve possuir de 8 a 125 caracteres"
		if len(deedDate) > 0 {
			TD.report.DeedDate = "Escritura deve ser válida para que possa ser datada"
		}
		return
	}

	if len(deedDate) == 0 {
		TD.report.DeedDate = "Escritura deve possuir data"
		return
	}

	if _, invalidMsg := utils.ParseDate(deedDate); invalidMsg != "" {
		TD.report.DeedDate = invalidMsg
		return
	}

	TD.Deed = &deed
	TD.DeedDate = &deedDate
}

func (TD *TerrainDetails) setRegistry(input string) {
	if input == "" {
		TD.Registry = &input
		return
	}

	if utf8.RuneCountInString(input) < 8 || utf8.RuneCountInString(input) > 125 {
		TD.report.Registry = "Registro deve possuir de 8 a 125 caracteres"
		return
	}

	TD.Registry = &input
}

func (TD *TerrainDetails) setObservations(input string) {
	if input == "" && utf8.RuneCountInString(input) > 125 {
		TD.report.Observations = "Observações pode possuir até 125 caracteres"
		return
	}

	TD.Observations = &input
}

func (TD *TerrainDetails) ParseForm(form TerrainDetailsForm) (*terrainDetailsReport, error) {
	TD.report = new(terrainDetailsReport)

	if err := TD.setID(form.Id); err != nil {
		return nil, err
	}

	TD.setBlock(form.Block)
	TD.setNumber(form.Number)
	TD.setAddress(form.Address)
	TD.setArea(form.Area)
	TD.setShape(form.Shape)
	TD.setDimensions(form.Dimensions)
	TD.setDeed(form.Deed, form.DeedDate)
	TD.setRegistry(form.Registry)
	TD.setObservations(form.Observations)

	if TD.report.hasInvalidField() {
		return TD.report, nil
	}

	TD.report = nil

	return nil, nil
}
