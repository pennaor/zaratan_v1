package controllers

import (
	"strconv"

	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type SalesBuyersController struct {
	service *services.SalesBuyersService
}

func NewSalesBuyersController(service *services.SalesBuyersService) *SalesBuyersController {
	return &SalesBuyersController{service: service}
}

func (controller *SalesBuyersController) CreateAttachingBuyer(c *fiber.Ctx) error {
	saleId, err := strconv.ParseUint(c.Params("saleId"), 10, 64)
	if err != nil || saleId == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("sale id must be provided as valid integer bigger than 0")
	}

	form := ztypes.BuyerForm{}

	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	buyerId, httpError := controller.service.CreateAttachingBuyer(saleId, form)
	if httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.Status(fiber.StatusCreated).JSON(map[string]uint64{"buyerId": buyerId})
}

func (controller *SalesBuyersController) AttachMany(c *fiber.Ctx) error {
	saleId, err := strconv.ParseUint(c.Params("saleId"), 10, 64)
	if err != nil || saleId == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("sale id must be provided as valid integer bigger than 0")
	}

	form := map[string][]uint64{"buyersIds": {}}

	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if len(form["buyersIds"]) == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("buyersIds can not be a empty array")
	}

	if httpError := controller.service.AttachMany(saleId, form["buyersIds"]); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (controller *SalesBuyersController) Detach(c *fiber.Ctx) error {
	saleId, err := strconv.ParseUint(c.Params("saleId"), 10, 64)
	if err != nil || saleId == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("sale id must be provided as valid integer bigger than 0")
	}

	buyerid, err := strconv.ParseUint(c.Params("buyerId"), 10, 64)
	if err != nil || buyerid == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("buyer id must be provided as valid integer bigger than 0")
	}

	if httpError := controller.service.Detach(saleId, buyerid); httpError != nil {
		return c.Status(httpError.Code).SendString(httpError.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}
