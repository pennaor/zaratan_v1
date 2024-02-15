package models

import (
	"database/sql"
	"fmt"

	"zApi/src/database"
	"zApi/src/ztypes"
)

type BuyerModel struct {
	DB *sql.DB
}

func NewBuyerModel(db *sql.DB) *BuyerModel {
	return &BuyerModel{DB: db}
}

func (B *BuyerModel) Create(buyer ztypes.Buyer) (int64, error) {
	result, err := B.DB.Exec(
		`INSERT INTO buyers
			(full_name,
				cpf, cnpj,
				address, city,
				state, cep,
				landline_phone,
				mobile_phone, email)
			VALUES
			(?,
				?, ?, ?,
				?, ?, ?,
				?, ?, ?)`,
		buyer.FullName,
		buyer.Cpf, buyer.Cnpj, buyer.Address,
		buyer.City, buyer.State, buyer.Cep,
		buyer.LandLinePhone, buyer.MobilePhone, buyer.Email,
	)
	if err != nil {
		return 0, fmt.Errorf("insert buyer error: %v", PrepareDBError(err))
	}

	buyerId, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("get inserted buyer id error: %v", err)
	}

	return buyerId, nil
}

func (B *BuyerModel) GetAll() (ztypes.Buyers, error) {
	var (
		rows   *sql.Rows
		err    error
		buyers = make(ztypes.Buyers, 0)
	)

	rows, err = B.DB.Query(`
		SELECT
			id,
			full_name,
			cpf,
			cnpj,
			address,
			city,
			state,
			cep,
			landline_phone,
			mobile_phone,
			email
		FROM
			buyers
	`)
	if err != nil {
		return ztypes.Buyers{}, err
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

func (B *BuyerModel) UpdateById(id uint64, buyer ztypes.Buyer) error {
	_, err := B.DB.Exec(`
		UPDATE buyers
			SET
				full_name = ?,
				cpf = ?, cnpj = ?, address = ?,
				city = ?, state = ?, cep = ?,
				landline_phone = ?, mobile_phone = ?,
				email = ?
			WHERE id = ?
		`,
		buyer.FullName,
		buyer.Cpf, buyer.Cnpj, buyer.Address,
		buyer.City, buyer.State, buyer.Cep,
		buyer.LandLinePhone, buyer.MobilePhone, buyer.Email,
		buyer.Id,
	)
	if err != nil {
		return fmt.Errorf("update buyer error: %v", PrepareDBError(err))
	}

	return nil
}

type BuyerModelTx struct {
	tx *database.Transaction
}

func (*BuyerModel) UseTx(tx *database.Transaction) *BuyerModelTx {
	return &BuyerModelTx{tx: tx}
}

func (B *BuyerModelTx) Create(buyer ztypes.Buyer) (int64, error) {
	result, err := B.tx.Exec(
		`INSERT INTO buyers
			(full_name,
				cpf, cnpj,
				address, city,
				state, cep,
				landline_phone,
				mobile_phone, email)
			VALUES
			(?,
				?, ?, ?,
				?, ?, ?,
				?, ?, ?)`,
		buyer.FullName,
		buyer.Cpf, buyer.Cnpj, buyer.Address,
		buyer.City, buyer.State, buyer.Cep,
		buyer.LandLinePhone, buyer.MobilePhone, buyer.Email,
	)
	if err != nil {
		return 0, fmt.Errorf("transaction insert buyer error: %v", PrepareDBError(err))
	}

	buyerId, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("transaction get inserted buyer id error: %v", err)
	}

	return buyerId, nil
}

func (B *BuyerModelTx) UpdateById(buyer ztypes.Buyer) error {
	_, err := B.tx.Exec(`
		UPDATE buyers
			SET
				full_name = ?,
				cpf = ?, cnpj = ?, address = ?,
				city = ?, state = ?, cep = ?,
				landline_phone = ?, mobile_phone = ?,
				email = ?
			WHERE id = ?
		`,
		buyer.FullName,
		buyer.Cpf, buyer.Cnpj, buyer.Address,
		buyer.City, buyer.State, buyer.Cep,
		buyer.LandLinePhone, buyer.MobilePhone, buyer.Email,
		buyer.Id,
	)
	if err != nil {
		return fmt.Errorf("transaction update buyer error: %v", PrepareDBError(err))
	}

	return nil
}
