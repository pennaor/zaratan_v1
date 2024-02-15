package controllers

import (
	"strconv"

	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type BuyerController struct {
	service *services.BuyerService
}

func NewBuyerController(service *services.BuyerService) *BuyerController {
	return &BuyerController{service: service}
}

func (controller *BuyerController) ReportBuyers(c *fiber.Ctx) error {
	form := ztypes.BuyersForm{}
	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if _, httpError := controller.service.ReportBuyers(form); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (controller *BuyerController) GetAll(c *fiber.Ctx) error {
	buyers, httpError := controller.service.GetAll()
	if httpError != nil {
		return c.Status(httpError.Code).SendString(httpError.Err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(buyers)
}

func (controller *BuyerController) UpdateById(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil || id == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("id must be provided as valid integer bigger than 0")
	}

	form := ztypes.BuyerForm{}

	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if httpError := controller.service.UpdateById(id, form); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusNoContent)
}
