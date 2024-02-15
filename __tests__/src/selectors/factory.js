export const terrainCreator = '[data-testid="terrain-creator"]';

export const stepLabel = '[data-testid^="step-label"]';

export const steps = {
  config: {
    content: {
      hidden: '[data-testid="step-content-config"] > .MuiCollapse-hidden',
      visible: '[data-testid="step-content-config"] > .MuiCollapse-entered',  
    },
    label: {
      active: '[data-testid="step-label-config"] .MuiStepLabel-label.Mui-active',
      completed: '[data-testid="step-label-config"] .MuiStepLabel-label.Mui-completed',
      disabled: '[data-testid="step-label-config"] .MuiStepLabel-label.Mui-disabled',
    },
    title: '[data-testid="factory-config-step-title"]',
    subtitle: '[data-testid="factory-config-step-subtitle"]',
    hasSaleLabel: '[data-testid="factory-config-step-has-sale-label"]',
    hasSaleCheckbox: '[data-testid="factory-config-step-has-sale-checkbox"]',
    mainButton: '[data-testid="config-step-controller-main-button"]',
    secondaryButton: '[data-testid="config-step-controller-secondary-button"]',
  },
  terrainDetails: {
    content: {
      hidden: '[data-testid="step-content-terrain-details"] > .MuiCollapse-hidden',
      visible: '[data-testid="step-content-terrain-details"] > .MuiCollapse-entered',
    },
    label: {
      active: '[data-testid="step-label-terrain-details"] .MuiStepLabel-label.Mui-active',
      completed: '[data-testid="step-label-terrain-details"] .MuiStepLabel-label.Mui-completed',
      disabled: '[data-testid="step-label-terrain-details"] .MuiStepLabel-label.Mui-disabled',
    },
    mainButton: '[data-testid="terrain-details-step-controller-main-button"]',
    secondaryButton: '[data-testid="terrain-details-step-controller-secondary-button"]',
    block: {
      label: '#block-label-terrain-details-form',
      input: '[data-testid="block-input-terrain-details-form"]',
      report: '[data-testid="block-terrain-details-field-helper-report"]',
    },
    number: {
      label: '#number-label-terrain-details-form',
      input: '[data-testid="number-input-terrain-details-form"]',
      report: '[data-testid="number-terrain-details-field-helper-report"]',
    },
    address: {
      label: '#address-label-terrain-details-form',
      input: '[data-testid="address-input-terrain-details-form"]',
      report: '[data-testid="address-terrain-details-field-helper-report"]',
      constraint: '[data-testid="address-terrain-details-field-helper-constraint"]',
    },
    shape: {
      label: '#shape-label-terrain-details-form',
      input: '[data-testid="shape-input-terrain-details-form"]',
      report: '[data-testid="shape-terrain-details-field-helper-report"]',
      constraint: '[data-testid="shape-terrain-details-field-helper-constraint"]',
    },
    dimensions: {
      label: '#dimensions-label-terrain-details-form',
      input: '[data-testid="dimensions-input-terrain-details-form"]',
      report: '[data-testid="dimensions-terrain-details-field-helper-report"]',
      constraint: '[data-testid="dimensions-terrain-details-field-helper-constraint"]',
    },
    area: {
      label: '#area-label-terrain-details-form',
      input: '[data-testid="area-input-terrain-details-form"]',
      report: '[data-testid="area-terrain-details-field-helper-report"]',
    },
    deed: {
      label: '#deed-label-terrain-details-form',
      input: '[data-testid="deed-input-terrain-details-form"]',
      report: '[data-testid="deed-terrain-details-field-helper-report"]',
      constraint: '[data-testid="deed-terrain-details-field-helper-constraint"]',
    },
    deedDate: {
      label: '#deedDate-label-terrain-details-form',
      input: '[data-testid="deedDate-input-terrain-details-form"]',
      report: '[data-testid="deedDate-terrain-details-field-helper-report"]',
    },
    registry: {
      label: '#registry-label-terrain-details-form',
      input: '[data-testid="registry-input-terrain-details-form"]',
      report: '[data-testid="registry-terrain-details-field-helper-report"]',
      constraint: '[data-testid="registry-terrain-details-field-helper-constraint"]',
    },
    observations: {
      label: '#observations-label-terrain-details-form',
      input: '[data-testid="observations-input-terrain-details-form"]',
      report: '[data-testid="observations-terrain-details-field-helper-report"]',
      constraint: '[data-testid="observations-terrain-details-field-helper-constraint"]',
    },
  },
  saleDetails: {
    content: {
      hidden: '[data-testid="step-content-sale-details"] > .MuiCollapse-hidden',
      visible: '[data-testid="step-content-sale-details"] > .MuiCollapse-entered',
    },
    label: {
      active: '[data-testid="step-label-sale-details"] .MuiStepLabel-label.Mui-active',
      completed: '[data-testid="step-label-sale-details"] .MuiStepLabel-label.Mui-completed',
      disabled: '[data-testid="step-label-sale-details"] .MuiStepLabel-label.Mui-disabled',
    },
    mainButton: '[data-testid="sale-details-step-controller-main-button"]',
    secondaryButton: '[data-testid="sale-details-step-controller-secondary-button"]',
    openAt: {
      label: '#openAt-label-sale-details-form',
      input: '[data-testid="openAt-input-sale-details-form"]',
      report: '[data-testid="openAt-sale-details-field-helper-report"]',
    },
    closeAt: {
      label: '#closeAt-label-sale-details-form',
      input: '[data-testid="closeAt-input-sale-details-form"]',
      report: '[data-testid="closeAt-sale-details-field-helper-report"]',      
    },
    price: {
      label: '#price-label-sale-details-form',
      input: '[data-testid="price-input-sale-details-form"]',
      report: '[data-testid="price-sale-details-field-helper-report"]',
    },
    downPayment: {
      label: '#downPayment-label-sale-details-form',
      input: '[data-testid="downPayment-input-sale-details-form"]',
      report: '[data-testid="downPayment-sale-details-field-helper-report"]',
    },
    paymentType: {
      content: '[data-testid="paymentType-content-sale-details-form"]',
      title: '#paymentType-title-sale-details-form',
      inCash: {
        content: '[data-testid="inCash-paymentType-content-sale-details-form"]',
        label: '[data-testid="inCash-paymentType-content-sale-details-form"] > span:last-child',
        spanInput: '[data-testid="inCash-paymentType-content-sale-details-form"] > span:first-child',
      },
      inInstallments: {
        content: '[data-testid="installments-paymentType-content-sale-details-form"]',
        label: '[data-testid="installments-paymentType-content-sale-details-form"] > span:last-child',
        spanInput: '[data-testid="installments-paymentType-content-sale-details-form"] > span:first-child',
      },
    },
    installmentCount: {
      label: '#installmentCount-label-sale-details-form',
      input: '[data-testid="installmentCount-input-sale-details-form"]',
      report: '[data-testid="installmentCount-sale-details-field-helper-report"]',
    },
    progress: {
      content: '[data-testid="progress-content-sale-details-form"]',
      title: '#progress-title-sale-details-form',
      open: {
        content: '[data-testid="open-progress-content-sale-details-form"]',
        label: '[data-testid="open-progress-content-sale-details-form"] > span:last-child',
        spanInput: '[data-testid="open-progress-content-sale-details-form"] > span:first-child',
      },
      close: {
        content: '[data-testid="close-progress-content-sale-details-form"]',
        label: '[data-testid="close-progress-content-sale-details-form"] > span:last-child',
        spanInput: '[data-testid="close-progress-content-sale-details-form"] > span:first-child',
      },
    },
  },
  installments: {
    content: {
      hidden: '[data-testid="step-content-installments"] > .MuiCollapse-hidden',
      visible: '[data-testid="step-content-installments"] > .MuiCollapse-entered',
    },
    label: {
      active: '[data-testid="step-label-installments"] .MuiStepLabel-label.Mui-active',
      completed: '[data-testid="step-label-installments"] .MuiStepLabel-label.Mui-completed',
      disabled: '[data-testid="step-label-installments"] .MuiStepLabel-label.Mui-disabled',
    },
    addButton: '[data-testid="add-installment-button"]',
    deferredProgressIcon: '[data-testid^="deferred-progress-icon-installment-form"]',
    mainButton: '[data-testid="installment-step-controller-main-button"]',
    secondaryButton: '[data-testid="installment-step-controller-secondary-button"]',
    installment: {
      content: 'installment-content',
      removeButton: '[data-testid="remove-installment-button"]',
      sortButton: '[data-testid="sort-installments-button"]',
      progress: {
        content: '[data-testid^="progress-content-installment-form"]',
        title: '[id^="progress-title-installment-form"]',
        pending: {
          content: '[data-testid^="pending-progress-content-installment-form"]',
          label: '[data-testid^="pending-progress-content-installment-form"] > span:last-child',
          spanInput: '[data-testid^="pending-progress-content-installment-form"] > span:first-child',
        },
        settled: {
          content: '[data-testid^=settled-progress-content-installment-form]',
          label: '[data-testid^="settled-progress-content-installment-form"] > span:last-child',
          spanInput: '[data-testid^="settled-progress-content-installment-form"] > span:first-child',        
        },
        deferred: {
          content: '[data-testid^=deferred-progress-content-installment-form]',
          label: '[data-testid^="deferred-progress-content-installment-form"] > span:last-child',
          spanInput: '[data-testid^="deferred-progress-content-installment-form"] > span:first-child',           
        },
      },
      paymentDate: {
        label: '[id^="paymentDate-label-installment-form"]',
        input: '[data-testid^="paymentDate-input-installment-form"]',
        report: '[data-testid$="paymentDate-installment-field-helper-report"]',
      },
      price: {
        label: '[id^="price-label-installment-form"]',
        input: '[data-testid^="price-input-installment-form"]',
        report: '[data-testid$="price-installment-field-helper-report"]',
      },
      deferredPrice: {
        label: '[id^="price-label-deferred-installment-form"]',
        input: '[data-testid^="price-input-deferred-installment-form"]',
        info: '[data-testid^="deferred-info-installment"]',
      },
    },
  },
  buyers: {
    content: {
      hidden: '[data-testid="step-content-buyers"] > .MuiCollapse-hidden',
      visible: '[data-testid="step-content-buyers"] > .MuiCollapse-entered',
    },
    label: {
      active: '[data-testid="step-label-buyers"] .MuiStepLabel-label.Mui-active',
      completed: '[data-testid="step-label-buyers"] .MuiStepLabel-label.Mui-completed',
      disabled: '[data-testid="step-label-buyers"] .MuiStepLabel-label.Mui-disabled',
    },
    mainButton: '[data-testid="buyer-step-controller-main-button"]',
    secondaryButton: '[data-testid="buyer-step-controller-secondary-button"]',
    addButton: {
      button: '[data-testid="add-buyer-button"]',
      text: '[data-testid="add-buyer-button"] ~ span.MuiTypography-button',
    },
    selectBuyers: {
      content: '[data-testid="select-buyers-content"]',
      label: '[data-testid="select-buyers-label"]',
      input: '[data-testid="select-buyers-input"]',
      doneButton: '[data-testid="select-buyers-done-button"]',
      menu: '[data-testid="select-buyers-menu"]',
    },
    buyer: {
      content: 'buyer-content',
      removeButton: '[data-testid="remove-buyer-button"]',
      sortButton: '[data-testid="sort-buyers-button"]',
      fullName: {
        input: '[data-testid="fullName-input-buyer-form"]',
        label: '#fullName-label-buyer-form',
        report: '[data-testid="fullName-buyer-field-helper-report"]',
        constraint: '[data-testid="fullName-buyer-field-helper-constraint"]',
      },
      cpf: {
        input: '[data-testid="cpf-input-buyer-form"]',
        label: '#cpf-label-buyer-form',
        report: '[data-testid="cpf-buyer-field-helper-report"]',
        constraint: '[data-testid="cpf-buyer-field-helper-constraint"]',
      },
      cnpj: {
        input: '[data-testid="cnpj-input-buyer-form"]',
        label: '#cnpj-label-buyer-form',
        report: '[data-testid="cnpj-buyer-field-helper-report"]',
        constraint: '[data-testid="cnpj-buyer-field-helper-constraint"]',
      },
      address: {
        input: '[data-testid="address-input-buyer-form"]',
        label: '#address-label-buyer-form',
        report: '[data-testid="address-buyer-field-helper-report"]',
        constraint: '[data-testid="address-buyer-field-helper-constraint"]',
      },
      state: {
        input: '[data-testid="state-input-buyer-form"]',
        label: '#state-label-buyer-form',
        report: '[data-testid="state-buyer-field-helper-report"]',
        constraint: '[data-testid="state-buyer-field-helper-constraint"]',
      },
      city: {
        input: '[data-testid="city-input-buyer-form"]',
        label: '#city-label-buyer-form',
        report: '[data-testid="city-buyer-field-helper-report"]',
        constraint: '[data-testid="city-buyer-field-helper-constraint"]',
      },
      cep: {
        input: '[data-testid="cep-input-buyer-form"]',
        label: '#cep-label-buyer-form',
        report: '[data-testid="cep-buyer-field-helper-report"]',
        constraint: '[data-testid="cep-buyer-field-helper-constraint"]',
      },
      mobilePhone: {
        input: '[data-testid="mobilePhone-input-buyer-form"]',
        label: '#mobilePhone-label-buyer-form',
        report: '[data-testid="mobilePhone-buyer-field-helper-report"]',
        constraint: '[data-testid="mobilePhone-buyer-field-helper-constraint"]',
      },
      landLinePhone: {
        input: '[data-testid="landLinePhone-input-buyer-form"]',
        label: '#landLinePhone-label-buyer-form',
        report: '[data-testid="landLinePhone-buyer-field-helper-report"]',
        constraint: '[data-testid="landLinePhone-buyer-field-helper-constraint"]',
      },
      email: {
        input: '[data-testid="email-input-buyer-form"]',
        label: '#email-label-buyer-form',
        report: '[data-testid="email-buyer-field-helper-report"]',
        constraint: '[data-testid="email-buyer-field-helper-constraint"]',
      },
    },
  },
  overview: {
    content: {
      hidden: '[data-testid="step-content-overview"] > .MuiCollapse-hidden',
      visible: '[data-testid="step-content-overview"] > .MuiCollapse-entered',
    },
    label: {
      active: '[data-testid="step-label-overview"] .MuiStepLabel-label.Mui-active',
      completed: '[data-testid="step-label-overview"] .MuiStepLabel-label.Mui-completed',
      disabled: '[data-testid="step-label-overview"] .MuiStepLabel-label.Mui-disabled',
    },
    mainButton: '[data-testid="overview-step-controller-main-button"]',
    secondaryButton: '[data-testid="overview-step-controller-secondary-button"]',
    terrain: {
      details: {
        block: '[data-testid="overview-block-terrain-details"]',
        number: '[data-testid="overview-number-terrain-details"]',
        address: '[data-testid="overview-address-terrain-details"]',
        area: '[data-testid="overview-area-terrain-details"]',
        shape: '[data-testid="overview-shape-terrain-details"]',
        dimensions: '[data-testid="overview-dimensions-terrain-details"]',
        deed: '[data-testid="overview-deed-terrain-details"]',
        deedDate: '[data-testid="overview-deedDate-terrain-details"]',
        registry: '[data-testid="overview-registry-terrain-details"]',
        observations: '[data-testid="overview-observations-terrain-details"]',        
      },
      sale: {
        details: {
          openAt: '[data-testid="overview-openAt-sale-details"]',
          closeAt: '[data-testid="overview-closeAt-sale-details"]',
          installmentCount: '[data-testid="overview-installmentCount-sale-details"]',
          price: '[data-testid="overview-price-sale-details"]',
          downPayment: '[data-testid="overview-downPayment-sale-details"]',
          paymentType: '[data-testid="overview-paymentType-sale-details"]',
          progress: '[data-testid="overview-progress-sale-details"]',
        },
        installment: {
          price: 'overview-price-installment',
          paymentDate: 'overview-paymentDate-installment',
          progress: 'overview-progress-installment',
        },
        buyer: {
          fullName: 'overview-fullName-buyer',
          cpf: 'overview-cpf-buyer',
          cnpj: 'overview-cnpj-buyer',
          landLinePhone: 'overview-landLinePhone-buyer',
          mobilePhone: 'overview-mobilePhone-buyer',
          email: 'overview-email-buyer',
          address: 'overview-address-buyer',
          city: 'overview-city-buyer',
          state: 'overview-state-buyer',
          cep: 'overview-cep-buyer',
        },
      },
    },
  },
};
