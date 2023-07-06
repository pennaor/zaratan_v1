package models

import (
	"database/sql"
	"fmt"

	"zApi/src/ztypes"
)

type TerrainModel struct {
	DB                  *sql.DB
	TerrainDetailsModel *TerrainDetailsModel
	SaleModel           *SaleModel
}

func NewTerrainModel(db *sql.DB) *TerrainModel {
	return &TerrainModel{
		DB:                  db,
		TerrainDetailsModel: NewTerrainDetailsModel(db),
		SaleModel:           NewSaleModel(db),
	}
}

func (model *TerrainModel) GetAll() ([]ztypes.Terrain, error) {
	var (
		stmt     *sql.Stmt
		rows     *sql.Rows
		terrains []ztypes.Terrain
		err      error
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			t.id,
			t.block,
			t.number,
			t.address,
			t.area,
			t.shape,
			t.dimensions,
			t.deed,
			t.deed_date,
			t.registry,
			t.observations,

			s.id,
			s.terrain_id,
			s.open_at,
			s.close_at,
			s.installment_count,
			s.price,
			s.down_payment,
			s.payment_type,
			s.progress
		FROM
			terrains_details AS t
					LEFT JOIN
			sales_details AS s ON t.id = s.terrain_id
	`)
	if err != nil {
		return nil, fmt.Errorf("fail at prepare select terrain and sale details query: %v", err)
	}
	defer stmt.Close()

	rows, err = stmt.Query()
	if err != nil {
		return nil, fmt.Errorf("fail at query terrain and sale details: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		terrain := ztypes.Terrain{}
		sale := ztypes.Sale{}

		if err := rows.Scan(
			&terrain.Details.Id,
			&terrain.Details.Block,
			&terrain.Details.Number,
			&terrain.Details.Address,
			&terrain.Details.Area,
			&terrain.Details.Shape,
			&terrain.Details.Dimensions,
			&terrain.Details.Deed,
			&terrain.Details.DeedDate,
			&terrain.Details.Registry,
			&terrain.Details.Observations,

			&sale.Details.Id,
			&sale.Details.TerrainId,
			&sale.Details.OpenAt,
			&sale.Details.CloseAt,
			&sale.Details.InstallmentCount,
			&sale.Details.Price,
			&sale.Details.DownPayment,
			&sale.Details.PaymentType,
			&sale.Details.Progress,
		); err != nil {
			return nil, fmt.Errorf("fail at scan terrain and sale details: %v", err)
		}

		if sale.Details.Id != nil {
			terrain.Sale = &sale
		}

		terrains = append(terrains, terrain)
	}

	return terrains, nil
}

func (model *TerrainModel) GetByTerrainId(id uint64) (ztypes.Terrain, error) {
	var (
		stmt    *sql.Stmt
		rows    *sql.Rows
		err     error
		terrain ztypes.Terrain
		sale    = ztypes.Sale{}
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			t.id,
			t.block,
			t.number,
			t.address,
			t.area,
			t.shape,
			t.dimensions,
			t.deed,
			t.deed_date,
			t.registry,
			t.observations,

			s.id,
			s.terrain_id,
			s.open_at,
			s.close_at,
			s.installment_count,
			s.price,
			s.down_payment,
			s.payment_type,
			s.progress
		FROM
			terrains_details AS t
					LEFT JOIN
			sales_details AS s ON t.id = s.terrain_id
		WHERE
			t.id = ?
	`)
	if err != nil {
		return ztypes.Terrain{}, fmt.Errorf("fail at prepare select terrain and sale details query: %v", err)
	}
	defer stmt.Close()

	rows, err = stmt.Query(id)
	if err != nil {
		return ztypes.Terrain{}, fmt.Errorf("fail at query terrain and sale details: %v", err)
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(
			&terrain.Details.Id,
			&terrain.Details.Block,
			&terrain.Details.Number,
			&terrain.Details.Address,
			&terrain.Details.Area,
			&terrain.Details.Shape,
			&terrain.Details.Dimensions,
			&terrain.Details.Deed,
			&terrain.Details.DeedDate,
			&terrain.Details.Registry,
			&terrain.Details.Observations,

			&sale.Details.Id,
			&sale.Details.TerrainId,
			&sale.Details.OpenAt,
			&sale.Details.CloseAt,
			&sale.Details.InstallmentCount,
			&sale.Details.Price,
			&sale.Details.DownPayment,
			&sale.Details.PaymentType,
			&sale.Details.Progress,
		); err != nil {
			return ztypes.Terrain{}, fmt.Errorf("fail at scan terrain and sale details: %v", err)
		}
	}

	if sale.Details.Id != nil {
		terrain.Sale = &sale
	}

	return terrain, nil
}

func (model *TerrainModel) DeleteById(id uint64) error {
	stmt, err := model.DB.Prepare(`
		DELETE
		FROM terrains_details
		WHERE id = ?
	`)
	if err != nil {
		return fmt.Errorf("delete terrain by id error: %v", err)
	}
	defer stmt.Close()

	if _, err := stmt.Exec(id); err != nil {
		return fmt.Errorf("delete terrain by id error: %v", err)
	}

	return nil
}
