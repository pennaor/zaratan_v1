package models

import (
	"database/sql"
	"fmt"

	"zApi/src/database"
	"zApi/src/ztypes"
)

type TerrainDetailsModel struct {
	DB *sql.DB
}

func NewTerrainDetailsModel(db *sql.DB) *TerrainDetailsModel {
	return &TerrainDetailsModel{DB: db}
}

// UNUSED
func (model *TerrainDetailsModel) GetAll() ([]ztypes.TerrainDetails, error) {
	var (
		stmt       *sql.Stmt
		rows       *sql.Rows
		allDetails []ztypes.TerrainDetails
		err        error
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			id,
			block,
			number,
			address,
			area,
			shape,
			dimensions,
			deed,
			deed_date,
			registry,
			observations
		FROM
			terrains
	`)
	if err != nil {
		return []ztypes.TerrainDetails{}, err
	}
	defer stmt.Close()

	rows, err = stmt.Query()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		details := ztypes.TerrainDetails{}
		if err := rows.Scan(
			&details.Id,
			&details.Block,
			&details.Number,
			&details.Address,
			&details.Area,
			&details.Shape,
			&details.Dimensions,
			&details.Deed,
			&details.DeedDate,
			&details.Registry,
			&details.Observations,
		); err != nil {
			return []ztypes.TerrainDetails{}, err
		}

		allDetails = append(allDetails, details)
	}

	return allDetails, nil
}

func (model *TerrainDetailsModel) GetById(id uint64) (*ztypes.TerrainDetails, error) {
	var (
		stmt    *sql.Stmt
		rows    *sql.Rows
		details = new(ztypes.TerrainDetails)
		err     error
	)

	stmt, err = model.DB.Prepare(`
		SELECT 
			*
		FROM
			terrains
		WHERE
			id = ?
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
			&details.Block,
			&details.Number,
			&details.Address,
			&details.Area,
			&details.Shape,
			&details.Dimensions,
			&details.Deed,
			&details.DeedDate,
			&details.Registry,
			&details.Observations,
		); err != nil {
			return nil, err
		}
	}

	return details, nil
}

type TerrainDetailsModelTx struct {
	tx *database.Transaction
}

func (*TerrainDetailsModel) UseTx(tx *database.Transaction) *TerrainDetailsModelTx {
	return &TerrainDetailsModelTx{tx: tx}
}

func (TD *TerrainDetailsModelTx) Create(details ztypes.TerrainDetails) (uint64, error) {
	result, err := TD.tx.Exec(`
		INSERT INTO terrains_details
			(
				block, number, address,
				area, shape, dimensions,
				deed, deed_date, registry,
				observations
			)
		VALUES
			(
				?, ?, ?,
				?, ?, ?,
				?, ?, ?,
				?
			)
		`,
		details.Block, details.Number, details.Address,
		details.Area, details.Shape, details.Dimensions,
		details.Deed, details.DeedDate,
		details.Registry, details.Observations,
	)
	if err != nil {
		return 0, fmt.Errorf("transaction insert terrain error: %v", PrepareDBError(err))
	}

	terrainId, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("transaction get inserted terrain id error: %v", err)
	}

	return uint64(terrainId), nil
}

func (TD *TerrainDetailsModelTx) UpdateById(data ztypes.TerrainDetails) error {
	_, err := TD.tx.Exec(
		`UPDATE terrains_details
			SET
				address = ?, area = ?, shape = ?,
				dimensions = ?, deed = ?, deed_date = ?,
				registry = ?, observations = ?
			WHERE id = ?`,
		data.Address, data.Area, data.Shape,
		data.Dimensions, data.Deed, data.DeedDate,
		data.Registry, data.Observations,
		data.Id,
	)
	if err != nil {
		return fmt.Errorf("transaction update terrain error: %v", err)
	}

	return nil
}

// func (model *SoldTerrainModel) UpdateById(id uint64, data ztypes.Terrain) error {
// 	ctx := context.Background()

// 	transaction, err := model.DB.BeginTx(ctx, nil)
// 	if err != nil {
// 		return fmt.Errorf("transaction error: %v", err)
// 	}
// 	defer transaction.Rollback()

// 	terrain, err := NewUnsoldTerrainModel(model.DB).GetById(id)
// 	if err != nil {
// 		return fmt.Errorf("transaction find terrain before update error: %v", err)
// 	}
// 	if terrain.Id == 0 {
// 		return errors.New("terrain not found")
// 	}

