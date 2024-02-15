export const registeredSoldTerrainDetails = {
  block: '6',
  number: '1',
  address: 'rua da quadra 6 lote 1. rua da quadra 6 lote 1. rua da quadra 6 lote 1. rua da quadra 6 lote 1.',
  area: '66.100,1',
  shape: 'Retângulo',
  dimensions: 'Base: 100m. Altura: 60m.',
  deed: 'escritura quadra 6 lote 1',
  deedDate: '20/12/1979',
  registry: 'REGISTRO QUADRA 6 LOTE 1. REGISTRO QUADRA 6 LOTE 1. REGISTRO QUADRA 6 LOTE 1.',
  observations: 'QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação.\nQUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação.',
};

export const registeredSaleDetails = {
  openAt: '02/09/1980',
  closeAt: '02/11/1980',
  installmentCount: '2',
  price: '2.000,66',
  downPayment: '2.000,66',
  paymentType: 'Parcelado',
  progress: 'Fechado',
};

export const registeredInstallments = [
  {
    price: '1.000,33',
    paymentDate: '02/10/1980',
    progress: 'Quitado',
  },
  {
    price: '1.000,33',
    paymentDate: '02/11/1980',
    progress: 'Quitado',
  },
];

export const registeredBuyer01 = {
  selectTag: 'Lotedor | 77.474.774/0001-71',
  fullName: 'Lotedor Company',
  cpf: '',
  cnpj: '77.474.774/0001-71',
  landLinePhone: '(031) 3333-3333',
  mobilePhone: '',
  email: 'sac@lotedorcompany.com',
  address: 'Avenida Savassi, Bairro Contorno, 942',
  city: 'Salvador',
  state: 'Bahia',
  cep: '40444-490',
  view: {
    fullName: 'Lotedor Company',
    cpf: 'Não informado',
    cnpj: '77.474.774/0001-71',
    landLinePhone: '(031) 3333-3333',
    mobilePhone: 'Não informado',
    email: 'sac@lotedorcompany.com',
    address: 'Avenida Savassi, Bairro Contorno, 942',
    city: 'Salvador',
    state: 'Bahia',
    cep: '40444-490',
  },
};

export const registeredBuyer02 = {
  selectTag: 'Vitória | 134.889.266-36',
  fullName: 'Vitória Teixeira Sampaio Da Silva',
  cpf: '134.889.266-36',
  cnpj: '',
  address: 'Rua Paracatu, Bairro Parque Imperial, 598',
  city: 'São Paulo',
  state: 'São Paulo',
  cep: '03962-040',
  landLinePhone: '(031) 3330-4333',
  mobilePhone: '',
  email: 'vitoriateixeira@gmail.com',
  view: {
    fullName: 'Vitória Teixeira Sampaio Da Silva',
    cpf: '134.889.266-36',
    cnpj: 'Não informado',
    address: 'Rua Paracatu, Bairro Parque Imperial, 598',
    city: 'São Paulo',
    state: 'São Paulo',
    cep: '03962-040',
    landLinePhone: '(031) 3330-4333',
    mobilePhone: 'Não informado',
    email: 'vitoriateixeira@gmail.com',
  },
};

export const registeredBuyers = [registeredBuyer01, registeredBuyer02];

export const registeredSoldView = {
  details: {
    block: '6',
    number: '1',
    address: 'rua da quadra 6 lote 1. rua da quadra 6 lote 1. rua da quadra 6 lote 1. rua da quadra 6 lote 1.',
    area: '66.100,1 m²',
    shape: 'Retângulo',
    dimensions: 'Base: 100m. Altura: 60m.',
    deed: 'escritura quadra 6 lote 1',
    deedDate: '20/12/1979',
    registry: 'REGISTRO QUADRA 6 LOTE 1. REGISTRO QUADRA 6 LOTE 1. REGISTRO QUADRA 6 LOTE 1.',
    observations: 'QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação.\nQUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação.',
  },
  sale: {
    details: {
      openAt: '02/09/1980',
      closeAt: '02/11/1980',
      installmentCount: '2',
      price: 'R$ 2.000,66',
      downPayment: 'R$ 2.000,66',
      paymentType: 'Parcelado',
      progress: 'Fechado',
    },
    installments: [
      {
        price: 'R$ 1.000,33',
        paymentDate: '02/10/1980',
        progress: 'Quitado',
      },
      {
        price: 'R$ 1.000,33',
        paymentDate: '02/11/1980',
        progress: 'Quitado',
      },
    ],
    buyers: [
      registeredBuyer01.view,
      registeredBuyer02.view,
    ],
  }
};

export const registeredSoldTerrain = {
  details: registeredSoldTerrainDetails,
  sale: {
    details: registeredSaleDetails,
    buyers: registeredBuyers,
    installments: registeredInstallments,
  },
};
