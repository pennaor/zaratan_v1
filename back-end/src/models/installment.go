package models

import (
	"database/sql"
	"fmt"

	"zApi/src/database"
	"zApi/src/ztypes"
)

type InstallmentModel struct {
	DB *sql.DB
}

func NewInstallmentModel(db *sql.DB) *InstallmentModel {
	return &InstallmentModel{DB: db}
}

func (model *InstallmentModel) GetSaleInstallments(saleId uint64) ([]ztypes.Installment, error) {
	var (
		stmt         *sql.Stmt
		rows         *sql.Rows
		installments = make([]ztypes.Installment, 0)
		err          error
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			*
		FROM
			installments
		WHERE
			sale_id = ?
	`)
	if err != nil {
		return nil, fmt.Errorf("fail at prepare select installments query: %v", err)
	}
	defer stmt.Close()

	rows, err = stmt.Query(saleId)
	if err != nil {
		return nil, fmt.Errorf("fail at query installments: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		installment := ztypes.Installment{}
		if err := rows.Scan(
			&installment.Id,
			&installment.SaleId,
			&installment.Price,
			&installment.PaymentDate,
			&installment.Progress,
		); err != nil {
			return nil, fmt.Errorf("fail at scan installment: %v", err)
		}
		installments = append(installments, installment)
	}

	return installments, nil
}

func (model *InstallmentModel) Delete(id uint64) error {
	stmt, err := model.DB.Prepare(`
		DELETE FROM 
			installments
		WHERE 
			id = ?
	`)
	if err != nil {
		return fmt.Errorf("delete installment error: %v", err)
	}
	defer stmt.Close()

	if _, err := stmt.Exec(id); err != nil {
		return fmt.Errorf("delete installment error: %v", err)
	}

	return nil
}

func (model *InstallmentModel) DeleteBySaleId(saleId uint64) error {
	stmt, err := model.DB.Prepare(`
		DELETE FROM 
			installments
		WHERE 
			sale_id = ?
	`)
	if err != nil {
		return fmt.Errorf("delete all installments error: %v", err)
	}
	defer stmt.Close()

	if _, err := stmt.Exec(saleId); err != nil {
		return fmt.Errorf("delete all installments error: %v", err)
	}

	return nil
}

type InstallmentModelTx struct {
	tx *database.Transaction
}

func (*InstallmentModel) UseTx(tx *database.Transaction) *InstallmentModelTx {
	return &InstallmentModelTx{tx: tx}
}

func (I *InstallmentModelTx) Create(saleId uint64, installment ztypes.Installment) (int64, error) {
	result, err := I.tx.Exec(`
		INSERT INTO installments
			(sale_id, price, payment_date, progress)
		VALUES
			(?, ?, ?, ?)
		`,
		saleId, installment.Price,
		installment.PaymentDate, installment.Progress,
	)
	if err != nil {
		return 0, fmt.Errorf("transaction insert installment error: %v", PrepareDBError(err))
	}

	installmentId, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("transaction get inserted installment id error: %v", err)
	}

	return installmentId, nil
}

func (I *InstallmentModelTx) UpdateBySaleId(installment ztypes.Installment) error {
	_, err := I.tx.Exec(`
		UPDATE installments
			SET price = ?, progress = ?
			WHERE id = ?
		`,
		installment.Price, installment.Progress,
		installment.Id,
	)
	if err != nil {
		return fmt.Errorf("transaction update terrain installment error: %v", err)
	}

	return nil
}

// func (model *InstallmentModel) Delete(saleId uint64, installmentDate string) error {
// 	statement, err := model.DB.Prepare(`
// 		DELETE FROM installments
// 		WHERE sale_id = ? AND payment_date = ?
// 	`)
// 	if err != nil {
// 		return fmt.Errorf("delete installment error: %v", err)
// 	}
// 	defer statement.Close()

// 	if _, err := statement.Exec(saleId, installmentDate); err != nil {
// 		return fmt.Errorf("delete installment error: %v", err)
// 	}

// 	return nil
// }

// func (model *InstallmentModel) DeleteAll(saleId uint64) error {
// 	statement, err := model.DB.Prepare(`
// 		DELETE FROM installments
// 		WHERE sale_id = ?
// 	`)
// 	if err != nil {
// 		return fmt.Errorf("delete all installments error: %v", err)
// 	}
// 	defer statement.Close()

// 	if _, err := statement.Exec(saleId); err != nil {
// 		return fmt.Errorf("delete all installments error: %v", err)
// 	}

// 	return nil
// }
