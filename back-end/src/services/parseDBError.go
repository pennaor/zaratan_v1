package services

import (
	"errors"
	"strings"

	"zApi/src/models"

	"github.com/gofiber/fiber/v2"
)

func ParseDBError(err error) *HttpError {
	if err == nil {
		return nil
	}

	_, after, found := strings.Cut(err.Error(), models.PREPARED_ERROR_TAG)
	if found {
		preparedType, preparedMessage, _ := strings.Cut(after, "): ")
		preparedType = preparedType[1:]
		if preparedType == models.DUPLICATE_ERROR_TAG || preparedType == models.FK_ERROR_TAG {
			return &HttpError{Code: fiber.StatusConflict, Err: errors.New(preparedMessage)}
		}
	}

	return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
}
