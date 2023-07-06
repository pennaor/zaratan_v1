package controllers

import (
	"strconv"

	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type SaleController struct {
	service *services.SaleService
}

func NewSaleController(service *services.SaleService) *SaleController {
	return &SaleController{service: service}
}

func (controller *SaleController) ReportSale(c *fiber.Ctx) error {
	form := ztypes.SaleForm{}
	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if httpError := controller.service.ReportSale(form); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (controller *SaleController) DetachBuyer(c *fiber.Ctx) error {
	saleId, err := strconv.ParseUint(c.Params("saleId"), 10, 64)
	if err != nil || saleId == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("sale id must be provided as valid integer bigger than 0")
	}

	buyerid, err := strconv.ParseUint(c.Params("buyerId"), 10, 64)
	if err != nil || buyerid == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("buyer id must be provided as valid integer bigger than 0")
	}

	if httpError := controller.service.SalesBuyersSvc.Detach(saleId, buyerid); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
