package services

import (
	"errors"

	"zApi/src/database"
	"zApi/src/models"
	"zApi/src/ztypes"

	"github.com/gofiber/fiber/v2"
)

type TerrainService struct {
	model   *models.TerrainModel
	saleSvc *SaleService
}

func NewTerrainService(model *models.TerrainModel, saleSvc *SaleService) *TerrainService {
	return &TerrainService{
		model:   model,
		saleSvc: saleSvc,
	}
}

func (svc *TerrainService) ReportTerrainDetails(form ztypes.TerrainDetailsForm) *HttpError {
	details := ztypes.TerrainDetails{}

	report, err := details.ParseForm(form)
	if err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	if report != nil {
		return &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	return nil
}

func (svc *TerrainService) GetAll() ([]ztypes.Terrain, *HttpError) {
	terrains, err := svc.model.GetAll()
	if err != nil {
		return []ztypes.Terrain{}, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	for i := 0; i < len(terrains); i++ {
		terrain := &terrains[i]
		if httpError := svc.saleSvc.GetAndSetSale(terrain); httpError != nil {
			return []ztypes.Terrain{}, httpError
		}
	}

	return terrains, nil
}

func (svc *TerrainService) GetByTerrainId(id uint64) (ztypes.Terrain, *HttpError) {
	terrain, err := svc.model.GetByTerrainId(id)
	if err != nil {
		return ztypes.Terrain{}, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	if terrain.Details.Id == nil {
		return ztypes.Terrain{}, &HttpError{Code: fiber.StatusNotFound, Err: errors.New("terrain not found")}
	}

	if httpError := svc.saleSvc.GetAndSetSale(&terrain); httpError != nil {
		return ztypes.Terrain{}, httpError
	}

	return terrain, nil
}

func (svc *TerrainService) Create(form ztypes.TerrainForm) (uint64, *HttpError) {
	terrain := ztypes.Terrain{}

	report, err := terrain.ParseForm(form)
	if err != nil {
		return 0, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	if report != nil {
		return 0, &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	tx, err := database.NewTx(svc.model.DB)
	if err != nil {
		return 0, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	defer tx.RollBack()

	terrainId, err := svc.model.TerrainDetailsModel.UseTx(tx).Create(terrain.Details)
	if err != nil {
		return 0, ParseDBError(err)
	}

	if terrain.Sale != nil {
		terrain.Sale.Details.TerrainId = &terrainId
		if _, httpError := svc.saleSvc.UseTx(tx).Create(*terrain.Sale); httpError != nil {
			return 0, httpError
		}
	}

	if err = tx.Commit(); err != nil {
		return 0, &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return terrainId, nil
}

func (svc *TerrainService) UpdateById(form ztypes.TerrainForm) *HttpError {
	terrain := ztypes.Terrain{}

	report, err := terrain.ParseForm(form)
	if err != nil {
		return &HttpError{Code: fiber.StatusBadRequest, Err: err}
	}
	if report != nil {
		return &HttpError{Code: fiber.StatusUnprocessableEntity, UserReport: report}
	}

	if terrain.Details.Id == nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: errors.New("terrain id is required")}
	}

	tx, err := database.NewTx(svc.model.DB)
	if err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}
	defer tx.RollBack()

	if err = svc.model.TerrainDetailsModel.UseTx(tx).UpdateById(terrain.Details); err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	if terrain.Sale != nil {
		if httpError := svc.saleSvc.UseTx(tx).UpsertByTerrainId(*terrain.Details.Id, *terrain.Sale); httpError != nil {
			return httpError
		}
	}

	if err = tx.Commit(); err != nil {
		return &HttpError{Code: fiber.StatusInternalServerError, Err: err}
	}

	return nil
}

func (svc *TerrainService) DeleteById(id uint64) error {
	if err := svc.model.DeleteById(id); err != nil {
		return err
	}

	return nil
}
