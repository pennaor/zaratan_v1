import * as expected from '../expected';
import * as actions from './actions';
import { resetDB } from './database';
import {
  clearStorages,
  DecoratedHandle,
} from './helpers';
import selectors from '../selectors';
import brDateToISO from '../utils/brDateToISO';
import options from '../config/jest/puppeteerOptions';

describe('PASSO A PASSO DE REGISTRO DE LOTE COM VENDA', () => {
  beforeAll(async () => {
    await resetDB(dbPool);
    await actions.login(page);
    (await page.waitForSelector(selectors.navigation.register)).click();
    await page.waitForSelector(selectors.terrainCreator);
  });

  afterAll(async () => {
    await clearStorages(page);
  });

  describe('1 - CONFIGURAÇÔES', () => {
    const optionalIt = options.factory.testCoreOnly.config ? it.skip : it;

    optionalIt('apenas as labels dos passos "Configurações", "Informações básicas" e "Visão geral" devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelHandles = await pageHandle.findAll(selectors.stepLabel);
      expect(labelHandles).toHaveLength(expected.steps.withoutSale.length);

      labelHandles.forEach((handle, i) => {
        expect(handle).toHaveTextContent(expected.steps.withoutSale[i])
      });
    });

    optionalIt('"Configurações" deve ter label "active". As labels de outros passos devem estar "disabled"', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const labelSelectors = [
        selectors.steps.config.label.active,
        selectors.steps.terrainDetails.label.disabled,
        selectors.steps.overview.label.disabled,
      ];
      await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)));
    });

    optionalIt('"Configurações" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
      const pageHandle = new DecoratedHandle(page);

      const contentSelectors = [
        selectors.steps.config.content.visible,
        selectors.steps.terrainDetails.content.hidden,
        selectors.steps.overview.content.hidden];
      await Promise.all(contentSelectors.map((value) => pageHandle.findOne(value)));
    });
    
    it('os componentes de "Configurações" devem estar presentes', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const titleHandle = await pageHandle.findOne(selectors.steps.config.title);
      expect(titleHandle).toHaveTextContent('Registrar lote');
  
      const hasSaleLabelHandle = await pageHandle.findOne(selectors.steps.config.hasSaleLabel);
      expect(hasSaleLabelHandle).toHaveTextContent('Possui venda?');
  
      await pageHandle.findOne(selectors.steps.config.hasSaleCheckbox);
  
      const mainButtonHandle = await pageHandle.findOne(selectors.steps.config.mainButton);
      expect(mainButtonHandle).toHaveTextContent('Iniciar');
      expect(mainButtonHandle).toBeEnabled();

      const secondaryButtonHandle = await pageHandle.findOne(selectors.steps.config.secondaryButton);
      expect(secondaryButtonHandle).toHaveTextContent('Voltar');
      expect(secondaryButtonHandle).toBeDisabled();
    });

    it('deve ser possível marcar checkbox "Possui venda?"', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const checkboxHandle = await pageHandle.findOne(selectors.steps.config.hasSaleCheckbox);
      expect(checkboxHandle).not.toIncludeClass('Mui-checked');
      await checkboxHandle.click();
      expect(checkboxHandle).toIncludeClass('Mui-checked');
    });

    optionalIt('com checkbox "Possui venda?" marcado, o passo de "Configurações" deve possuir label "active". Os demais devem ter labels "disabled"', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelSelectors = [
        selectors.steps.config.label.active,
        selectors.steps.terrainDetails.label.disabled,
        selectors.steps.saleDetails.label.disabled,
        selectors.steps.installments.label.disabled,
        selectors.steps.buyers.label.disabled,
        selectors.steps.overview.label.disabled,
      ];
      await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
    });

    optionalIt('com checkbox "Possui venda?" marcado, todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelHandles = await pageHandle.findAll(selectors.stepLabel);
      expect(labelHandles).toHaveLength(expected.steps.withSale.length);

      labelHandles.forEach((handle, i) => {
        expect(handle).toHaveTextContent(expected.steps.withSale[i])
      });
    });

    optionalIt('com checkbox "Possui venda?" marcado, o passo "Configurações" deve permanecer expandido. Os demais passos não devem estar expandidos', async () => {
      const pageHandle = new DecoratedHandle(page);

      const contentSelectors = [
        selectors.steps.config.content.visible,
        selectors.steps.terrainDetails.content.hidden,
        selectors.steps.saleDetails.content.hidden,
        selectors.steps.installments.content.hidden,
        selectors.steps.buyers.content.hidden,
        selectors.steps.overview.content.hidden,
      ];
      await Promise.all(contentSelectors.map((selector) => pageHandle.findOne(selector)));
    });

    it('botão "Iniciar" deve levar ao passo de "Informações básicas"', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const initButtonHandle = await pageHandle.findOne(selectors.steps.config.mainButton);
      await initButtonHandle.click();
  
      await pageHandle.findOne(selectors.steps.terrainDetails.content.visible);
    });
  });

  describe('2 - INFORMAÇÕES BÁSICAS', () => {
    const optionalIt = options.factory.testCoreOnly.terrainDetails ? it.skip : it;

    describe('2.1 - COMPONENTES GERAIS', () => {
      it('botões "Próximo" e "Reiniciar" devem estar presentes', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        expect(nextButtonHandle).toHaveTextContent('Próximo');
        expect(nextButtonHandle).toBeEnabled();

        const reinitButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.secondaryButton);
        expect(reinitButtonHandle).toHaveTextContent('Reiniciar');
        expect(reinitButtonHandle).toBeEnabled();
      });

      optionalIt('todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelHandles = await pageHandle.findAll(selectors.stepLabel);
        expect(labelHandles).toHaveLength(expected.steps.withSale.length);
  
        labelHandles.forEach((handle, i) => {
          expect(handle).toHaveTextContent(expected.steps.withSale[i])
        });
      });
  
      optionalIt('"Informações básicas" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelSelectors = [
          selectors.steps.config.label.completed,
          selectors.steps.terrainDetails.label.active,
          selectors.steps.saleDetails.label.disabled,
          selectors.steps.installments.label.disabled,
          selectors.steps.buyers.label.disabled,
          selectors.steps.overview.label.disabled,
        ];
        await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
      });

      optionalIt('"Informações básicas" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const contentSelectors = [
          selectors.steps.config.content.hidden,
          selectors.steps.terrainDetails.content.visible,
          selectors.steps.saleDetails.content.hidden,
          selectors.steps.installments.content.hidden,
          selectors.steps.buyers.content.hidden,
          selectors.steps.overview.content.hidden,
        ];
        await Promise.all(contentSelectors.map((selector) => pageHandle.findOne(selector)));
      });
    });

    describe('2.2 - CAMPO "OBSERVAÇÕES"', () => {
      let pageHandle = new DecoratedHandle(page);
      let observationsHandles = null;
      let nextButtonHandle = null;
    
      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      it('deve estar presente', async () => {
        observationsHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.observations);
        expect(observationsHandles.constraint).toBeTruthy();
        expect(observationsHandles.constraint).toHaveTextContent('0/250');
        expect(observationsHandles.label).toHaveTextContent('Observações');
        expect(observationsHandles.report).toHaveTextContent('');
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => {
        const { observations } = expected.newTerrainDetails;
        await actions.submitTextField(observationsHandles.input, observations, nextButtonHandle);
        expect(observationsHandles.input).toHaveValue(observations);
        expect(observationsHandles.report).toHaveTextContent('');
        expect(observationsHandles.constraint).toHaveTextContent(`${observations.length}/250`); 
      });
    });

    describe('2.3 - CAMPO "REGISTRO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let registerHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitRegistry = async () => {
        const { registry } = expected.newTerrainDetails;
        await actions.submitTextField(registerHandles.input, registry, nextButtonHandle);
        expect(registerHandles.input).toHaveValue(registry);
        expect(registerHandles.report).toHaveTextContent('');
        expect(registerHandles.constraint).toHaveTextContent(`${registry.length}/125`); 
      };
    
      it('deve estar presente', async () => {
        registerHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.registry);
        expect(registerHandles.constraint).toBeTruthy();
        expect(registerHandles.constraint).toHaveTextContent('0/125');
        expect(registerHandles.label).toHaveTextContent('Registro');
        expect(registerHandles.report).toHaveTextContent('');
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitRegistry());

      optionalIt('deve permitir ter seu valor apagado', async () => {
        await registerHandles.input.clearInput();
        expect(registerHandles.input).toHaveValue('');
        expect(registerHandles.constraint).toHaveTextContent(`0/125`);
      });
    
      optionalIt('deve reportar erro caso valor inserido não tenha caracteres suficiente', async () => {
        const { notLengthEnough } = expected.invalidTerrainDetails.registry;
    
        await registerHandles.input.type(notLengthEnough.value);
        expect(registerHandles.input).toHaveValue(notLengthEnough.value);
        expect(registerHandles.constraint).toHaveTextContent(`${notLengthEnough.value.length}/125`); 
    
        await nextButtonHandle.click(1000);
        expect(registerHandles.report).toHaveTextContent(notLengthEnough.message);
      });

      optionalIt('deve ser capaz de enviar valor válido sem reportar erro', async () => submitRegistry());
    });

    describe('2.4 - CAMPOS "ESCRITURA" e "DATA DA ESCRITURA"', () => {
      let pageHandle = new DecoratedHandle(page);
      let deedDateHandles = null;
      let deedHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitFields = async () => {
        const { deed, deedDate } = expected.newTerrainDetails;
        await actions.submitAllTextFields(
          [
            {
              input: deedHandles.input,
              value: deed,
            },
            { input: deedDateHandles.input,
              value: deedDate,
            },
          ],
          nextButtonHandle,
        );
        expect(deedHandles.report).toHaveTextContent('');
        expect(deedDateHandles.report).toHaveTextContent('');
      };

      const resetFields = async () => {
        const { deed, deedDate } = expected.newTerrainDetails;
  
        await actions.resetAllTextFields(
          [
            {
              input: deedHandles.input,
              value: deed,
            },
            { input: deedDateHandles.input,
              value: deedDate,
            },
          ],
          nextButtonHandle,
        );

        expect(deedHandles.report).toHaveTextContent('');
        expect(deedHandles.input).toHaveValue('');

        expect(deedDateHandles.report).toHaveTextContent('');
        expect(deedDateHandles.input).toHaveValue('');
      };

      it('devem estar presentes', async () => {
        deedHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.deed);
        expect(deedHandles.constraint).toBeTruthy();
        expect(deedHandles.constraint).toHaveTextContent('0/125');
        expect(deedHandles.label).toHaveTextContent('Escritura');
        expect(deedHandles.report).toHaveTextContent('');
  
        deedDateHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.deedDate);
        expect(deedDateHandles.constraint).toBeNull();
        expect(deedDateHandles.label).toHaveTextContent('Data da escritura');
        expect(deedDateHandles.report).toHaveTextContent('');
        expect(deedDateHandles.input).toBeDisabled();
      });

      it('devem ser capazes de enviar valores válidos sem reportar erro', async () => submitFields());

      optionalIt('devem permitir que seus valores sejam apagados', async () => {
        await deedHandles.input.clearInput();
        expect(deedHandles.input).toHaveValue('');
        expect(deedHandles.constraint).toHaveTextContent('0/125');

        await deedDateHandles.input.clearInput();
        expect(deedDateHandles.input).toHaveValue('');
      });

      optionalIt('devem reportar erros caso sejam inseridos escritura que não possua caracteres suficiente e uma data válida', async () => {
        const { notLengthEnough } = expected.invalidTerrainDetails.deed;

        await deedHandles.input.type(notLengthEnough.value);
        expect(deedHandles.input).toHaveValue(notLengthEnough.value);

        expect(deedDateHandles.input).toBeEnabled();

        await deedDateHandles.input.type(notLengthEnough.date.value);
        expect(deedDateHandles.input).toHaveValue(brDateToISO(notLengthEnough.date.value));

        await nextButtonHandle.click(1000);
        expect(deedHandles.report).toHaveTextContent(notLengthEnough.message);
        expect(deedDateHandles.report).toHaveTextContent(notLengthEnough.date.message);
      });

      optionalIt('devem permitir que seus valores sejam resetados', async () => await resetFields());

      optionalIt('devem reportar erro caso seja inserida escritura válida sem data', async () => {
        const { mustHaveDate } = expected.invalidTerrainDetails.deed;

        await deedHandles.input.type(mustHaveDate.value);
        expect(deedHandles.input).toHaveValue(mustHaveDate.value);

        await nextButtonHandle.click(1000);
        expect(deedHandles.report).toHaveTextContent(mustHaveDate.message);
        expect(deedDateHandles.report).toHaveTextContent(mustHaveDate.date.message);
      });
      
      optionalIt('devem ser capazes de enviar valores válidos sem reportar erro', async () => {
        await deedHandles.input.clearInput();
        expect(deedHandles.input).toHaveValue('');

        await submitFields();
      });
    });

    describe('2.5 - CAMPO "ÁREA"', () => {
      let pageHandle = new DecoratedHandle(page);
      let areaHandles = null;
      let nextButtonHandle = null;
    
      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitArea = async () => {
        await actions.submitTextField(areaHandles.input, expected.newTerrainDetails.area, nextButtonHandle);
        expect(areaHandles.input).toHaveValue(expected.newTerrainDetails.area);
        expect(areaHandles.report).toHaveTextContent('');
      };

      const clearArea = async () => {
        await areaHandles.input.clearInput();
        expect(areaHandles.input).toHaveValue('');
      };

      const resetArea = async () => {
        await actions.resetTextField(areaHandles.input, expected.newTerrainDetails.area, nextButtonHandle);
        expect(areaHandles.input).toHaveValue('');
        expect(areaHandles.report).toHaveTextContent('');
      };

      it('deve estar presente', async () => {
        areaHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.area);
        expect(areaHandles.constraint).toBeNull();
        expect(areaHandles.label).toHaveTextContent('Área');
        expect(areaHandles.input).toHaveValue('');
      });
    
      optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
        expect(areaHandles.report).toHaveTextContent(expected.invalidTerrainDetails.area.required.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetArea());

      optionalIt('não deve ser possível inserir número negativo', async () => {
        await areaHandles.input.type('-1');
        expect(areaHandles.input).toHaveValue('1');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => clearArea());

      optionalIt('não deve ser possível inserir ponto', async () => {    
        await areaHandles.input.type('1.5');
        expect(areaHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => clearArea());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        await areaHandles.input.type('abc');
        expect(areaHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => clearArea());
    
      optionalIt('deve reportar erro caso número inserido seja 0', async () => {
        const { cannotBeZero } = expected.invalidTerrainDetails.area;
    
        await areaHandles.input.type(cannotBeZero.value);
        expect(areaHandles.input).toHaveValue(cannotBeZero.value);
    
        await nextButtonHandle.click(1000);
        expect(areaHandles.report).toHaveTextContent(cannotBeZero.message);
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitArea());
    });

    describe('2.6 - CAMPO "DIMENSÕES"', () => {
      let pageHandle = new DecoratedHandle(page);
      let dimensionsHandles = null;
      let nextButtonHandle = null;
    
      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitDimensions = async () => {
        const { dimensions } = expected.newTerrainDetails;
        await actions.submitTextField(dimensionsHandles.input, dimensions, nextButtonHandle);
        expect(dimensionsHandles.input).toHaveValue(dimensions);
        expect(dimensionsHandles.report).toHaveTextContent('');
        expect(dimensionsHandles.constraint).toHaveTextContent(`${dimensions.length}/125`);
      };

      const resetDimensions = async () => {
        await actions.resetTextField(dimensionsHandles.input, expected.newTerrainDetails.dimensions, nextButtonHandle);
        expect(dimensionsHandles.input).toHaveValue('');
        expect(dimensionsHandles.report).toHaveTextContent('');
        expect(dimensionsHandles.constraint).toHaveTextContent('0/125');
      };
    
      it('deve estar presente', async () => {
        dimensionsHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.dimensions);
        expect(dimensionsHandles.constraint).toBeTruthy();
        expect(dimensionsHandles.constraint).toHaveTextContent('0/125');
        expect(dimensionsHandles.label).toHaveTextContent('Dimensões');
      });
    
      optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
        expect(dimensionsHandles.report).toHaveTextContent(expected.invalidTerrainDetails.dimensions.required.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetDimensions());
    
      optionalIt('deve reportar erro caso valor inserido não tenha caracteres suficiente', async () => {
        const { notLengthEnough } = expected.invalidTerrainDetails.dimensions;
    
        await dimensionsHandles.input.type(notLengthEnough.value);
        expect(dimensionsHandles.input).toHaveValue(notLengthEnough.value);
        expect(dimensionsHandles.constraint).toHaveTextContent(`${notLengthEnough.value.length}/125`); 
    
        await nextButtonHandle.click(1000);     
        expect(dimensionsHandles.report).toHaveTextContent(notLengthEnough.message);
      });

      optionalIt('deve permitir ter seu valor apagado', async () => {
        await dimensionsHandles.input.clearInput();
        expect(dimensionsHandles.input).toHaveValue('');
        expect(dimensionsHandles.constraint).toHaveTextContent('0/125');
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitDimensions());
    });

    describe('2.7 - CAMPO "FORMATO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let shapeHandles = null;
      let nextButtonHandle = null;
    
      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitShape = async () => {
        const { shape } = expected.newTerrainDetails;
        await actions.submitTextField(shapeHandles.input, shape, nextButtonHandle);
        expect(shapeHandles.input).toHaveValue(shape);
        expect(shapeHandles.report).toHaveTextContent('');
        expect(shapeHandles.constraint).toHaveTextContent(`${shape.length}/25`); 
      };

      const resetShape = async () => {
        await actions.resetTextField(shapeHandles.input, expected.newTerrainDetails.shape, nextButtonHandle);
        expect(shapeHandles.input).toHaveValue('');
        expect(shapeHandles.report).toHaveTextContent('');
        expect(shapeHandles.constraint).toHaveTextContent('0/25');
      };
    
      it('deve estar presente', async () => {
        shapeHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.shape);
        expect(shapeHandles.constraint).toBeTruthy();
        expect(shapeHandles.constraint).toHaveTextContent('0/25');
        expect(shapeHandles.label).toHaveTextContent('Formato');
      });    
    
      optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
        expect(shapeHandles.report).toHaveTextContent(expected.invalidTerrainDetails.shape.required.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetShape());
    
      optionalIt('deve reportar erro caso valor inserido não tenha caracteres suficiente', async () => {
        const { notLengthEnough } = expected.invalidTerrainDetails.shape;
    
        await shapeHandles.input.type(notLengthEnough.value);
        expect(shapeHandles.input).toHaveValue(notLengthEnough.value);
        expect(shapeHandles.constraint).toHaveTextContent(`${notLengthEnough.value.length}/25`); 
    
        await nextButtonHandle.click(1000);
        
        expect(shapeHandles.report).toHaveTextContent(notLengthEnough.message);
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitShape());
    });

    describe('2.8 - CAMPO "ENDEREÇO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let addressHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitAddress = async () => {
        const { address } = expected.newTerrainDetails;
        await actions.submitTextField(addressHandles.input, address, nextButtonHandle);
        expect(addressHandles.input).toHaveValue(address);
        expect(addressHandles.report).toHaveTextContent('');
        expect(addressHandles.constraint).toHaveTextContent(`${address.length}/125`);
      };

      const resetAdress = async () => {
        await actions.resetTextField(addressHandles.input, expected.newTerrainDetails.address, nextButtonHandle);
        expect(addressHandles.input).toHaveValue('');
        expect(addressHandles.report).toHaveTextContent('');
        expect(addressHandles.constraint).toHaveTextContent(`0/125`);
      };

      it('deve estar presente', async () => {
        addressHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.address);
        expect(addressHandles.constraint).toBeTruthy();
        expect(addressHandles.constraint).toHaveTextContent('0/125');
        expect(addressHandles.label).toHaveTextContent('Endereço');
      });

      optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
        expect(addressHandles.report).toHaveTextContent(expected.invalidTerrainDetails.address.required.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetAdress());

      optionalIt('deve reportar erro caso valor inserido não tenha caracteres suficiente', async () => {
        const { notLengthEnough } = expected.invalidTerrainDetails.address;
        await addressHandles.input.type(notLengthEnough.value);
        expect(addressHandles.input).toHaveValue(notLengthEnough.value);
        expect(addressHandles.constraint).toHaveTextContent(`${notLengthEnough.value.length}/125`); 

        await nextButtonHandle.click(1000);
        
        expect(addressHandles.report).toHaveTextContent(notLengthEnough.message);
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitAddress());
    });

    describe('2.9 - CAMPO "LOTE"', () => {
      let pageHandle = new DecoratedHandle(page);
      let numberHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const submitNumber = async () => {
        await actions.submitTextField(numberHandles.input, expected.newTerrainDetails.number, nextButtonHandle);
        expect(numberHandles.input).toHaveValue(expected.newTerrainDetails.number);
        expect(numberHandles.report).toHaveTextContent('');
      };

      const clearNumber = async () => {
        await numberHandles.input.clearInput();
        expect(numberHandles.input).toHaveValue('');
      };

      const resetNumber = async () => {
        await actions.resetTextField(numberHandles.input, expected.newTerrainDetails.number, nextButtonHandle);
        expect(numberHandles.input).toHaveValue('');
        expect(numberHandles.report).toHaveTextContent('');
      };

      it('deve estar presente', async () => {
        numberHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.number);
        expect(numberHandles.constraint).toBeNull();
        expect(numberHandles.label).toHaveTextContent('Lote');
        expect(numberHandles.input).toHaveValue('');
      });

      optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
        expect(numberHandles.report).toHaveTextContent(expected.invalidTerrainDetails.number.required.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetNumber());

      optionalIt('não deve ser possível inserir número negativo', async () => {
        await numberHandles.input.type('-1');
        expect(numberHandles.input).toHaveValue('1');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearNumber());

      optionalIt('não deve ser possível inserir ponto', async () => {    
        await numberHandles.input.type('1.5');
        expect(numberHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearNumber());

      optionalIt('não deve ser possível inserir vírgula', async () => {    
        await numberHandles.input.type('1,5');
        expect(numberHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearNumber());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        await numberHandles.input.type('abc');
        expect(numberHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearNumber());

      optionalIt('deve reportar erro caso número inserido seja 0', async () => {
        const { cannotBeZero } = expected.invalidTerrainDetails.number;
        await numberHandles.input.type(cannotBeZero.value);
        expect(numberHandles.input).toHaveValue(cannotBeZero.value);

        await nextButtonHandle.click(1000);
        expect(numberHandles.report).toHaveTextContent(cannotBeZero.message);
      });

      it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitNumber());
    });

    describe('2.10 - CAMPO "QUADRA"', () => {
      let pageHandle = new DecoratedHandle(page);
      let blockHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      });

      const clearBlock = async () => {
        await blockHandles.input.clearInput();
        expect(blockHandles.input).toHaveValue('');
      };

      it('deve estar presente', async () => {
        blockHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.block);
        expect(blockHandles.constraint).toBeNull();
        expect(blockHandles.label).toHaveTextContent('Quadra');
        expect(blockHandles.input).toHaveValue('');
      });

      optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
        expect(blockHandles.report).toHaveTextContent(expected.invalidTerrainDetails.block.required.message);
      });

      optionalIt('não deve ser possível inserir número negativo', async () => {
        await blockHandles.input.type('-1');
        expect(blockHandles.input).toHaveValue('1');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearBlock());

      optionalIt('não deve ser possível inserir ponto', async () => {    
        await blockHandles.input.type('1.5');
        expect(blockHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearBlock());

      optionalIt('não deve ser possível inserir vírgula', async () => {    
        await blockHandles.input.type('1,5');
        expect(blockHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearBlock());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        await blockHandles.input.type('abc');
        expect(blockHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearBlock());

      optionalIt('deve reportar erro caso número inserido seja 0', async () => {
        const { cannotBeZero } = expected.invalidTerrainDetails.block;
        await blockHandles.input.type(cannotBeZero.value);
        expect(blockHandles.input).toHaveValue(cannotBeZero.value);

        await nextButtonHandle.click(1000);
        expect(blockHandles.report).toHaveTextContent(cannotBeZero.message);
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearBlock());

      it('deve ser possível inserir valor válido', async () => {
        const { block } = expected.newTerrainDetails;
        await blockHandles.input.type(block);
        expect(blockHandles.input).toHaveValue(block);
      });
    });

    describe('2.11 - NAVEGAÇÃO', () => {  
      it('botão "Próximo" deve levar ao passo de "Venda"', async () => {
        const pageHandle = new DecoratedHandle(page);
    
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        await nextButtonHandle.click();
        await pageHandle.findOne(selectors.steps.saleDetails.content.visible);
      });
    });
  });

  describe('3 - VENDA', () => {
    const optionalIt = options.factory.testCoreOnly.saleDetails ? it.skip : it;

    describe('3.1 - COMPONENTES GERAIS', () => {
      it('botões "Próximo" e "Voltar" devem estar presentes', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
        expect(nextButtonHandle).toHaveTextContent('Próximo');
        expect(nextButtonHandle).toBeEnabled();
  
        const backButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.secondaryButton);
        expect(backButtonHandle).toHaveTextContent('Voltar');
        expect(backButtonHandle).toBeEnabled();
      });
  
      optionalIt('botão "Voltar" deve levar ao passo de "Informações básicas" que deve estar com os campos preenchidos. Botão "Próximo" deve retornar ao passo "Venda"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const backButtonSaleDetailsHandle = await pageHandle.findOne(selectors.steps.saleDetails.secondaryButton);
        await backButtonSaleDetailsHandle.click();
  
        await pageHandle.findOne(selectors.steps.terrainDetails.content.visible);
  
        const blockInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.block.input);
        expect(blockInputHandle).toHaveValue(expected.newTerrainDetails.block);
  
        const numberInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.number.input);
        expect(numberInputHandle).toHaveValue(expected.newTerrainDetails.number);
  
        const addressInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.address.input);
        expect(addressInputHandle).toHaveValue(expected.newTerrainDetails.address);
  
        const shapeInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.shape.input);
        expect(shapeInputHandle).toHaveValue(expected.newTerrainDetails.shape);
  
        const dimensionsInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.dimensions.input);
        expect(dimensionsInputHandle).toHaveValue(expected.newTerrainDetails.dimensions);
  
        const areaInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.area.input);
        expect(areaInputHandle).toHaveValue(expected.newTerrainDetails.area);
  
        const deedInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.deed.input);
        expect(deedInputHandle).toHaveValue(expected.newTerrainDetails.deed);
  
        const deedDateInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.deedDate.input);
        expect(deedDateInputHandle).toHaveValue(brDateToISO(expected.newTerrainDetails.deedDate));
  
        const registryInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.registry.input);
        expect(registryInputHandle).toHaveValue(expected.newTerrainDetails.registry);
  
        const observationsInputHandle = await pageHandle.findOne(selectors.steps.terrainDetails.observations.input);
        expect(observationsInputHandle).toHaveValue(expected.newTerrainDetails.observations);
  
        const nextButtonTerrainDetailsHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        await nextButtonTerrainDetailsHandle.click();
  
        await pageHandle.findOne(selectors.steps.saleDetails.content.visible);
      });

      optionalIt('todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelHandles = await pageHandle.findAll(selectors.stepLabel);
        expect(labelHandles).toHaveLength(expected.steps.withSale.length);
  
        labelHandles.forEach((handle, i) => {
          expect(handle).toHaveTextContent(expected.steps.withSale[i])
        });
      });
  
      optionalIt('"Venda" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelSelectors = [
          selectors.steps.config.label.completed,
          selectors.steps.terrainDetails.label.completed,
          selectors.steps.saleDetails.label.active,
          selectors.steps.installments.label.disabled,
          selectors.steps.buyers.label.disabled,
          selectors.steps.overview.label.disabled,
        ];
        await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
      });
  
      optionalIt('"Venda" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const contentSelectors = [
          selectors.steps.config.content.hidden,
          selectors.steps.terrainDetails.content.hidden,
          selectors.steps.saleDetails.content.visible,
          selectors.steps.installments.content.hidden,
          selectors.steps.buyers.content.hidden,
          selectors.steps.overview.content.hidden,
        ];
        await Promise.all(contentSelectors.map((selector) => pageHandle.findOne(selector)));
      });
    });

    describe('3.2 - RADIO GROUP "FORMA DE PAGAMENTO" E CAMPO "N° de parcelas"', () => {
      let pageHandle = new DecoratedHandle(page);
      let inCashSpanInputHandle = null;
      let inInstallmentsSpanInputHandle = null;
      let installmentCountHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
      });

      const clearInstallmentCount = async () => {
        await installmentCountHandles.input.clearInput();
        expect(installmentCountHandles.input).toHaveValue('');
      };

      const resetInstallmentCount = async () => {
        const { installmentCount } = expected.newSaleDetails;
        await actions.resetTextField(installmentCountHandles.input, installmentCount, nextButtonHandle);
        expect(installmentCountHandles.input).toHaveValue('');
        expect(installmentCountHandles.report).toHaveTextContent('');
      };

      it('radio group "Forma de pagamento" e "N° de parcelas" devem estar presentes', async () => {  
        const titleHandle = await pageHandle.findOne(selectors.steps.saleDetails.paymentType.title);
        expect(titleHandle).toHaveTextContent('Forma de pagamento');
  
        const inCashLabelHandle = await pageHandle.findOne(selectors.steps.saleDetails.paymentType.inCash.label);
        expect(inCashLabelHandle).toHaveTextContent('Vista');
        inCashSpanInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.paymentType.inCash.spanInput);
        expect(inCashSpanInputHandle).not.toIncludeClass('Mui-checked');
  
        const inInstallmentsLabelHandle = await pageHandle.findOne(selectors.steps.saleDetails.paymentType.inInstallments.label);
        expect(inInstallmentsLabelHandle).toHaveTextContent('Parcelado');
        inInstallmentsSpanInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.paymentType.inInstallments.spanInput);
        expect(inInstallmentsSpanInputHandle).toIncludeClass('Mui-checked');

        installmentCountHandles = await actions.findTextField(pageHandle, selectors.steps.saleDetails.installmentCount);
        expect(installmentCountHandles.constraint).toBeNull();
        expect(installmentCountHandles.label).toHaveTextContent('N° de parcelas');
        expect(installmentCountHandles.report).toHaveTextContent('');
        expect(installmentCountHandles.input).toHaveValue('2');
        expect(installmentCountHandles.input).toBeEnabled();
      });
  
      optionalIt('radio group "Forma de pagamento" e campo "N° de parcelas" devem interagir corretamente', async () => {  
        await inCashSpanInputHandle.click(1000);
        expect(inCashSpanInputHandle).toIncludeClass('Mui-checked');
        expect(inInstallmentsSpanInputHandle).not.toIncludeClass('Mui-checked');
        expect(installmentCountHandles.input).toBeDisabled();
        expect(installmentCountHandles.input).toHaveValue('0');

        await inInstallmentsSpanInputHandle.click(1000);
        expect(inCashSpanInputHandle).not.toIncludeClass('Mui-checked');
        expect(inInstallmentsSpanInputHandle).toIncludeClass('Mui-checked');
        expect(installmentCountHandles.input).toBeEnabled();
        expect(installmentCountHandles.input).toHaveValue('2');
      });

      optionalIt('deve ser possível apagar valor em "N° de parcelas"', async () => clearInstallmentCount());

      optionalIt('"N° de parcelas" deve reportar erro caso não receba valor', async () => {
        await nextButtonHandle.click(1000);
        expect(installmentCountHandles.report).toHaveTextContent(expected.invalidSaleDetails.installmentCount.required.message);
      });

      optionalIt('"N° de parcela" deve permitir que seu valor e mensagem de reporte sejam resetados', async () => resetInstallmentCount());

      optionalIt('não deve ser possível inserir número negativo', async () => {
        await installmentCountHandles.input.type('-1');
        expect(installmentCountHandles.input).toHaveValue('1');
      });

      optionalIt('deve ser possível apagar valor em "N° de parcelas', async () => clearInstallmentCount());

      optionalIt('não deve ser possível inserir ponto', async () => {    
        await installmentCountHandles.input.type('1.5');
        expect(installmentCountHandles.input).toHaveValue('15');
      });

      optionalIt('deve ser possível apagar valor em "N° de parcelas', async () => clearInstallmentCount());

      optionalIt('não deve ser possível inserir vírgula', async () => {    
        await installmentCountHandles.input.type('1,5');
        expect(installmentCountHandles.input).toHaveValue('15');
      });

      optionalIt('deve ser possível apagar valor em "N° de parcelas', async () => clearInstallmentCount());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        await installmentCountHandles.input.type('abc');
        expect(installmentCountHandles.input).toHaveValue('');
      });

      optionalIt('deve ser possível apagar valor em "N° de parcelas', async () => clearInstallmentCount());

      it('devem ser capazes de enviarem valores válidos predefinidos sem reportar erros', async () => {
        await installmentCountHandles.input.type(expected.newSaleDetails.installmentCount);
        expect(installmentCountHandles.input).toHaveValue(expected.newSaleDetails.installmentCount);
        
        await nextButtonHandle.click(1000);
        expect(installmentCountHandles.report).toHaveTextContent('');
      });
    });

    describe('3.3 - RADIO GROUP "PROGRESSO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let openProgressSpanInputHandle = null;
      let closeProgressSpanInputHandle = null;

      it('deve estar presente e funcional', async () => {
        const content = await pageHandle.findOne(selectors.steps.saleDetails.progress.content);

        const titleHandle = await content.findOne(selectors.steps.saleDetails.progress.title);
        expect(titleHandle).toHaveTextContent('Progresso');
  
        const openProgressLabelHandle = await content.findOne(selectors.steps.saleDetails.progress.open.label);
        expect(openProgressLabelHandle).toHaveTextContent('Aberto');
        openProgressSpanInputHandle = await content.findOne(selectors.steps.saleDetails.progress.open.spanInput);
        expect(openProgressSpanInputHandle).toIncludeClass('Mui-checked');
  
        const closeProgressLabelHandle = await content.findOne(selectors.steps.saleDetails.progress.close.label);
        expect(closeProgressLabelHandle).toHaveTextContent('Fechado');
        closeProgressSpanInputHandle = await content.findOne(selectors.steps.saleDetails.progress.close.spanInput);
        expect(closeProgressSpanInputHandle).not.toIncludeClass('Mui-checked');
      });

      it('deve estar funcional', async () => {
        await closeProgressSpanInputHandle.click(1000);
        expect(openProgressSpanInputHandle).not.toIncludeClass('Mui-checked');
        expect(closeProgressSpanInputHandle).toIncludeClass('Mui-checked');
  
        await openProgressSpanInputHandle.click(1000);
        expect(openProgressSpanInputHandle).toIncludeClass('Mui-checked');
        expect(closeProgressSpanInputHandle).not.toIncludeClass('Mui-checked');  
        
        if (expected.newSaleDetails.progress === 'Fechado') {
          await closeProgressSpanInputHandle.click(1000);
          expect(openProgressSpanInputHandle).not.toIncludeClass('Mui-checked');
          expect(closeProgressSpanInputHandle).toIncludeClass('Mui-checked');
        }
      });
    });

    describe('3.4 - CAMPOS "DATA DE ABERTURA" e "DATA DE ENCERRAMENTO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let openAtHandles = null;
      let closeAtHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
      });

      const submitFields = async () => {
        const { openAt, closeAt } = expected.newSaleDetails;
        await actions.submitAllTextFields(
          [
            {
              input: openAtHandles.input,
              value: openAt,
            },
            { 
              input: closeAtHandles.input,
              value: closeAt,
            },
          ],
          nextButtonHandle,
        );
        expect(openAtHandles.input).toHaveValue(brDateToISO(openAt));
        expect(openAtHandles.report).toHaveTextContent('');
        expect(closeAtHandles.input).toHaveValue(brDateToISO(closeAt));
        expect(closeAtHandles.report).toHaveTextContent('');
      };

      const resetFields = async () => {
        const { openAt, closeAt } = expected.newSaleDetails;
        await actions.resetAllTextFields(
          [
            {
              input: openAtHandles.input,
              value: openAt,
            },
            { input: closeAtHandles.input,
              value: closeAt,
            },
          ],
          nextButtonHandle,
        );
        expect(openAtHandles.input).toHaveValue('');
        expect(openAtHandles.report).toHaveTextContent('');
        expect(closeAtHandles.input).toHaveValue('');
        expect(closeAtHandles.report).toHaveTextContent('');
      };

      it('devem estar presentes', async () => {
        openAtHandles = await actions.findTextField(pageHandle, selectors.steps.saleDetails.openAt);
        expect(openAtHandles.constraint).toBeNull();
        expect(openAtHandles.label).toHaveTextContent('Data de abertura');
        expect(openAtHandles.input).toHaveValue('');

        closeAtHandles = await actions.findTextField(pageHandle, selectors.steps.saleDetails.closeAt);
        expect(closeAtHandles.constraint).toBeNull();
        expect(closeAtHandles.label).toHaveTextContent('Data de encerramento');
        expect(closeAtHandles.input).toHaveValue('');
      });

      it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitFields());

      optionalIt('devem permitir que seus valores sejam apagados', async () => {
        await openAtHandles.input.clearInput();
        await closeAtHandles.input.clearInput();
        expect(openAtHandles.input).toHaveValue('');
        expect(closeAtHandles.input).toHaveValue('');
      });

      optionalIt('não devem permitir inserir letras e hífen', async () => {
        await openAtHandles.input.type('-a21/0-6/-a1994');
        await closeAtHandles.input.type('-a21/0-6/-a1994');
        expect(openAtHandles.input).toHaveValue(brDateToISO('21/06/1994'));
        expect(closeAtHandles.input).toHaveValue(brDateToISO('21/06/1994'));

        await openAtHandles.input.clearInput();
        await closeAtHandles.input.clearInput();
        expect(openAtHandles.input).toHaveValue('');
        expect(closeAtHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetFields());

      optionalIt('devem reportar erros caso não sejam inseridos valores', async () => {
        await nextButtonHandle.click(1000);
        expect(openAtHandles.report).toHaveTextContent(expected.invalidSaleDetails.dates.emptyDate.message);
        expect(closeAtHandles.report).toHaveTextContent(expected.invalidSaleDetails.dates.emptyDate.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetFields());

      optionalIt('devem reportar erros caso ano tenha mais que 4 algarismos', async () => {
        const { yearMustHaveFourChars } = expected.invalidSaleDetails.dates;
  
        await openAtHandles.input.type(yearMustHaveFourChars.value);
        await closeAtHandles.input.type(yearMustHaveFourChars.value);
        expect(openAtHandles.input).toHaveValue(brDateToISO(yearMustHaveFourChars.value));
        expect(closeAtHandles.input).toHaveValue(brDateToISO(yearMustHaveFourChars.value));

        await nextButtonHandle.click(1000);
        
        expect(openAtHandles.report).toHaveTextContent(yearMustHaveFourChars.message);
        expect(closeAtHandles.report).toHaveTextContent(yearMustHaveFourChars.message);

        await openAtHandles.input.clearInput();
        await closeAtHandles.input.clearInput();
        expect(openAtHandles.input).toHaveValue('');
        expect(closeAtHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetFields());

      optionalIt('caso dia do mês inseridos sejam inválidos, os valores não devem ser computados pelos inputs e devem reportar os erros', async () => {
        const { monthDoesntHaveDay } = expected.invalidSaleDetails.dates;

        await openAtHandles.input.type(monthDoesntHaveDay.value);
        await closeAtHandles.input.type(monthDoesntHaveDay.value);
        expect(openAtHandles.input).toHaveValue('');
        expect(closeAtHandles.input).toHaveValue('');

        await nextButtonHandle.click(1000);

        expect(openAtHandles.report).toHaveTextContent(monthDoesntHaveDay.message);
        expect(closeAtHandles.report).toHaveTextContent(monthDoesntHaveDay.message);

        await openAtHandles.input.clearInput();
        await closeAtHandles.input.clearInput();
        expect(openAtHandles.input).toHaveValue('');
        expect(closeAtHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetFields());

      optionalIt('caso "DATA DE ABERTURA" for depois de "DATA DE ENCERRAMENTO", devem ser reportados os erros', async () => {
        const { openAtMustBeBeforeCloseAt } = expected.invalidSaleDetails.dates;

        await openAtHandles.input.type(openAtMustBeBeforeCloseAt.openAt.value);
        await closeAtHandles.input.type(openAtMustBeBeforeCloseAt.closeAt.value);
        expect(openAtHandles.input).toHaveValue(brDateToISO(openAtMustBeBeforeCloseAt.openAt.value));
        expect(closeAtHandles.input).toHaveValue(brDateToISO(openAtMustBeBeforeCloseAt.closeAt.value));

        await nextButtonHandle.click(1000);

        expect(openAtHandles.report).toHaveTextContent(openAtMustBeBeforeCloseAt.openAt.message);
        expect(closeAtHandles.report).toHaveTextContent(openAtMustBeBeforeCloseAt.closeAt.message);

        await openAtHandles.input.clearInput();
        await closeAtHandles.input.clearInput();
        expect(openAtHandles.input).toHaveValue('');
        expect(closeAtHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetFields());

      optionalIt('"DATA DE ABERTURA" não pode ser no futuro', async () => {
        const { openAtCannotBeInFuture } = expected.invalidSaleDetails.dates;

        await openAtHandles.input.type(openAtCannotBeInFuture.value);
        expect(openAtHandles.input).toHaveValue(brDateToISO(openAtCannotBeInFuture.value));

        await nextButtonHandle.click(1000);

        expect(openAtHandles.report).toHaveTextContent(openAtCannotBeInFuture.message);

        await openAtHandles.input.clearInput();
        expect(openAtHandles.input).toHaveValue('');
      });

      optionalIt('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitFields());
    });

    describe('3.5 - CAMPO "PREÇO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let priceHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
      });

      const submitPrice = async () => {
        const { price } = expected.newSaleDetails;
        await actions.submitTextField(priceHandles.input, price, nextButtonHandle);
        expect(priceHandles.input).toHaveValue(price);
        expect(priceHandles.report).toHaveTextContent('');
      };

      const clearPrice = async () => {
        await priceHandles.input.clearInput();
        expect(priceHandles.input).toHaveValue('');
      };

      const resetPrice = async () => {
        const { price } = expected.newSaleDetails;
        await actions.resetTextField(priceHandles.input, price, nextButtonHandle);
        expect(priceHandles.input).toHaveValue('');
        expect(priceHandles.report).toHaveTextContent('');
      };

      it('deve estar presente', async () => {
        priceHandles = await actions.findTextField(pageHandle, selectors.steps.saleDetails.price);
        expect(priceHandles.constraint).toBeNull();
        expect(priceHandles.label).toHaveTextContent('Preço');
        expect(priceHandles.input).toHaveValue('');
      });

      it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitPrice());

      optionalIt('deve permitir que seu valor seja apagado', async () => clearPrice());
    
      optionalIt('deve reportar erro caso não seja inserido nenhum valor', async () => {
        await nextButtonHandle.click(1000);
        expect(priceHandles.report).toHaveTextContent(expected.invalidSaleDetails.price.required.message);
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetPrice());

      optionalIt('não deve ser possível inserir número negativo', async () => {
        await priceHandles.input.type('-1');
        expect(priceHandles.input).toHaveValue('1');
      });

      optionalIt('deve permitir que seu valor seja apagado', async () => clearPrice());

      optionalIt('não deve ser possível inserir ponto', async () => {    
        await priceHandles.input.type('1.5');
        expect(priceHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir que seu valor seja apagado', async () => clearPrice());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        await priceHandles.input.type('abc');
        expect(priceHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir que seu valor seja apagado', async () => clearPrice());
    
      optionalIt('deve reportar erro caso número inserido seja 0', async () => {
        const { cannotBeZero } = expected.invalidSaleDetails.price;
        await priceHandles.input.type(cannotBeZero.value);
        expect(priceHandles.input).toHaveValue(cannotBeZero.value);
    
        await nextButtonHandle.click(1000);
        expect(priceHandles.report).toHaveTextContent(cannotBeZero.message);
      });

      optionalIt('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitPrice());
    });

    describe('3.6 - CAMPO "SINAL"', () => {
      let pageHandle = new DecoratedHandle(page);
      let downPaymentHandles = null;
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
      });

      const clearDownPayment = async () => {
        await downPaymentHandles.input.clearInput();
        expect(downPaymentHandles.input).toHaveValue('');
      };

      it('deve estar presente', async () => {
        downPaymentHandles = await actions.findTextField(pageHandle, selectors.steps.saleDetails.downPayment);
        expect(downPaymentHandles.constraint).toBeNull();
        expect(downPaymentHandles.label).toHaveTextContent('Sinal');
        expect(downPaymentHandles.input).toHaveValue('');
      });
    
      optionalIt('deve reportar erro caso não seja inserido nenhum valor', async () => {
        await nextButtonHandle.click(1000);
        expect(downPaymentHandles.report).toHaveTextContent(expected.invalidSaleDetails.downPayment.required.message);
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearDownPayment());

      optionalIt('não deve ser possível inserir número negativo', async () => {
        await downPaymentHandles.input.type('-1');
        expect(downPaymentHandles.input).toHaveValue('1');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearDownPayment());

      optionalIt('não deve ser possível inserir ponto', async () => {    
        await downPaymentHandles.input.type('1.5');
        expect(downPaymentHandles.input).toHaveValue('15');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearDownPayment());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        await downPaymentHandles.input.type('abc');
        expect(downPaymentHandles.input).toHaveValue('');
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearDownPayment());
    
      optionalIt('deve reportar erro caso número inserido seja 0', async () => {
        const { cannotBeZero } = expected.invalidSaleDetails.downPayment;
    
        await downPaymentHandles.input.type(cannotBeZero.value);
        expect(downPaymentHandles.input).toHaveValue(cannotBeZero.value);
    
        await nextButtonHandle.click(1000);
        expect(downPaymentHandles.report).toHaveTextContent(cannotBeZero.message);
      });

      optionalIt('deve permitir ter seu valor apagado', async () => clearDownPayment());

      it('deve ser possível inserir valor válido', async () => {
        const { downPayment } = expected.newSaleDetails;
        await downPaymentHandles.input.type(downPayment);
        expect(downPaymentHandles.input).toHaveValue(downPayment);
      });
    });

    describe('3.7 - NAVEGAÇÃO', () => {
      it('botão "Próximo" deve levar ao passo de "Parcelamento"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
        await nextButtonHandle.click();
  
        await pageHandle.findOne(selectors.steps.installments.content.visible);      
      });
    });
  });

  describe('4 - PARCELAMENTO', () => {
    const optionalIt = options.factory.testCoreOnly.installments ? it.skip : it;

    describe('4.1 - COMPONENTES GERAIS', () => {
      it('botões "Próximo", "Voltar" e "Adicionar" devem estar presentes', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.installments.mainButton);
        expect(nextButtonHandle).toHaveTextContent('Próximo');
        expect(nextButtonHandle).toBeEnabled();
  
        const backButtonHandle = await pageHandle.findOne(selectors.steps.installments.secondaryButton);
        expect(backButtonHandle).toHaveTextContent('Voltar');
        expect(backButtonHandle).toBeEnabled();

        await pageHandle.findOne(selectors.steps.installments.addButton);
      });
      
      optionalIt('botão "Voltar" deve levar ao passo de "Venda" que deve estar com os campos preenchidos. Botão "Próximo" deve retornar ao passo "Parcelamento"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const backButtonInstallmentsHandle = await pageHandle.findOne(selectors.steps.installments.secondaryButton);
        await backButtonInstallmentsHandle.click();
  
        await pageHandle.findOne(selectors.steps.saleDetails.content.visible);
  
        const openAtInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.openAt.input);
        expect(openAtInputHandle).toHaveValue(brDateToISO(expected.newSaleDetails.openAt));
  
        const closeAtInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.closeAt.input);
        expect(closeAtInputHandle).toHaveValue(brDateToISO(expected.newSaleDetails.closeAt));
  
        const priceInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.price.input);
        expect(priceInputHandle).toHaveValue(expected.newSaleDetails.price);
  
        const downPaymentInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.downPayment.input);
        expect(downPaymentInputHandle).toHaveValue(expected.newSaleDetails.downPayment);
  
        let paymentTypeSelector = selectors.steps.saleDetails.paymentType.inCash.spanInput;
        if (expected.newSaleDetails.paymentType === 'Parcelado') {
          paymentTypeSelector = selectors.steps.saleDetails.paymentType.inInstallments.spanInput;
        }
        const paymentTypeSpanInputHandle = await pageHandle.findOne(paymentTypeSelector);
        expect(paymentTypeSpanInputHandle).toIncludeClass('Mui-checked');
  
        const installmentCountInputHandle = await pageHandle.findOne(selectors.steps.saleDetails.installmentCount.input);
        expect(installmentCountInputHandle).toHaveValue(expected.newSaleDetails.installmentCount);
  
        let progressSelector = selectors.steps.saleDetails.progress.open.spanInput;
        if (expected.newSaleDetails.progress === 'Fechado') {
          progressSelector = selectors.steps.saleDetails.progress.close.spanInput
        }
        const progressSpanInputHandle = await pageHandle.findOne(progressSelector);
        expect(progressSpanInputHandle).toIncludeClass('Mui-checked');
  
        const nextButtonSaleDetailsHandle = await pageHandle.findOne(selectors.steps.saleDetails.mainButton);
        await nextButtonSaleDetailsHandle.click();
  
        await pageHandle.findOne(selectors.steps.installments.content.visible);
      });
  
      optionalIt('todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelHandles = await pageHandle.findAll(selectors.stepLabel);
        expect(labelHandles).toHaveLength(expected.steps.withSale.length);
  
        labelHandles.forEach((handle, i) => {
          expect(handle).toHaveTextContent(expected.steps.withSale[i]);
        });
      });
  
      optionalIt('"Parcelamento" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelSelectors = [
          selectors.steps.config.label.completed,
          selectors.steps.terrainDetails.label.completed,
          selectors.steps.saleDetails.label.completed,
          selectors.steps.installments.label.active,
          selectors.steps.buyers.label.disabled,
          selectors.steps.overview.label.disabled,
        ];
        await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
      });
  
      optionalIt('"Parcelamento" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const contentSelectors = [
          selectors.steps.config.content.hidden,
          selectors.steps.terrainDetails.content.hidden,
          selectors.steps.saleDetails.content.hidden,
          selectors.steps.installments.content.visible,
          selectors.steps.buyers.content.hidden,
          selectors.steps.overview.content.hidden,
        ];
        await Promise.all(contentSelectors.map((selector) => pageHandle.findOne(selector)));
      });
  
      it(`botão de adicionar parcela deve estar presente e capaz de adicionar ${expected.newInstallments.length} parcelas`, async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const addInstallmentButton = await pageHandle.findOne(selectors.steps.installments.addButton);
        for (let i = 0; i < expected.newInstallments.length; i += 1) {
          await pageHandle.waitForTimeout(500);
          await addInstallmentButton.click();
        }
  
        const contents = await pageHandle.findAll(`[data-testid$="${selectors.steps.installments.installment.content}"]`);
        expect(contents).toHaveLength(expected.newInstallments.length);
      });
    });

    describe('4.2 - ADICIONANDO PARCELAS', () => {
      it(`botão de adicionar parcela deve ser capaz de adicionar ${expected.newInstallments.length} parcelas`, async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const addInstallmentButton = await pageHandle.findOne(selectors.steps.installments.addButton);
        for (let i = 0; i < expected.newInstallments.length; i += 1) {
          await pageHandle.waitForTimeout(500);
          await addInstallmentButton.click();
        }
  
        const contents = await pageHandle.findAll(`[data-testid$="${selectors.steps.installments.installment.content}"]`);
        expect(contents).toHaveLength(expected.newInstallments.length);
      });
    });

    describe('4.2 - CAMPOS "DATA DE PAGAMENTO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let nextButtonHandle = null;
      let textFieldHandles = [];

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.installments.mainButton);
      });

      const clearPaymentDates = async () => {
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.clearInput();
          expect(textFieldHandles[i].input).toHaveValue('');
        }
      };

      const resetPaymentDates = async () => {
        const inputsAndValues = expected.newInstallments.map((installment, index) => ({
          input: textFieldHandles[index].input,
          value: installment.paymentDate,
        }));

        await actions.resetAllTextFields(inputsAndValues, nextButtonHandle);

        textFieldHandles.forEach((handle) => {
          expect(handle.input).toHaveValue('');
          expect(handle.report).toHaveTextContent('');
        });
      };

      const submitPaymentDates = async () => {
        const inputsAndValues = expected.newInstallments.map((installment, index) => ({
          input: textFieldHandles[index].input,
          value: installment.paymentDate,
        }));

        await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);

        textFieldHandles.forEach((handle, index) => {
          expect(handle.input).toHaveValue(brDateToISO(inputsAndValues[index].value));
          expect(handle.report).toHaveTextContent('');
        });
      };

      it('devem estar presentes', async () => {
        for (let i = 0; i < expected.newInstallments.length; i += 1) {
          const installmentContent = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.installments.installment.content}"]`);
          const handles = await actions.findTextField(installmentContent, selectors.steps.installments.installment.paymentDate);
          expect(handles.constraint).toBeNull();
          expect(handles.label).toHaveTextContent('Data de pagamento');
          textFieldHandles.push(handles);
        }
        expect(textFieldHandles).toHaveLength(expected.newInstallments.length);
      });

      it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitPaymentDates());

      optionalIt('devem permitir que seus valores sejam apagados', async () => clearPaymentDates());
      
      optionalIt('devem reportar erros caso não sejam inseridos valores', async () => {
        await nextButtonHandle.click(1000);
        textFieldHandles.forEach((handle) => expect(handle.report).toHaveTextContent(expected.invalidInstallments.paymentDate.required.message));
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetPaymentDates());

      optionalIt('não devem permitir inserir letras e hífen', async () => {
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type('-a21/0-6/-a1994');
          expect(textFieldHandles[i].input).toHaveValue('1994-06-21');
        }
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetPaymentDates());

      optionalIt('devem reportar erros caso ano tenha mais que 4 algarismos', async () => {
        const { yearMustHaveFourChars } = expected.invalidInstallments.paymentDate;

        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type(yearMustHaveFourChars.value);
          expect(textFieldHandles[i].input).toHaveValue(brDateToISO(yearMustHaveFourChars.value));
        }

        await nextButtonHandle.click(1000);
        textFieldHandles.forEach((handle) => expect(handle.report).toHaveTextContent(yearMustHaveFourChars.message));
      });

      optionalIt('deve permitir ter seu valor e mensagem de erro resetados', async () => resetPaymentDates());

      optionalIt('caso dia do mês inseridos sejam inválidos, os valores não devem ser computados pelos inputs e devem reportar os erros', async () => {
        const { monthDoesntHaveDay } = expected.invalidInstallments.paymentDate;

        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type(monthDoesntHaveDay.value);
          expect(textFieldHandles[i].input).toHaveValue('');
        }

        await nextButtonHandle.click(1000);
        textFieldHandles.forEach((handle) => expect(handle.report).toHaveTextContent(monthDoesntHaveDay.message));
      });

      optionalIt('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitPaymentDates());
    });

    describe('4.3 - RADIO GROUP "PROGRESSO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let spanInputsHandles = [];

      it('devem estar presentes. Opção de adiar progresso deve estar presente em todas as parcelas, exceto a última', async () => {
        const LAST_INDEX = expected.newInstallments.length - 1;

        for (let i = 0; i < LAST_INDEX; i += 1) {
          const installmentContent = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.installments.installment.content}"]`);
          const progressContent = await installmentContent.findOne(selectors.steps.installments.installment.progress.content);
  
          const titleHandle = await progressContent.findOne(selectors.steps.installments.installment.progress.title);
          expect(titleHandle).toHaveTextContent('Progresso');
  
          const pendingProgressLabelHandle = await progressContent.findOne(selectors.steps.installments.installment.progress.pending.label);
          const pendingSpanInputHandle = await progressContent.findOne(selectors.steps.installments.installment.progress.pending.spanInput);
          expect(pendingProgressLabelHandle).toHaveTextContent('Pendente');
          expect(pendingSpanInputHandle).toIncludeClass('Mui-checked');
  
          const settledProgressLabelHandle = await progressContent.findOne(selectors.steps.installments.installment.progress.settled.label);
          const settledSpanInputHandle = await progressContent.findOne(selectors.steps.installments.installment.progress.settled.spanInput);
          expect(settledProgressLabelHandle).toHaveTextContent('Quitado');
          expect(settledSpanInputHandle).not.toIncludeClass('Mui-checked');
 
          const deferredProgressLabelHandle =  await progressContent.findOne(selectors.steps.installments.installment.progress.deferred.label);
          const deferredProgressSpanInputHandle =  await progressContent.findOne(selectors.steps.installments.installment.progress.deferred.spanInput);
          expect(deferredProgressLabelHandle).toHaveTextContent('Adiado');
          expect(deferredProgressSpanInputHandle).not.toIncludeClass('Mui-checked');

          spanInputsHandles.push({
            pending: pendingSpanInputHandle,
            settled: settledSpanInputHandle,
            deferred: deferredProgressSpanInputHandle,
          });
        }

        expect(spanInputsHandles).toHaveLength(expected.newInstallments.length - 1);

        const lastInstallmentContent = await pageHandle.findOne(`[data-testid="${LAST_INDEX}-${selectors.steps.installments.installment.content}"]`);
        const lastProgressContent = await lastInstallmentContent.findOne(selectors.steps.installments.installment.progress.content);

        const titleHandle = await lastProgressContent.findOne(selectors.steps.installments.installment.progress.title);
        expect(titleHandle).toHaveTextContent('Progresso');

        const lastPendingProgressLabelHandle = await lastProgressContent.findOne(selectors.steps.installments.installment.progress.pending.label);
        const lastPendingSpanInputHandle = await lastProgressContent.findOne(selectors.steps.installments.installment.progress.pending.spanInput);
        expect(lastPendingProgressLabelHandle).toHaveTextContent('Pendente');
        expect(lastPendingSpanInputHandle).toIncludeClass('Mui-checked');

        const lastSettledProgressLabelHandle = await lastProgressContent.findOne(selectors.steps.installments.installment.progress.settled.label);
        const lastSettledSpanInputHandle = await lastProgressContent.findOne(selectors.steps.installments.installment.progress.settled.spanInput);
        expect(lastSettledProgressLabelHandle).toHaveTextContent('Quitado');
        expect(lastSettledSpanInputHandle).not.toIncludeClass('Mui-checked');

        const lastDeferredProgressLabelHandle =  await lastProgressContent.queryOne(selectors.steps.installments.installment.progress.deferred.label);
        const lastDeferredProgressSpanInputHandle =  await lastProgressContent.queryOne(selectors.steps.installments.installment.progress.deferred.spanInput);
        expect(lastDeferredProgressLabelHandle).toBeNull();
        expect(lastDeferredProgressSpanInputHandle).toBeNull();

        spanInputsHandles.push({
          pending: lastPendingSpanInputHandle,
          settled: lastSettledSpanInputHandle,
        });

        expect(spanInputsHandles).toHaveLength(expected.newInstallments.length);
      });

      optionalIt('devem estar funcionais', async () => {
        const LAST_INDEX = spanInputsHandles.length - 1;

        for (let i = 0; i < LAST_INDEX; i += 1) {
          const { pending, settled, deferred } = spanInputsHandles[i];
          expect(pending).toIncludeClass('Mui-checked');
          expect(settled).not.toIncludeClass('Mui-checked');
          expect(deferred).not.toIncludeClass('Mui-checked');

          await settled.click();
          expect(pending).not.toIncludeClass('Mui-checked');
          expect(settled).toIncludeClass('Mui-checked');
          expect(deferred).not.toIncludeClass('Mui-checked');

          await deferred.click();
          expect(pending).not.toIncludeClass('Mui-checked');
          expect(settled).not.toIncludeClass('Mui-checked');
          expect(deferred).toIncludeClass('Mui-checked');

          await settled.click();
          expect(pending).not.toIncludeClass('Mui-checked');
          expect(settled).toIncludeClass('Mui-checked');
          expect(deferred).not.toIncludeClass('Mui-checked');

          await pending.click();
          expect(pending).toIncludeClass('Mui-checked');
          expect(settled).not.toIncludeClass('Mui-checked');
          expect(deferred).not.toIncludeClass('Mui-checked');

          await deferred.click();
          expect(pending).not.toIncludeClass('Mui-checked');
          expect(settled).not.toIncludeClass('Mui-checked');
          expect(deferred).toIncludeClass('Mui-checked');

          await pending.click();
          expect(pending).toIncludeClass('Mui-checked');
          expect(settled).not.toIncludeClass('Mui-checked');
          expect(deferred).not.toIncludeClass('Mui-checked');
        }

        const { pending, settled } = spanInputsHandles[LAST_INDEX];
        expect(pending).toIncludeClass('Mui-checked');
        expect(settled).not.toIncludeClass('Mui-checked');

        await settled.click();
        expect(pending).not.toIncludeClass('Mui-checked');
        expect(settled).toIncludeClass('Mui-checked');

        await pending.click();
        expect(pending).toIncludeClass('Mui-checked');
        expect(settled).not.toIncludeClass('Mui-checked');
      });

      it('devem receber os valores predefinidos', async () => {
        for (let i = 0; i < spanInputsHandles.length; i += 1) {
          const { pending, settled, deferred } = spanInputsHandles[i];
          const expectedProgress = expected.newInstallments[i].progress;

          if (expectedProgress === 'Pendente') {
            await pending.click();
            expect(pending).toIncludeClass('Mui-checked');
          } else if (expectedProgress === 'Quitado') {
            await settled.click();
            expect(settled).toIncludeClass('Mui-checked');
          } else {
            expect(deferred).toBeTruthy();
            await deferred.click();
            expect(deferred).toIncludeClass('Mui-checked');
          }
        }
      });
    });

    describe('4.4 - CAMPOS "PREÇO"', () => {
      let pageHandle = new DecoratedHandle(page);
      let textFieldHandles = [];
      let nextButtonHandle = null;

      beforeAll(async () => {
        nextButtonHandle = await pageHandle.findOne(selectors.steps.installments.mainButton);
      });

      const clearPrices = async () => {
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.clearInput();
          expect(textFieldHandles[i].input).toHaveValue('');
        }
      };

      it('devem estar presentes', async () => {
        for (let i = 0; i < expected.newInstallments.length; i += 1) {
          const installmentContent = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.installments.installment.content}"]`);
          const handles = await actions.findTextField(installmentContent, selectors.steps.installments.installment.price);
          expect(handles.constraint).toBeNull();
          expect(handles.label).toHaveTextContent('Preço');
          expect(handles.input).toHaveValue('');
          textFieldHandles.push(handles);   
        }
        expect(textFieldHandles).toHaveLength(expected.newInstallments.length);
      });

      optionalIt('devem reportar erros caso não sejam inseridos valores', async () => {
        await nextButtonHandle.click(1000);
        textFieldHandles.forEach((handle) => expect(handle.report).toHaveTextContent(expected.invalidInstallments.price.required.message));
      });

      optionalIt('devem permitir que seus valores sejam apagados', async () => clearPrices());

      optionalIt('não devem permitir ser inserido número negativo', async () => {
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type('-1');
          expect(textFieldHandles[i].input).toHaveValue('1');
        }
      });

      optionalIt('devem permitir que seus valores sejam apagados', async () => clearPrices());

      optionalIt('não deve ser possível inserir ponto', async () => {
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type('1.5');
          expect(textFieldHandles[i].input).toHaveValue('15');
        }
      });

      optionalIt('devem permitir que seus valores sejam apagados', async () => clearPrices());
    
      optionalIt('não deve ser possível inserir letras', async () => {    
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type('abc');
          expect(textFieldHandles[i].input).toHaveValue('');
        }
      });

      optionalIt('devem permitir que seus valores sejam apagados', async () => clearPrices());
    
      optionalIt('devem reportar erros caso número inserido seja 0', async () => {
        const { cannotBeZero } = expected.invalidInstallments.price;
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          await textFieldHandles[i].input.type(cannotBeZero.value);
          expect(textFieldHandles[i].input).toHaveValue(cannotBeZero.value);
        }
    
        await nextButtonHandle.click(1000);
        textFieldHandles.forEach((handle) => expect(handle.report).toHaveTextContent(cannotBeZero.message));
      });

      optionalIt('devem permitir que seus valores sejam apagados', async () => clearPrices());

      it('devem ser capazes de receber valores válidos', async () => {
        for (let i = 0; i < textFieldHandles.length; i += 1) {
          const { price } = expected.newInstallments[i];
          await textFieldHandles[i].input.type(price);
          expect(textFieldHandles[i].input).toHaveValue(price);
        }
      });
    });

    describe('4.5 - NAVEGAÇÃO', () => {
      it('botão "Próximo" deve levar ao passo de "Compradores"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.installments.mainButton);
        await nextButtonHandle.click();
  
        await pageHandle.findOne(selectors.steps.buyers.content.visible);
      });
    });
  });

  describe('5 - COMPRADORES', () => {
    const optionalIt = options.factory.testCoreOnly.buyers ? it.skip : it;

    describe('5.1 - COMPONENTES GERAIS', () => {
      it('botões "Próximo", "Voltar" e "Adicionar" devem estar presentes', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        expect(nextButtonHandle).toHaveTextContent('Próximo');
        expect(nextButtonHandle).toBeEnabled();
  
        const backButtonHandle = await pageHandle.findOne(selectors.steps.buyers.secondaryButton);
        expect(backButtonHandle).toHaveTextContent('Voltar');
        expect(backButtonHandle).toBeEnabled();

        await pageHandle.findOne(selectors.steps.buyers.addButton.button);
        const addButtonTextHandle = await pageHandle.findOne(selectors.steps.buyers.addButton.text);
        expect(addButtonTextHandle).toHaveTextContent('Adicionar');
      });
  
      optionalIt('botão "Voltar" deve levar ao passo de "Parcelamento" que deve estar com os campos preenchidos. Botão "Próximo" deve retornar ao passo "Compradores"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const backButtonBuyersHandle = await pageHandle.findOne(selectors.steps.buyers.secondaryButton);
        await backButtonBuyersHandle.click();
  
        await pageHandle.findOne(selectors.steps.installments.content.visible);
  
        for (let i = 0; i < expected.newInstallments.length; i += 1) {
          const installmentContent = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.installments.installment.content}"]`);
  
          const paymentDateInput = await installmentContent.findOne(selectors.steps.installments.installment.paymentDate.input);
          expect(paymentDateInput).toHaveValue(brDateToISO(expected.newInstallments[i].paymentDate));
  
          const priceInput = await installmentContent.findOne(selectors.steps.installments.installment.price.input);
          expect(priceInput).toHaveValue(expected.newInstallments[i].price);
  
          let progressSelector = selectors.steps.installments.installment.progress.pending.spanInput;
          if (expected.newInstallments[i].progress === 'Quitado') {
            progressSelector = selectors.steps.installments.installment.progress.settled.spanInput;
          } else if (expected.newInstallments[i].progress === 'Adiado') {
            progressSelector = selectors.steps.installments.installment.progress.deferred.spanInput;
          }
          const progressSpanInput = await installmentContent.findOne(progressSelector);
          expect(progressSpanInput).toIncludeClass('Mui-checked');
        }
  
        const nextButtonInstallmentsHandle = await pageHandle.findOne(selectors.steps.installments.mainButton);
        await nextButtonInstallmentsHandle.click();
  
        await pageHandle.findOne(selectors.steps.buyers.content.visible);
      });
  
      optionalIt('todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelHandles = await pageHandle.findAll(selectors.stepLabel);
        expect(labelHandles).toHaveLength(expected.steps.withSale.length);
  
        labelHandles.forEach((handle, i) => {
          expect(handle).toHaveTextContent(expected.steps.withSale[i])
        });
      });
  
      optionalIt('"Compradores" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelSelectors = [
          selectors.steps.config.label.completed,
          selectors.steps.terrainDetails.label.completed,
          selectors.steps.saleDetails.label.completed,
          selectors.steps.installments.label.completed,
          selectors.steps.buyers.label.active,
          selectors.steps.overview.label.disabled,
        ];
        await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
      });
  
      optionalIt('"Compradores" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const contentSelectors = [
          selectors.steps.config.content.hidden,
          selectors.steps.terrainDetails.content.hidden,
          selectors.steps.saleDetails.content.hidden,
          selectors.steps.installments.content.hidden,
          selectors.steps.buyers.content.visible,
          selectors.steps.overview.content.hidden,
        ];
        await Promise.all(contentSelectors.map((selector) => pageHandle.findOne(selector)));
      });
    });

    describe('5.2 - MODAL "ADICIONAR COMPRADOR"', () => {
      let pageHandle = new DecoratedHandle(page);
      let closeButtonHandle = null;

      it('botão "Adicionar" deve lançar modal de "Adicionar comprador" com seus devidos componentes', async () => {
        const addBuyerButtonHandle = await pageHandle.findOne(selectors.steps.buyers.addButton.button);
        await addBuyerButtonHandle.click();
  
        await pageHandle.findOne(selectors.swal.icons.question);
        closeButtonHandle = await pageHandle.findOne(selectors.swal.buttons.close);
  
        const modalTitleHandle = await pageHandle.findOne(selectors.swal.title);
        expect(modalTitleHandle).toHaveTextContent('Adicionar comprador...');
  
        const existentButtonHandle = await pageHandle.findOne(selectors.swal.buttons.confirm);
        expect(existentButtonHandle).toHaveTextContent('Existente');
  
        const newButtonHandle = await pageHandle.findOne(selectors.swal.buttons.deny);
        expect(newButtonHandle).toHaveTextContent('Novo');
      });

      it('deve ser possível fechar modal de "Adicionar comprador"', async () => {
        await closeButtonHandle.click(1000);
        const modalHandle = await pageHandle.queryOne(selectors.swal.container);
        expect(modalHandle).toBeNull();
      });
    });

    describe('5.3 - MODAL "SELEÇÃO DE COMPRADORES"', () => {
      it('botão "Existente" no modal "Adicionar comprador" deve lançar modal "Seleção de compradores"', async () => {
        const pageHandle = new DecoratedHandle(page);

        const addBuyerButtonHandle = await pageHandle.findOne(selectors.steps.buyers.addButton.button);
        await addBuyerButtonHandle.click();

        const existentButtonHandle = await pageHandle.findOne(selectors.swal.buttons.confirm);
        await existentButtonHandle.click();
  
        await pageHandle.findOne(selectors.steps.buyers.selectBuyers.content);
      });

      it('os componentes de "Seleção de compradores" devem estar presentes', async () => {
        const pageHandle = new DecoratedHandle(page);

        const selectBuyersLabelHandle = await pageHandle.findOne(selectors.steps.buyers.selectBuyers.label);
        expect(selectBuyersLabelHandle).toHaveTextContent('Compradores');
  
        await pageHandle.findOne(selectors.steps.buyers.selectBuyers.input);
        await pageHandle.findOne(selectors.swal.buttons.close);
      });
    });

    describe('5.4 - COMPRADORES REGISTRADOS', () => {
      it('modal "SELEÇÂO DE COMPRADORES" deve possibilitar selecionar compradores já registrados', async () => {
        const pageHandle = new DecoratedHandle(page);
        const selectBuyersInput = await pageHandle.findOne(selectors.steps.buyers.selectBuyers.input);
        await selectBuyersInput.click(500);
        
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const selectBuyersListItemHandle = await pageHandle.findOne(`li[data-value="${expected.registeredBuyers[i].selectTag}"]`);
          expect(selectBuyersListItemHandle).not.toIncludeClass('Mui-selected');
          await selectBuyersListItemHandle.click(500);
          expect(selectBuyersListItemHandle).toIncludeClass('Mui-selected');
        }

        await selectBuyersInput.click(500);
  
        const doneButtonHandle = await pageHandle.findOne(selectors.steps.buyers.selectBuyers.doneButton);
        await doneButtonHandle.click(500);
      });

      it('compradores selecionados devem ser adicionados em ordem alfabética de acordo com os campos "Nome completo", os quais devem estar presentes e desabilitados', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.fullName);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('Nome completo');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].fullName);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "CPF" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.cpf);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('CPF');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].cpf);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "CNPJ" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.cnpj);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('CNPJ');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].cnpj);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "Endereço" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.address);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('Endereço');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].address);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "Cidade" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.city);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('Cidade');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].city);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "Estado" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.state);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('Estado');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].state);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "CEP" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.cep);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('CEP');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].cep);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "Celular" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.mobilePhone);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('Celular');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].mobilePhone);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "Telefone" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.landLinePhone);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('Telefone');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].landLinePhone);
          expect(buyerHandles.input).toBeDisabled();
        }
      });

      it('campo "E-mail" presente e desabilitado para cada comprador selecionado', async () => {
        for (let i = 0; i < expected.registeredBuyers.length; i += 1) {
          const pageHandle = new DecoratedHandle(page);
          const buyerContentHandle = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
          const buyerHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.email);
          expect(buyerHandles.constraint).toBeNull();
          expect(buyerHandles.label).toHaveTextContent('E-mail');
          expect(buyerHandles.report).toHaveTextContent('');
          expect(buyerHandles.input).toHaveValue(expected.registeredBuyers[i].email);
          expect(buyerHandles.input).toBeDisabled();
        }
      });
    });

    describe('5.4 - NOVOS COMPRADORES', () => {
      const LAST_SELECTED_BUYER_INDEX = expected.registeredBuyers.length === 0
        ? 0
        : expected.registeredBuyers.length;

      describe('5.4.1 - ADICIONANDO NOVOS COMPRADORES', () => {
        it('botão "Novo" no modal "Adicionar comprador" deve adicionar os novos compradores', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const pageHandle = new DecoratedHandle(page);
  
            const addBuyerButtonHandle = await pageHandle.findOne(selectors.steps.buyers.addButton.button);
            await addBuyerButtonHandle.click();
            await addBuyerButtonHandle.waitForTimeout(500);
      
            const newButtonHandle = await pageHandle.findOne(selectors.swal.buttons.deny);
            await newButtonHandle.click();
            await newButtonHandle.waitForTimeout(500);
          }
        });
      });

      describe('5.4.2 - CAMPOS "EMAIL"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitEmails = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].email,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/20`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.email);
            expect(buyerHandle.label).toHaveTextContent('E-mail');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/20');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitEmails());
      });

      describe('5.4.3 - CAMPOS "TELEFONE"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitLandLinePhones = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].landLinePhone,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/15`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        const clearLandLinePhones = async () => {
          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.clearInput();
            expect(textFieldHandles[i].input).toHaveValue('');
            expect(textFieldHandles[i].constraint).toHaveTextContent('0/15');
          }
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.landLinePhone);
            expect(buyerHandle.label).toHaveTextContent('Telefone');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/15');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => await submitLandLinePhones());

        optionalIt('deve permitir que seus valores sejam apagados', async () => clearLandLinePhones());

        optionalIt('devem reportar erro caso o telefone não tenha format adequado', async () => {
          const { mustHaveFormat } = expected.invalidBuyers.landLinePhone;

          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.type(mustHaveFormat.value);
            expect(textFieldHandles[i].input).toHaveValue(mustHaveFormat.value);
            expect(textFieldHandles[i].constraint).toHaveTextContent(`${mustHaveFormat.value.length}/15`);
          }

          await nextButtonHandle.click(1000);
          textFieldHandles.forEach((handles) => expect(handles.report).toHaveTextContent(mustHaveFormat.message));
        });

        optionalIt('devem ser capazes de enviar valores válidos sem reportar erros', async () => await submitLandLinePhones());
      });

      describe('5.4.4 - CAMPOS "CELULAR"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitMobilePhones = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].mobilePhone,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/16`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        const clearMobilePhones = async () => {
          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.clearInput();
            expect(textFieldHandles[i].input).toHaveValue('');
            expect(textFieldHandles[i].constraint).toHaveTextContent('0/16');
          }
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.mobilePhone);
            expect(buyerHandle.label).toHaveTextContent('Celular');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/16');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitMobilePhones());

        optionalIt('deve permitir que seus valores sejam apagados', async () => clearMobilePhones());

        optionalIt('devem reportar erro caso o celular não tenha formato adequado', async () => {
          const { mustHaveFormat } = expected.invalidBuyers.mobilePhone;

          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.type(mustHaveFormat.value);
            expect(textFieldHandles[i].input).toHaveValue(mustHaveFormat.value);
            expect(textFieldHandles[i].constraint).toHaveTextContent(`${mustHaveFormat.value.length}/16`)
          }

          await nextButtonHandle.click(1000);
          textFieldHandles.forEach((handles) => expect(handles.report).toHaveTextContent(mustHaveFormat.message));
        });

        optionalIt('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitMobilePhones());
      });

      describe('5.4.5 - CAMPOS "CEP"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitCEPs = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].cep,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/9`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        const clearCEPs = async () => {
          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.clearInput();
            expect(textFieldHandles[i].input).toHaveValue('');
            expect(textFieldHandles[i].constraint).toHaveTextContent('0/9');
          }
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.cep);
            expect(buyerHandle.label).toHaveTextContent('CEP');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/9');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitCEPs());

        optionalIt('deve permitir que seus valores sejam apagados', async () => clearCEPs());

        optionalIt('devem reportar erro caso o celular CEP não tenha formato adequado', async () => {
          const { mustHaveFormat } = expected.invalidBuyers.cep;

          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.type(mustHaveFormat.value);
            expect(textFieldHandles[i].input).toHaveValue(mustHaveFormat.value);
            expect(textFieldHandles[i].constraint).toHaveTextContent(`${mustHaveFormat.value.length}/9`)
          }

          await nextButtonHandle.click(1000);
          textFieldHandles.forEach((handles) => expect(handles.report).toHaveTextContent(mustHaveFormat.message));
        });

        optionalIt('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitCEPs());
      });

      describe('5.4.6 - CAMPOS "ESTADO"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitStates = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].state,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/20`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.state);
            expect(buyerHandle.label).toHaveTextContent('Estado');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/20');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitStates());
      });

      describe('5.4.7 - CAMPOS "CIDADE"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitCitys = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].city,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/20`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.city);
            expect(buyerHandle.label).toHaveTextContent('Cidade');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/20');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitCitys());
      });

      describe('5.4.8 - CAMPOS "ENDEREÇO"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitAdresses = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].address,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/125`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.address);
            expect(buyerHandle.label).toHaveTextContent('Endereço');
            expect(buyerHandle.report).toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/125');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitAdresses());
      });

      describe('5.4.9 - CAMPOS "NOME COMPLETO"', () => {
        let pageHandle = new DecoratedHandle(page);
        let textFieldHandles = [];
        let nextButtonHandle = null;

        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        });

        const submitFullNames = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].fullName,
          }));
          await actions.submitAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handle, index) => {
            expect(handle.input).toHaveValue(inputsAndValues[index].value);
            expect(handle.constraint).toHaveTextContent(`${inputsAndValues[index].value.length}/80`);
            expect(handle.report).toHaveTextContent('');
          });
        };

        const clearFullNames = async () => {
          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.clearInput();
            expect(textFieldHandles[i].input).toHaveValue('');
            expect(textFieldHandles[i].constraint).toHaveTextContent('0/80');
          }
        };

        const resetFullNames = async () => {
          const inputsAndValues = textFieldHandles.map((handles, index) => ({
            input: handles.input,
            value: expected.newBuyers[index].fullName,
          }));
          await actions.resetAllTextFields(inputsAndValues, nextButtonHandle);
          textFieldHandles.forEach((handles) => {
            expect(handles.input).toHaveValue('');
            expect(handles.report).toHaveTextContent('');
            expect(handles.constraint).toHaveTextContent('0/80');
          });
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);

            const buyerHandle = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.fullName);
            expect(buyerHandle.label).toHaveTextContent('Nome completo');
            expect(buyerHandle.report).not.toHaveTextContent('');
            expect(buyerHandle.constraint).toHaveTextContent('0/80');
            expect(buyerHandle.input).toBeEnabled();

            textFieldHandles.push(buyerHandle);
          }

          expect(textFieldHandles).toHaveLength(expected.newBuyers.length);
        });

        optionalIt('devem permitir ter seus valores e mensagem de erro resetados', async () => resetFullNames());
    
        optionalIt('devem reportar erro caso não sejam inseridos valores', async () => {
          await nextButtonHandle.click(1000);
          textFieldHandles.forEach((handle) => expect(handle.report).toHaveTextContent(expected.invalidBuyers.fullName.required.message));
        });

        optionalIt('devem permitir ter seus valores e mensagem de erro resetados', async () => resetFullNames());

        optionalIt('devem reportar erro caso o nome completo não tenha tamanho suficiente', async () => {
          const { notEnoughLength } = expected.invalidBuyers.fullName;

          for (let i = 0; i < textFieldHandles.length; i += 1) {
            await textFieldHandles[i].input.type(notEnoughLength.value);
            expect(textFieldHandles[i].input).toHaveValue(notEnoughLength.value);
            expect(textFieldHandles[i].constraint).toHaveTextContent(`${notEnoughLength.value.length}/80`)
          }

          await nextButtonHandle.click(1000);
          textFieldHandles.forEach((handles) => expect(handles.report).toHaveTextContent(notEnoughLength.message));
        });

        it('devem ser capazes de enviar valores válidos sem reportar erros', async () => submitFullNames());
      });

      describe('5.4.10 - CAMPOS "CPF" e "CNPJ"', () => {
        let pageHandle = new DecoratedHandle(page);
        let buyerHandles = [];

        const clearFields = async () => {
          for (let i = 0; i < buyerHandles.length; i += 1) {
            const { cpf, cnpj } = buyerHandles[i];
            await cpf.input.clearInput();
            expect(cpf.input).toHaveValue('');
            expect(cpf.constraint).toHaveTextContent('0/14');
            await cnpj.input.clearInput();
            expect(cnpj.input).toHaveValue('');
            expect(cnpj.constraint).toHaveTextContent('0/18');
          }
        };

        it('devem estar presentes e habilitados', async () => {
          for (let i = 0; i < expected.newBuyers.length; i += 1) {
            const buyerContentTestId = `[data-testid="${LAST_SELECTED_BUYER_INDEX + i}-${selectors.steps.buyers.buyer.content}"]`;
            const buyerContentHandle = await pageHandle.findOne(buyerContentTestId);
    
            const cpfHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.cpf);
            expect(cpfHandles.label).toHaveTextContent('CPF');
            expect(cpfHandles.constraint).toHaveTextContent('0/14');
            expect(cpfHandles.input).toBeEnabled();

            const cnpjHandles = await actions.findTextField(buyerContentHandle, selectors.steps.buyers.buyer.cnpj);
            expect(cnpjHandles.label).toHaveTextContent('CNPJ');
            expect(cnpjHandles.constraint).toHaveTextContent('0/18');
            expect(cnpjHandles.input).toBeEnabled();

            buyerHandles.push({
              cpf: cpfHandles,
              cnpj: cnpjHandles,
            });
          }

          expect(buyerHandles).toHaveLength(expected.newBuyers.length);
        });

        optionalIt('devem permitir que seus valores sejam apagados', () => clearFields());

        it('devem ser capazes de receber valores válidos', async () => {
          for (let i = 0; i < buyerHandles.length; i += 1) {
            const newBuyer = expected.newBuyers[i];
            let enabledInputHandle = null;
            let disabledInputHandle = null;
            let value = null;
            if (newBuyer.cpf) {
              enabledInputHandle = buyerHandles[i].cpf.input;
              disabledInputHandle = buyerHandles[i].cnpj.input;
              value = newBuyer.cpf;
            } else {
              enabledInputHandle = buyerHandles[i].cnpj.input;
              disabledInputHandle = buyerHandles[i].cpf.input;
              value = newBuyer.cnpj;
            }
            await enabledInputHandle.type(value);
            expect(enabledInputHandle).toHaveValue(value);
            expect(disabledInputHandle).toBeDisabled();
            expect(disabledInputHandle).toHaveValue('');
          }
        });
      });
    });

    describe('5.5 - NAVEGAÇÃO', () => {
      it('botão "Próximo" deve levar ao passo de "Visão geral"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
        await nextButtonHandle.click();
  
        await pageHandle.findOne(selectors.steps.overview.content.visible);
      });
    });
  });

  describe('6 - VISÃO GERAL', () => {
    it('botões "Registrar" e "Voltar" devem estar presentes', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      let handle = await pageHandle.findOne(selectors.steps.overview.mainButton);
      expect(handle).toHaveTextContent('Registrar');
      expect(handle).toBeEnabled();
  
      handle = await pageHandle.findOne(selectors.steps.overview.secondaryButton);
      expect(handle).toHaveTextContent('Voltar');
      expect(handle).toBeEnabled();
    });

    it('botão "Voltar" deve levar ao passo de "Compradores" que deve estar com os campos preenchidos. Botão "Próximo" deve retornar ao passo "Visão geral"', async () => {
      const pageHandle = new DecoratedHandle(page);

      const backButtonOverviewHandle = await pageHandle.findOne(selectors.steps.overview.secondaryButton);
      await backButtonOverviewHandle.click();

      await pageHandle.findOne(selectors.steps.buyers.content.visible);

      for (let i = 0; i < expected.newTerrain.sale.buyers.length; i += 1) {
        const buyerContent = await pageHandle.findOne(`[data-testid="${i}-${selectors.steps.buyers.buyer.content}"]`);
        
        const fullNameInput = await buyerContent.findOne(selectors.steps.buyers.buyer.fullName.input);
        expect(fullNameInput).toHaveValue(expected.newTerrain.sale.buyers[i].fullName);
  
        const cpfInput = await buyerContent.findOne(selectors.steps.buyers.buyer.cpf.input);
        expect(cpfInput).toHaveValue(expected.newTerrain.sale.buyers[i].cpf);
  
        const cnpjInput = await buyerContent.findOne(selectors.steps.buyers.buyer.cnpj.input);
        expect(cnpjInput).toHaveValue(expected.newTerrain.sale.buyers[i].cnpj);
  
        const addressInput = await buyerContent.findOne(selectors.steps.buyers.buyer.address.input);
        expect(addressInput).toHaveValue(expected.newTerrain.sale.buyers[i].address);
  
        const cityInput = await buyerContent.findOne(selectors.steps.buyers.buyer.city.input);
        expect(cityInput).toHaveValue(expected.newTerrain.sale.buyers[i].city);
  
        const stateInput = await buyerContent.findOne(selectors.steps.buyers.buyer.state.input);
        expect(stateInput).toHaveValue(expected.newTerrain.sale.buyers[i].state);
  
        const mobilePhoneInput = await buyerContent.findOne(selectors.steps.buyers.buyer.mobilePhone.input);
        expect(mobilePhoneInput).toHaveValue(expected.newTerrain.sale.buyers[i].mobilePhone);
  
        const landLinePhoneInput = await buyerContent.findOne(selectors.steps.buyers.buyer.landLinePhone.input);
        expect(landLinePhoneInput).toHaveValue(expected.newTerrain.sale.buyers[i].landLinePhone);
  
        const emailInput = await buyerContent.findOne(selectors.steps.buyers.buyer.email.input);
        expect(emailInput).toHaveValue(expected.newTerrain.sale.buyers[i].email);
      }

      const nextButtonBuyersHandle = await pageHandle.findOne(selectors.steps.buyers.mainButton);
      await nextButtonBuyersHandle.click();

      await pageHandle.findOne(selectors.steps.overview.content.visible);
    });

    it('todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelHandles = await pageHandle.findAll(selectors.stepLabel);
      expect(labelHandles).toHaveLength(expected.steps.withSale.length);

      labelHandles.forEach((handle, i) => {
        expect(handle).toHaveTextContent(expected.steps.withSale[i])
      });
    });

    it('"Visão geral" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelSelectors = [
        selectors.steps.config.label.completed,
        selectors.steps.terrainDetails.label.completed,
        selectors.steps.saleDetails.label.completed,
        selectors.steps.installments.label.completed,
        selectors.steps.buyers.label.completed,
        selectors.steps.overview.label.active,
      ];
      await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
    });

    it('"Visão geral" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
      const pageHandle = new DecoratedHandle(page);

      const contentSelectors = [
        selectors.steps.config.content.hidden,
        selectors.steps.terrainDetails.content.hidden,
        selectors.steps.saleDetails.content.hidden,
        selectors.steps.installments.content.hidden,
        selectors.steps.buyers.content.hidden,
        selectors.steps.overview.content.visible,
      ];
      await Promise.all(contentSelectors.map((selector) => pageHandle.findOne(selector)));
    });

    it('seção "Informações básicas" deve estar presente e preenchida com os valores inseridos previamente', async () => {
      const pageHandle = new DecoratedHandle(page);

      const entries = Object.entries(selectors.steps.overview.terrain.details);
      for (let i = 0; i < entries.length; i += 1) {
        const [field, selector] = entries[i];
        const handle = await pageHandle.findOne(selector);
        expect(handle).toHaveTextContent(expected.newView.details[field]);
      }
    });

    it('seção "Venda" deve estar presente e preenchida com os valores inseridos previamente', async () => {
      const pageHandle = new DecoratedHandle(page);

      const entries = Object.entries(selectors.steps.overview.terrain.sale.details);
      for (let i = 0; i < entries.length; i += 1) {
        const [field, selector] = entries[i];
        const handle = await pageHandle.findOne(selector);
        expect(handle).toHaveTextContent(expected.newView.sale.details[field]);
      }
    });

    it('seção "Parcelamento" deve estar presente e preenchida com os valores inseridos previamente', async () => {
      const pageHandle = new DecoratedHandle(page);

      const entries = Object.entries(selectors.steps.overview.terrain.sale.installment);

      for (let installmentIndex = 0; installmentIndex < expected.newInstallments.length; installmentIndex += 1) {
        for (let entriesIndex = 0; entriesIndex < entries.length; entriesIndex += 1) {
          const [field, selector] = entries[entriesIndex];
          const handle = await pageHandle.findOne(`[data-testid="${selector}-${installmentIndex}"]`);
          expect(handle).toHaveTextContent(expected.newView.sale.installments[installmentIndex][field]);
        }
      }
    });

    it('seção "Compradores" deve estar presente e preenchida com os valores inseridos previamente', async () => {
      const pageHandle = new DecoratedHandle(page);

      const entries = Object.entries(selectors.steps.overview.terrain.sale.buyer);

      for (let buyerIndex = 0; buyerIndex < expected.newView.sale.buyers.length; buyerIndex += 1) {
        for (let entriesIndex = 0; entriesIndex < entries.length; entriesIndex += 1) {
          const [field, selector] = entries[entriesIndex];
          const valueHandle = await pageHandle.findOne(`[data-testid="${selector}-${buyerIndex}"]`);
          expect(valueHandle).toHaveTextContent(expected.newView.sale.buyers[buyerIndex][field]);
        }
      }
    });

    it('botão "Registrar" deve acionar modal quando clicado', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const registerButtonHandle = await pageHandle.findOne(selectors.steps.overview.mainButton);
      await registerButtonHandle.click();
  
      await pageHandle.findOne(selectors.swal.container);
    });

    it('modal acionado deve indicar sucesso do registro', async () => {
      const pageHandle = new DecoratedHandle(page);

      await pageHandle.findOne(selectors.swal.icons.success);
  
      const htmlContainerHandle = await pageHandle.findOne(selectors.swal.htmlContainer);
      expect(htmlContainerHandle).toHaveTextContent('Lote registrado');
  
      const confirmButtonHandle = await pageHandle.findOne(selectors.swal.buttons.confirm);
      expect(confirmButtonHandle).toHaveTextContent('OK');
    });

    it('modal de sucesso quando confirmado deve redirecionar para página de visualização do novo lote', async () => {
      const pageHandle = new DecoratedHandle(page);

      const confirmButtonHandle = await pageHandle.findOne(selectors.swal.buttons.confirm);  
      await confirmButtonHandle.click();
  
      const newTerrainViewerHandle = await pageHandle.findOne(selectors.terrainTwelveTestId);

      const expandMoreHandles = await newTerrainViewerHandle.findAll(selectors.expandMoreIcon);
      expect(expandMoreHandles).toHaveLength(5);
      await actions.expandViewer(expandMoreHandles);

      const viewer = await actions.getViewerData(newTerrainViewerHandle);
      expect(viewer).toEqual(expected.newView);
    });
  });
});
