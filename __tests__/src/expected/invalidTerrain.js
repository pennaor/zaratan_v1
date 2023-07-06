export const invalidTerrainDetails = {
  block: {
    required: { value: '', message: 'Quadra precisa ser número inteiro positivo acima de 0' },
    mustBeNumber: { value: 'abc', message: 'Quadra precisa ser número inteiro positivo acima de 0' },
    mustBeInteger: { value: '1.5', message: 'Quadra precisa ser número inteiro positivo acima de 0' },
    mustBePositive: { value: '-1.5', message: 'Quadra precisa ser número inteiro positivo acima de 0' },
    cannotBeZero: { value: '0', message: 'Quadra precisa ser número inteiro positivo acima de 0' },
  },
  number: {
    required: { value: '', message: 'Lote precisa ser número inteiro positivo acima de 0' },
    mustBeNumber: { value: 'abc', message: 'Lote precisa ser número inteiro positivo acima de 0' },
    mustBeInteger: { value: '1.5', message: 'Lote precisa ser número inteiro positivo acima de 0' },
    mustBePositive: { value: '-1.5', message: 'Lote precisa ser número inteiro positivo acima de 0' },
    cannotBeZero: { value: '0', message: 'Lote precisa ser número inteiro positivo acima de 0' },
  },
  address: {
    required: { value: '', message: 'Endereço deve possuir de 8 a 125 caracteres' },
    notLengthEnough: { value: '1234567', message: 'Endereço deve possuir de 8 a 125 caracteres' },
  },
  shape: {
    required: { value: '', message: 'Formato deve possuir de 4 a 25 caracteres' },
    notLengthEnough: { value: 'abc', message: 'Formato deve possuir de 4 a 25 caracteres' },
  },
  dimensions: {
    required: { value: '', message: 'Dimensões deve possuir de 4 a 125 caracteres' },
    notLengthEnough: { value: 'abc', message: 'Dimensões deve possuir de 4 a 125 caracteres' },
  },
  area: {
    required: { value: '', message: 'Área precisa ser número positivo acima de 0' },
    mustBeNumber: { value: 'abc', message: 'Área precisa ser número positivo acima de 0' },
    mustBePositive: { value: '-1.5', message: 'Área precisa ser número positivo acima de 0' },
    cannotBeZero: { value: '0', message: 'Área precisa ser número positivo acima de 0' },
  },
  deed: {
    notLengthEnough: {
      value: '1234567',
      message: 'Escritura deve possuir de 8 a 125 caracteres',
      date: {
        value: '21/06/1994',
        message: 'Escritura deve ser válida para que possa ser datada'
      },
    },
    mustHaveDate: {
      value: '12345678',
      message: '',
      date: {
        value: '',
        message: 'Escritura deve possuir data',
      },
    },
  },
  registry: {
    notLengthEnough: { value: '1234567', message: 'Registro deve possuir de 8 a 125 caracteres' },
  },
  observations: {
    notLengthEnough: { value: '1234567', message: 'Observações pode possuir até 125 caracteres' },
  }
}

export const invalidSaleDetails = {
  dates: {
    yearMustHaveFourChars: { value: '21/06/19994' , message: 'Ano deve possuir 4 algarismos' },
    monthDoesntHaveDay: { value: '30/02/1994', message: 'Data inválida' },
    emptyDate: { value: '', message: 'Data inválida' },
    openAtCannotBeInFuture: { value: '21/06/9999', message: 'Data não pode ser no futuro' },
    openAtMustBeBeforeCloseAt: {
      openAt: { value: '21/06/1994', message: 'Data de abertura deve ser igual ou anterior a data de encerramento' },
      closeAt: { value: '20/05/1993', message: 'Data de encerramento deve ser igual ou posterior a de abertura' },
    },
  },
  price: {
    required: { value: '', message: 'Preço precisa ser número positivo maior que zero' },
    mustBeNumber: { value: 'abc', message: 'Preço precisa ser número positivo maior que zero' },
    mustBePositive: { value: '-1.5', message: 'Preço precisa ser número positivo maior que zero' },
    cannotBeZero: { value: '0', message: 'Preço precisa ser número positivo maior que zero' },
  },
  downPayment: {
    required: { value: '', message: 'Sinal precisa ser número positivo maior que zero' },
    mustBeNumber: { value: 'abc', message: 'Sinal precisa ser número positivo maior que zero' },
    mustBePositive: { value: '-1.5', message: 'Sinal precisa ser número positivo maior que zero' },
    cannotBeZero: { value: '0', message: 'Sinal precisa ser número positivo maior que zero' },    
  },
  installmentCount: {
    required: { value: '', message: 'Número de parcelas precisa ser número inteiro positivo' },
    mustBeNumber: { value: 'abc', message: 'Número de parcelas precisa ser número inteiro positivo' },
    mustBeInteger: { value: '1.5', message: 'Número de parcelas precisa ser número inteiro positivo' },
    mustBePositive: { value: '-1.5', message: 'Número de parcelas precisa ser número inteiro positivo' },
    mustBeTwoOrGreater: { value: '0', message: 'Número de parcelas precisa ser no mínimo 2' },
  },
};

export const invalidInstallments = {
  paymentDate: {
    yearMustHaveFourChars: { value: '21/06/19994' , message: 'Ano deve possuir 4 algarismos' },
    monthDoesntHaveDay: { value: '30/02/1994', message: 'Data inválida' },
    required: { value: '', message: 'Data inválida' },
  },
  price: {
    required: { value: '', message: 'Valor da parcela precisa ser número positivo' },
    mustBeNumber: { value: 'abc', message: 'Valor da parcela precisa ser número positivo' },
    mustBePositive: { value: '-1.5', message: 'Valor da parcela não pode ser negativo' },
    cannotBeZero: { value: '0', message: 'Valor da parcela não pode ser 0' },
  },
};

export const invalidBuyers = {
  cpf: {
    required: { value: '', message: 'Comprador deve possuir CPF ou CNPJ' },
    mustHaveFormat: { value: 'abcd', message: 'CPF deve possuir formato \'000.000.000-00\'' },
  },
  cnpj: {
    required: { value: '', message: 'Comprador deve possuir CPF ou CNPJ' },
    mustHaveFormat: { value: 'abcd', message: 'CNPJ deve possuir formato \'00.000.000/0000-00\'' },
  },
  fullName: {
    required: { value: '', message: 'Nome completo deve possuir ao menos 12 caracteres' },
    notEnoughLength: { value: '1234567891', message: 'Nome completo deve possuir ao menos 12 caracteres' }, 
  },
  cep: {
    mustHaveFormat: { value: '30330-12', message: 'CEP deve possuir 9 caracteres' },
  },
  mobilePhone: {
    mustHaveFormat: { value: '03198888-8888', message: 'Celular deve possuir formato \'(DDD) 90000-0000\'' },
  },
  landLinePhone: {
    mustHaveFormat: { value: '05532944949', message: 'Telefone deve possuir formato \'(DDD) 0000-0000\'' },
  },
}

export const invalidTerrain = {
  details: invalidTerrainDetails,
  sale: {
    details: invalidSaleDetails,
    installments: invalidInstallments,
    buyers: invalidBuyers,
  },
};
