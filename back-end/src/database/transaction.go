package database

import (
	"context"
	"database/sql"
	"fmt"
)

type Transaction struct {
	tx  *sql.Tx
	ctx *context.Context
}

func NewTx(db *sql.DB) (*Transaction, error) {
	ctx := context.Background()
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("transaction error: %v", err)
	}

	return &Transaction{tx: tx, ctx: &ctx}, nil
}

func (T *Transaction) Exec(query string, args ...interface{}) (sql.Result, error) {
	return T.tx.ExecContext(*T.ctx, query, args...)
}

func (T *Transaction) RollBack() error {
	return T.tx.Rollback()
}

func (T *Transaction) Commit() error {
	return T.tx.Commit()
}