// 	sale, err := NewSaleModel(model.DB).GetByTerrainId(terrain.Id)
// 	if err != nil {
// 		return fmt.Errorf("transaction find sale before update error: %v", err)
// 	}

// 	_, err = transaction.ExecContext(
// 		ctx,
// 		`UPDATE terrains
// 			SET
// 				address = ?, area = ?, shape = ?,
// 				dimensions = ?, deed = ?, deed_date = ?,
// 				registry = ?, observations = ?
// 			WHERE id = ?`,
// 		data.Basics.Address, data.Basics.Area, data.Basics.Shape,
// 		data.Basics.Dimensions, data.Basics.Deed, data.Basics.DeedDate,
// 		data.Basics.Registry, data.Basics.Observations,
// 		terrain.Id,
// 	)
// 	if err != nil {
// 		return fmt.Errorf("transaction update terrain error: %v", err)
// 	}

// 	if sale.Id > 0 {
// 		_, err = transaction.ExecContext(
// 			ctx,
// 			`UPDATE sales
// 				SET
// 					open_at = ?, close_at = ?, installment_count = ?,
// 					price = ?, down_payment = ?, payment_type = ?, progress = ?
// 				WHERE id = ?`,
// 			data.Sale.OpenAt, data.Sale.CloseAt, data.Sale.InstallmentCount,
// 			data.Sale.Price, data.Sale.DownPayment, data.Sale.PaymentType, data.Sale.Progress,
// 			sale.Id,
// 		)
// 		if err != nil {
// 			return fmt.Errorf("transaction upsert terrain sale error: %v", err)
// 		}
// 	} else {
// 		result, err := transaction.ExecContext(
// 			ctx,
// 			`INSERT INTO sales
// 				(terrain_id, open_at,
// 					close_at, installment_count, price,
// 					down_payment, payment_type, progress)
// 				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
// 			id, data.Sale.OpenAt,
// 			data.Sale.CloseAt, data.Sale.InstallmentCount, data.Sale.Price,
// 			data.Sale.DownPayment, data.Sale.PaymentType, data.Sale.Progress,
// 		)
// 		if err != nil {
// 			return fmt.Errorf("transaction upsert terrain sale error: %v", err)
// 		}
// 		lastInsertId, err := result.LastInsertId()
// 		if err != nil {
// 			return fmt.Errorf("transaction upsert terrain sale LastInsertId error: %v", err)
// 		}
// 		sale.Id = uint64(lastInsertId)
// 	}

// 	_, err = transaction.ExecContext(
// 		ctx,
// 		`UPDATE buyers
// 			SET
// 				full_name = ?,
// 				cpf = ?, cnpj = ?, address = ?,
// 				city = ?, state = ?, cep = ?,
// 				landline_phone = ?, mobile_phone = ?,
// 				email = ?
// 			WHERE sale_id = ?`,
// 		data.Buyer.FullName,
// 		data.Buyer.Cpf, data.Buyer.Cnpj, data.Buyer.Address,
// 		data.Buyer.City, data.Buyer.State, data.Buyer.Cep,
// 		data.Buyer.LandLinePhone, data.Buyer.MobilePhone, data.Buyer.Email,
// 		sale.Id,
// 	)
// 	if err != nil {
// 		return fmt.Errorf("transaction update terrain buyer error: %v", err)
// 	}

// 	for i := 0; i < len(data.Installments); i++ {
// 		if data.Installments[i].IsNew {
// 			_, err = transaction.ExecContext(
// 				ctx,
// 				`INSERT INTO installments
// 					(sale_id, price,
// 						payment_date, progress)
// 					VALUES (?, ?, ?, ?)`,
// 				sale.Id, data.Installments[i].Price,
// 				data.Installments[i].PaymentDate, data.Installments[i].Progress,
// 			)
// 			if err != nil {
// 				return fmt.Errorf("transaction update terrain installment insert error: %v", err)
// 			}
// 		} else {
// 			_, err := transaction.ExecContext(
// 				ctx,
// 				`UPDATE installments
// 					SET price = ?, progress = ?
// 					WHERE sale_id = ? AND payment_date = ?`,
// 				data.Installments[i].Price, data.Installments[i].Progress,
// 				sale.Id, data.Installments[i].PaymentDate,
// 			)
// 			if err != nil {
// 				return fmt.Errorf("transaction update terrain installment error: %v", err)
// 			}
// 		}
// 	}

// 	if err = transaction.Commit(); err != nil {
// 		return fmt.Errorf("transaction failed at commit: %v", err)
// 	}
// 	return nil
// }
