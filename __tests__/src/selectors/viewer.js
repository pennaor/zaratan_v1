export const viewer = {
  terrainDetails: {
    block: '[data-testid="block-terrain-details-viewer"]',
    number: '[data-testid="number-terrain-details-viewer"]',
    address: '[data-testid="address-terrain-details-viewer"]',
    area: '[data-testid="area-terrain-details-viewer"]',
    shape: '[data-testid="shape-terrain-details-viewer"]',
    dimensions: '[data-testid="dimensions-terrain-details-viewer"]',
    deed: '[data-testid="deed-terrain-details-viewer"]',
    deedDate: '[data-testid="deedDate-terrain-details-viewer"]',
    registry: '[data-testid="registry-terrain-details-viewer"]',
    observations: '[data-testid="observations-terrain-details-viewer"]',
  },
  sale: {
    details: {
      openAt: '[data-testid="openAt-sale-details-viewer"]',
      closeAt: '[data-testid="closeAt-sale-details-viewer"]',
      installmentCount: '[data-testid="installmentCount-sale-details-viewer"]',
      price: '[data-testid="price-sale-details-viewer"]',
      downPayment: '[data-testid="downPayment-sale-details-viewer"]',
      paymentType: '[data-testid="paymentType-sale-details-viewer"]',
      progress: '[data-testid="progress-sale-details-viewer"]',
    },
    installment: {
      price: '[data-testid="price-installment-viewer"]',
      paymentDate: '[data-testid="paymentDate-installment-viewer"]',
      progress: '[data-testid="progress-installment-viewer"]',
    },
    buyer: {
      fullName: '[data-testid="fullName-buyer-viewer"]',
      cpf: '[data-testid="cpf-buyer-viewer"]',
      cnpj: '[data-testid="cnpj-buyer-viewer"]',
      landLinePhone: '[data-testid="landLinePhone-buyer-viewer"]',
      mobilePhone: '[data-testid="mobilePhone-buyer-viewer"]',
      email: '[data-testid="email-buyer-viewer"]',
      address: '[data-testid="address-buyer-viewer"]',
      city: '[data-testid="city-buyer-viewer"]',
      state: '[data-testid="state-buyer-viewer"]',
      cep: '[data-testid="cep-buyer-viewer"]',
    },
  },
};

export const terrainTestId = '[data-testid^="terrain-"]';
export const terrainOneTestId = '[data-testid="terrain-1"]';
export const terrainTwoTestId = '[data-testid="terrain-2"]';
export const terrainFiveTestId = '[data-testid="terrain-5"]';
export const terrainRegisteredTestId = '[data-testid="terrain-10"]'
export const terrainUnsoldRegisteredTestId = '[data-testid="terrain-6"]'
export const terrainTwelveTestId = '[data-testid="terrain-12"]';

export const expandMoreIcon = '[data-testid^="ExpandMoreIcon"]';
export const editTerrainButton = '[data-testid="edit-terrain-button-viewer"]';
export const deleteTerrainButton = '[data-testid="delete-terrain-button-viewer"]';

export const emptySaleDetails = '[data-testid="sale-details-empty"]';
export const emptyInstallments = '[data-testid="sale-installments-empty"]';
export const emptyBuyers = '[data-testid="sale-buyers-empty"]';
