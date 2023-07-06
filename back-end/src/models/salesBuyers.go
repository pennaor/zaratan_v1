package models

import (
	"database/sql"
	"fmt"

	"zApi/src/database"
	"zApi/src/ztypes"
)

type SalesBuyersModel struct {
	DB         *sql.DB
	BuyerModel *BuyerModel
}

func NewSalesBuyersModel(db *sql.DB) *SalesBuyersModel {
	return &SalesBuyersModel{
		DB:         db,
		BuyerModel: &BuyerModel{db},
	}
}

func (model *SalesBuyersModel) SaleHasBuyer(saleId, buyerId uint64) (bool, error) {
	var (
		stmt *sql.Stmt
		rows *sql.Rows
		err  error
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			*
		FROM
			sales_buyers
		WHERE
			sale_id = ? AND buyer_id = ?
	`)
	if err != nil {
		return false, fmt.Errorf("fail at prepare select buyers query: %v", err)
	}
	defer stmt.Close()

	rows, err = stmt.Query(saleId, buyerId)
	if err != nil {
		return false, fmt.Errorf("fail at query sale buyers: %v", err)
	}
	defer rows.Close()

	return rows.Next(), nil
}

func (model *SalesBuyersModel) GetSaleBuyers(saleId uint64) (ztypes.Buyers, error) {
	var (
		stmt   *sql.Stmt
		rows   *sql.Rows
		buyers ztypes.Buyers
		err    error
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			b.id,
			b.full_name,
			b.cpf,
			b.cnpj,
			b.address,
			b.city,
			b.state,
			b.cep,
			b.landline_phone,
			b.mobile_phone,
			b.email
		FROM
			buyers AS b
					INNER JOIN
			sales_buyers AS sb ON b.id = sb.buyer_id
		WHERE
			sb.sale_id = ?
	`)
	if err != nil {
		return ztypes.Buyers{}, fmt.Errorf("fail at prepare select buyers query: %v", err)
	}
	defer stmt.Close()

	rows, err = stmt.Query(saleId)
	if err != nil {
		return ztypes.Buyers{}, fmt.Errorf("fail at query sale buyers: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		buyer := ztypes.Buyer{}
		if err := rows.Scan(
			&buyer.Id,
			&buyer.FullName,
			&buyer.Cpf,
			&buyer.Cnpj,
			&buyer.Address,
			&buyer.City,
			&buyer.State,
			&buyer.Cep,
			&buyer.LandLinePhone,
			&buyer.MobilePhone,
			&buyer.Email,
		); err != nil {
			return ztypes.Buyers{}, fmt.Errorf("fail at scan buyer: %v", err)
		}
		buyers = append(buyers, buyer)
	}

	return buyers, nil
}

func (SB *SalesBuyersModel) Attach(saleId, buyerId uint64) error {
	_, err := SB.DB.Exec(`
		INSERT INTO sales_buyers
			(sale_id, buyer_id)
		VALUES
			(?, ?)`,
		saleId, buyerId,
	)
	if err != nil {
		return fmt.Errorf("transaction insert sale buyer error: %v", PrepareDBError(err))
	}

	return nil
}

func (SB *SalesBuyersModel) Detach(saleId, buyerId uint64) (int64, error) {
	stmt, err := SB.DB.Prepare(`
		DELETE
		FROM sales_buyers
		WHERE
			sale_id = ? AND buyer_id = ?
	`)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()

	result, err := stmt.Exec(saleId, buyerId)
	if err != nil {
		return 0, err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return 0, err
	}

	return affectedRows, nil
}

type SalesBuyersModelTx struct {
	tx *database.Transaction
}

func (*SalesBuyersModel) UseTx(tx *database.Transaction) *SalesBuyersModelTx {
	return &SalesBuyersModelTx{tx: tx}
}

func (SB *SalesBuyersModelTx) Attach(saleId, buyerId uint64) error {
	_, err := SB.tx.Exec(`
		INSERT INTO sales_buyers
			(sale_id, buyer_id)
		VALUES
			(?, ?)`,
		saleId, buyerId,
	)
	if err != nil {
		return fmt.Errorf("transaction insert sale buyer error: %v", PrepareDBError(err))
	}

	return nil
}
