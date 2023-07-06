package utils

import (
	"strconv"
	"strings"
	"time"
)

func ParseDate(input string) (time.Time, string) {
	fragments := strings.Split(input, "-")

	if len(fragments) != 3 {
		return time.Time{}, "Data inválida"
	}

	if len(fragments[0]) != 4 {
		return time.Time{}, "Ano deve possuir 4 algarismos"
	}
	year, err := strconv.ParseUint(fragments[0], 10, 64)
	if err != nil || year == 0 {
		return time.Time{}, "Ano deve ser inteiro positivo"
	}

	if len(fragments[1]) != 2 {
		return time.Time{}, "Mês deve possuir 2 algarismos"
	}
	month, err := strconv.ParseUint(fragments[1], 10, 64)
	if err != nil || month == 0 {
		return time.Time{}, "Mês deve ser inteiro positivo"
	}
	if invalidMonth := strings.Contains(time.Month(month).String(), "Month"); invalidMonth {
		return time.Time{}, "Mês não existe"
	}

	if len(fragments[2]) != 2 {
		return time.Time{}, "Dia deve possuir 2 algarismos"
	}
	day, err := strconv.ParseUint(fragments[2], 10, 64)
	if err != nil || day == 0 {
		return time.Time{}, "Dia deve ser inteiro positivo"
	}

	date := time.Date(int(year), time.Month(int(month)), int(day), 0, 0, 0, 0, time.Local)
	if date.Day() != int(day) {
		return time.Time{}, "Dia do mês inválido"
	}

	minDate := time.Date(1960, time.January, 1, 0, 0, 0, 0, time.Local)
	if date.UnixMilli() < minDate.UnixMilli() {
		return time.Time{}, "Data não pode ser antes de 1960"
	}

	return date, ""
}
