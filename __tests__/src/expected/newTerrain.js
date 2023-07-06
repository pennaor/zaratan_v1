import { registeredBuyer01, registeredBuyer02 } from './registeredSoldTerrain';

export const newTerrainDetails = {
  block: '20',
  number: '20',
  address: 'rua dos bobos',
  shape: 'retangular',
  dimensions: '15 X 15',
  area: '4.200,94',
  deed: 'escritura escritura escritura',
  deedDate: '21/06/1990',
  registry: 'registro registro registro',
  observations: 'observações observações observações',
};

export const newSaleDetails = {
  openAt: '29/06/1991',
  closeAt: '29/10/1991',
  installmentCount: '4',
  price: '4.000,80',
  downPayment: '4.000,90',
  paymentType: 'Parcelado',
  progress: 'Aberto',
};

export const newInstallments = [
  {
    paymentDate: '29/07/1991',
    price: '1.000,20',
    progress: 'Quitado',
  },
  {
    paymentDate: '29/08/1991',
    price: '1.000,20',
    progress: 'Adiado',
  },
  {
    paymentDate: '29/09/1991',
    price: '1.000,20',
    progress: 'Quitado',
  },
  {
    paymentDate: '29/10/1991',
    price: '1.000,20',
    progress: 'Pendente',
  },
];

export const newBuyer01 = {
  fullName: 'Josapha Macarrão SA',
  cpf: '',
  cnpj: '36.494.554/0005-55',
  address: '',
  city: '',
  state: '',
  cep: '',
  landLinePhone: '',
  mobilePhone: '',
  email: 'josapha@gmail.com',
  view: {
    fullName: 'Josapha Macarrão SA',
    cpf: 'Não informado',
    cnpj: '36.494.554/0005-55',
    address: 'Não informado',
    city: 'Não informado',
    state: 'Não informado',
    cep: 'Não informado',
    landLinePhone: 'Não informado',
    mobilePhone: 'Não informado',
    email: 'josapha@gmail.com',
  },
};

export const newBuyer02 = {
  fullName: 'Welligton Pé Curto',
  cpf: '123.456.789-36',
  cnpj: '',
  address: 'Rua belto rodrigo 369 AP 801',
  city: 'Belo Horizonte',
  state: 'Minas Gerais',
  cep: '30330-120',
  landLinePhone: '(031) 3231-3231',
  mobilePhone: '(031) 98800-0986',
  email: 'welligton@gmail.com',
  view: {
    fullName: 'Welligton Pé Curto',
    cpf: '123.456.789-36',
    cnpj: 'Não informado',
    address: 'Rua belto rodrigo 369 AP 801',
    city: 'Belo Horizonte',
    state: 'Minas Gerais',
    cep: '30330-120',
    landLinePhone: '(031) 3231-3231',
    mobilePhone: '(031) 98800-0986',
    email: 'welligton@gmail.com',
  },
};

export const newBuyers = [newBuyer01, newBuyer02];

export const newView = {
  details: {
    block: '20',
    number: '20',
    address: 'rua dos bobos',
    shape: 'retangular',
    dimensions: '15 X 15',
    area: '4.200,94 m²',
    deed: 'escritura escritura escritura',
    deedDate: '21/06/1990',
    registry: 'registro registro registro',
    observations: 'observações observações observações',
  },
  sale: {
    details: {
      openAt: '29/06/1991',
      closeAt: '29/10/1991',
      installmentCount: '4',
      price: 'R$ 4.000,80',
      downPayment: 'R$ 4.000,90',
      paymentType: 'Parcelado',
      progress: 'Aberto',
    },
    installments: [
      {
        paymentDate: '29/07/1991',
        price: 'R$ 1.000,20',
        progress: 'Quitado',
      },
      {
        paymentDate: '29/08/1991',
        price: 'R$ 1.000,20',
        progress: 'Adiado',
      },
      {
        paymentDate: '29/09/1991',
        price: 'R$ 1.000,20',
        progress: 'Quitado',
      },
      {
        paymentDate: '29/10/1991',
        price: 'R$ 1.000,20',
        progress: 'Pendente',
      },
    ],
    buyers: [
      newBuyer01.view,
      registeredBuyer01.view,
      registeredBuyer02.view,
      newBuyer02.view,
    ],
  }
};

export const newTerrain = {
  details: newTerrainDetails,
  sale: {
    details: newSaleDetails,
    installments: newInstallments,
    buyers: [
      newBuyer01,
      registeredBuyer01,
      registeredBuyer02,
      newBuyer02,
    ],
  },
  view: newView,
};
