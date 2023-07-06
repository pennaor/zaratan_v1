package controllers

import (
	"strconv"

	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type InstallmentController struct {
	service *services.InstallmentService
}

func NewInstallmentController(service *services.InstallmentService) *InstallmentController {
	return &InstallmentController{service: service}
}

func (controller *InstallmentController) ReportInstallments(c *fiber.Ctx) error {
	form := ztypes.SaleForm{}
	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if form.Installments == nil || form.Details.OpenAt == "" {
		return c.Status(fiber.StatusBadRequest).SendString("sale details and installments are required")
	}

	if _, httpError := controller.service.ReportInstallments(form); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (controller *InstallmentController) Delete(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil || id == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("saleId must be provided as valid integer bigger than 0")
	}

	if err := controller.service.Delete(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (controller *InstallmentController) DeleteBySaleId(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil || id == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("id must be provided as valid integer bigger than 0")
	}

	if err := controller.service.DeleteBySaleId(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}
