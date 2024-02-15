package ztypes

type TerrainDetailsForm struct {
	Id           string `json:"id"`
	Block        string `json:"block"`
	Number       string `json:"number"`
	Address      string `json:"address"`
	Area         string `json:"area"`
	Shape        string `json:"shape"`
	Dimensions   string `json:"dimensions"`
	Deed         string `json:"deed"`
	DeedDate     string `json:"deedDate"`
	Registry     string `json:"registry"`
	Observations string `json:"observations"`
}

type BuyerForm struct {
	Id            string `json:"id,omitempty"`
	SaleId        string `json:"saleId,omitempty"`
	FullName      string `json:"fullName"`
	Cpf           string `json:"cpf"`
	Cnpj          string `json:"cnpj"`
	LandLinePhone string `json:"landLinePhone"`
	MobilePhone   string `json:"mobilePhone"`
	Email         string `json:"email"`
	Address       string `json:"address"`
	City          string `json:"city"`
	State         string `json:"state"`
	Cep           string `json:"cep"`
}

type BuyersForm []BuyerForm

type InstallmentForm struct {
	Id          string `json:"id,omitempty"`
	SaleId      string `json:"saleId,omitempty"`
	Price       string `json:"price"`
	PaymentDate string `json:"paymentDate"`
	Progress    string `json:"Progress"`
}

type InstallmentsForm []InstallmentForm

type SaleDetailsForm struct {
	Id               string `json:"id,omitempty"`
	TerrainId        string `json:"terrainId,omitempty"`
	OpenAt           string `json:"openAt"`
	CloseAt          string `json:"closeAt"`
	InstallmentCount string `json:"installmentCount"`
	Price            string `json:"price"`
	DownPayment      string `json:"downPayment"`
	PaymentType      string `json:"paymentType"`
	Progress         string `json:"progress"`
}

type SaleForm struct {
	Details      SaleDetailsForm   `json:"details"`
	Buyers       BuyersForm        `json:"buyers"`
	Installments *InstallmentsForm `json:"installments"`
}

type TerrainForm struct {
	Details TerrainDetailsForm `json:"details"`
	Sale    *SaleForm          `json:"sale"`
}
