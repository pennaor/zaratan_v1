package models

import (
	"database/sql"
	"fmt"

	"zApi/src/database"
	"zApi/src/ztypes"
)

type SaleDetailsModel struct {
	DB *sql.DB
}

func NewSaleDetailsModel(db *sql.DB) *SaleDetailsModel {
	return &SaleDetailsModel{DB: db}
}

func (model *SaleDetailsModel) GetByTerrainId(id uint64) (*ztypes.SaleDetails, error) {
	var (
		stmt    *sql.Stmt
		rows    *sql.Rows
		err     error
		details = new(ztypes.SaleDetails)
	)

	stmt, err = model.DB.Prepare(`
		SELECT
			*
		FROM 
			sales_details
		WHERE
			terrain_id = ?
	`)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	rows, err = stmt.Query(id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(
			&details.Id,
			&details.TerrainId,
			&details.OpenAt,
			&details.CloseAt,
			&details.InstallmentCount,
			&details.Price,
			&details.DownPayment,
			&details.PaymentType,
			&details.Progress,
		); err != nil {
			return nil, err
		}
	}

	return details, nil
}

type SaleDetailsModelTx struct {
	tx *database.Transaction
}

func (*SaleDetailsModel) UseTx(tx *database.Transaction) *SaleDetailsModelTx {
	return &SaleDetailsModelTx{tx: tx}
}

func (SD *SaleDetailsModelTx) Create(details ztypes.SaleDetails) (int64, error) {
	result, err := SD.tx.Exec(`
		INSERT INTO sales_details
			(
				terrain_id, open_at,
				close_at, installment_count,
				price, down_payment,
				payment_type, progress
			)
		VALUES
			(
				?, ?,
				?, ?,
				?, ?,
				?, ?
			)
		`,
		details.TerrainId, details.OpenAt,
		details.CloseAt, details.InstallmentCount, details.Price,
		details.DownPayment, details.PaymentType, details.Progress,
	)
	if err != nil {
		return 0, fmt.Errorf("transaction insert sale error: %v", PrepareDBError(err))
	}

	saleId, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("transaction get inserted sale id error: %v", err)
	}

	return saleId, nil
}

func (SD *SaleDetailsModelTx) UpdateById(details ztypes.SaleDetails) error {
	_, err := SD.tx.Exec(
		`UPDATE sales_details
			SET
				open_at = ?, close_at = ?, installment_count = ?,
				price = ?, down_payment = ?, payment_type = ?, progress = ?
			WHERE id = ?`,
		details.OpenAt, details.CloseAt, details.InstallmentCount,
		details.Price, details.DownPayment, details.PaymentType, details.Progress,
		details.Id,
	)
	if err != nil {
		return fmt.Errorf("transaction update sale details error: %v", err)
	}

	return nil
}
