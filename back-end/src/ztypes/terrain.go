package ztypes

type terrainReport struct {
	Details *terrainDetailsReport `json:"details,omitempty"`
	Sale    *saleReport           `json:"sale,omitempty"`
}

func (TR *terrainReport) hasInvalidField() bool {
	return TR.Details != nil || TR.Sale != nil
}

type Terrain struct {
	Details TerrainDetails `json:"details"`
	Sale    *Sale          `json:"sale"`
	report  *terrainReport
}

func (T *Terrain) ParseForm(form TerrainForm) (*terrainReport, error) {
	var err error
	T.report = new(terrainReport)

	T.report.Details, err = T.Details.ParseForm(form.Details)
	if err != nil {
		return nil, err
	}

	if form.Sale != nil {
		T.Sale = &Sale{Details: SaleDetails{TerrainId: T.Details.Id}}
		T.report.Sale, err = T.Sale.ParseForm(*form.Sale)
		if err != nil {
			return nil, err
		}
	}

	if T.report.hasInvalidField() {
		return T.report, nil
	}

	T.report = nil

	return nil, nil
}
