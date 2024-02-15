package models

import (
	"errors"
	"fmt"
	"strings"
	"unicode"
)

const (
	PREPARED_ERROR_TAG  = "PREPARED_ERROR"
	DUPLICATE_ERROR_TAG = "DUPLICATE"
	FK_ERROR_TAG        = "FOREIGN KEY"
)

var entitiesDict = map[string]string{
	"buyers":       "comprador",
	"sales":        "venda",
	"installments": "parcela",
	"terrains":     "lote",
	"user":         "usuário",
}

var fieldsDict = map[string]string{
	"email": "e-mail",
	"cpf":   "cpf",
	"cnpj":  "cnpj",
}

func Capitalize(str string) string {
	runed := []rune(str)
	runed[0] = unicode.ToUpper(runed[0])
	return string(runed)
}

func normalizeSituation(situation string, entities ...string) string {
	if len(entities) == 1 {
		entity := entities[0]

		reference := entity[len(entity)-1]

		target := situation[len(situation)-1]

		if reference == 'a' && target != 'a' {
			runed := []rune(situation)
			runed[len(runed)-1] = 'a'
			return string(runed)
		}
		if reference != 'a' && target == 'a' {
			runed := []rune(situation)
			runed[len(runed)-1] = 'o'
			return string(runed)
		}
	} else {
		allEndWithA := true
		for i := 0; i < len(entities); i++ {
			if entities[i][len(entities[i])-2] != 'a' {
				allEndWithA = false
				break
			}
		}
		if allEndWithA {
			runed := []rune(situation)
			runed[len(runed)-2] = 'a'
			return string(runed)
		}

		runed := []rune(situation)
		runed[len(runed)-2] = 'o'
		return string(runed)
	}

	return situation
}

func prepareDuplicateError(err error) error {
	if strings.Contains(err.Error(), "Error 1062:") {
		message := fmt.Sprintf("%s(%s): ", PREPARED_ERROR_TAG, DUPLICATE_ERROR_TAG)

		fragments := strings.Split(err.Error(), "'")
		entitiesField := strings.Split(fragments[3], ".")
		entities, fields := strings.Split(entitiesField[0], "_"), entitiesField[1]

		if len(entities) == 1 {
			if entity, has := entitiesDict[entities[0]]; has {
				if field, has := fieldsDict[fields]; has {
					message += fmt.Sprintf(
						"%s já %s a %s %s",
						Capitalize(field),
						normalizeSituation("associado", field),
						normalizeSituation("outro", entity),
						entity,
					)
				} else {
					message += fmt.Sprintf(
						"%s já %s",
						Capitalize(entity),
						normalizeSituation("cadastrado", entity),
					)
				}
				return errors.New(message)
			}
		}

		if len(entities) == 2 {
			matchedEntites := []string{}

			if firstEntity, has := entitiesDict[entities[0]]; has {
				matchedEntites = append(matchedEntites, firstEntity)
			}

			if secondEntity, has := entitiesDict[entities[1]]; has {
				matchedEntites = append(matchedEntites, secondEntity)
			}

			if len(matchedEntites) == 1 {
				message += fmt.Sprintf(
					"%s já %s",
					Capitalize(matchedEntites[0]),
					normalizeSituation("cadastrado", matchedEntites[0]),
				)
				return errors.New(message)
			}

			message += fmt.Sprintf(
				"%s e %s já %s",
				Capitalize(matchedEntites[0]),
				matchedEntites[1],
				normalizeSituation("associados", matchedEntites[0], matchedEntites[1]),
			)
			return errors.New(message)
		}
	}
	return err
}

func prepareFKError(err error) error {
	if strings.Contains(err.Error(), "Error 1452:") {
		const REFERENCES_INDEX = 8

		message := fmt.Sprintf("%s(%s): ", PREPARED_ERROR_TAG, FK_ERROR_TAG)

		reference := strings.Split(err.Error(), "`")[REFERENCES_INDEX+1]
		reference = strings.Split(reference, "_")[0]

		if entity, has := entitiesDict[reference]; has {
			message += fmt.Sprintf(
				"%s não %s",
				Capitalize(entity),
				normalizeSituation("encontrado", entity),
			)
			return errors.New(message)
		}
	}

	return err
}

func PrepareDBError(err error) error {
	return prepareDuplicateError(prepareFKError(err))
}
