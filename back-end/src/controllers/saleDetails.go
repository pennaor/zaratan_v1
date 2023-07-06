package controllers

import (
	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type SaleDetailsController struct {
	service *services.SaleDetailsService
}

func NewSaleDetailsController(service *services.SaleDetailsService) *SaleDetailsController {
	return &SaleDetailsController{service: service}
}

func (controller *SaleDetailsController) ReportSaleDetails(c *fiber.Ctx) error {
	form := ztypes.SaleDetailsForm{}
	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if _, httpError := controller.service.ReportSaleDetails(form); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusOK)
}
