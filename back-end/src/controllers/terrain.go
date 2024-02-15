package controllers

import (
	"strconv"

	"zApi/src/services"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type TerrainController struct {
	service *services.TerrainService
}

func NewTerrainController(service *services.TerrainService) *TerrainController {
	return &TerrainController{service: service}
}

func (controller *TerrainController) ReportTerrainDetails(c *fiber.Ctx) error {
	form := ztypes.TerrainDetailsForm{}
	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if httpError := controller.service.ReportTerrainDetails(form); httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusOK)
}

func (controller *TerrainController) GetAll(c *fiber.Ctx) error {
	terrains, httpError := controller.service.GetAll()
	if httpError != nil {
		return c.Status(httpError.Code).SendString(httpError.Err.Error())
	}

	return c.Status(fiber.StatusOK).JSON(terrains)
}

func (controller *TerrainController) GetByTerrainId(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil || id == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("id must be provided as valid integer bigger than 0")
	}

	terrain, httpError := controller.service.GetByTerrainId(id)
	if httpError != nil {
		return c.Status(httpError.Code).SendString(httpError.Error())
	}

	return c.Status(fiber.StatusOK).JSON(terrain)
}

func (controller *TerrainController) Create(c *fiber.Ctx) error {
	form := ztypes.TerrainForm{}

	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	id, httpError := controller.service.Create(form)
	if httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.Status(fiber.StatusCreated).JSON(map[string]uint64{"id": id})
}

func (controller *TerrainController) UpdateById(c *fiber.Ctx) error {
	form := ztypes.TerrainForm{}

	if err := c.BodyParser(&form); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	httpError := controller.service.UpdateById(form)
	if httpError != nil {
		if httpError.Err != nil {
			return c.Status(httpError.Code).SendString(httpError.Error())
		}
		return c.Status(httpError.Code).JSON(httpError.UserReport)
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func (controller *TerrainController) DeleteById(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil || id == 0 {
		return c.Status(fiber.StatusBadRequest).SendString("id must be provided as valid integer bigger than 0")
	}

	if err = controller.service.DeleteById(id); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return c.SendStatus(fiber.StatusNoContent)
}
