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

describe('Lote SEM venda - Testes de registro', () => {
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
    it('apenas as labels dos passos "Configurações", "Informações básicas" e "Visão geral" devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelHandles = await pageHandle.findAll(selectors.stepLabel);
      expect(labelHandles).toHaveLength(expected.steps.withoutSale.length);

      labelHandles.forEach((handle, i) => {
        expect(handle).toHaveTextContent(expected.steps.withoutSale[i])
      });
    });

    it('"Configurações" deve ter label "active". As labels de outros passos devem estar "disabled"', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const labelSelectors = [
        selectors.steps.config.label.active,
        selectors.steps.terrainDetails.label.disabled,
        selectors.steps.overview.label.disabled,
      ];
      await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)));
    });

    it('"Configurações" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
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

    it('botão "Iniciar" deve levar ao passo de informações básicas', async () => {
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
        expect(labelHandles).toHaveLength(expected.steps.withoutSale.length);
  
        labelHandles.forEach((handle, i) => {
          expect(handle).toHaveTextContent(expected.steps.withoutSale[i])
        });
      });
  
      optionalIt('"Informações básicas" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const labelSelectors = [
          selectors.steps.config.label.completed,
          selectors.steps.terrainDetails.label.active,
          selectors.steps.overview.label.disabled,
        ];
        await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
      });

      optionalIt('"Informações básicas" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
        const pageHandle = new DecoratedHandle(page);
  
        const contentSelectors = [
          selectors.steps.config.content.hidden,
          selectors.steps.terrainDetails.content.visible,
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
        await pageHandle.findOne(selectors.steps.overview.content.visible);
      });
    });
  });

  describe('3 - VISÃO GERAL', () => {
    it('botões "Registrar" e "Voltar" devem estar presentes', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      let handle = await pageHandle.findOne(selectors.steps.overview.mainButton);
      expect(handle).toHaveTextContent('Registrar');
      expect(handle).toBeEnabled();
  
      handle = await pageHandle.findOne(selectors.steps.overview.secondaryButton);
      expect(handle).toHaveTextContent('Voltar');
      expect(handle).toBeEnabled();
    });

    it('botão "Voltar" deve levar ao passo de "Informações básicas" que deve estar com os campos preenchidos. Botão "Próximo" deve retornar ao passo "Venda"', async () => {
      const pageHandle = new DecoratedHandle(page);

      const backButtonOverviewHandle = await pageHandle.findOne(selectors.steps.overview.secondaryButton);
      await backButtonOverviewHandle.click();

      await pageHandle.findOne(selectors.steps.terrainDetails.content.visible);

      const blockInput = await pageHandle.findOne(selectors.steps.terrainDetails.block.input);
      expect(blockInput).toHaveValue(expected.newTerrainDetails.block);

      const numberInput = await pageHandle.findOne(selectors.steps.terrainDetails.number.input);
      expect(numberInput).toHaveValue(expected.newTerrainDetails.number);

      const addressInput = await pageHandle.findOne(selectors.steps.terrainDetails.address.input);
      expect(addressInput).toHaveValue(expected.newTerrainDetails.address);

      const shapeInput = await pageHandle.findOne(selectors.steps.terrainDetails.shape.input);
      expect(shapeInput).toHaveValue(expected.newTerrainDetails.shape);

      const dimensionsInput = await pageHandle.findOne(selectors.steps.terrainDetails.dimensions.input);
      expect(dimensionsInput).toHaveValue(expected.newTerrainDetails.dimensions);

      const areaInput = await pageHandle.findOne(selectors.steps.terrainDetails.area.input);
      expect(areaInput).toHaveValue(expected.newTerrainDetails.area);

      const deedInput = await pageHandle.findOne(selectors.steps.terrainDetails.deed.input);
      expect(deedInput).toHaveValue(expected.newTerrainDetails.deed);

      const deedDateInput = await pageHandle.findOne(selectors.steps.terrainDetails.deedDate.input);
      expect(deedDateInput).toHaveValue(brDateToISO(expected.newTerrainDetails.deedDate));

      const registryInput = await pageHandle.findOne(selectors.steps.terrainDetails.registry.input);
      expect(registryInput).toHaveValue(expected.newTerrainDetails.registry);

      const observationsInput = await pageHandle.findOne(selectors.steps.terrainDetails.observations.input);
      expect(observationsInput).toHaveValue(expected.newTerrainDetails.observations);

      const nextButtonTerrainDetailsHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
      await nextButtonTerrainDetailsHandle.click();

      await pageHandle.findOne(selectors.steps.overview.content.visible);
    });

    it('todas as labels dos passos devem estar presentes, em ordem, e com texto referente ao seu passo', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelHandles = await pageHandle.findAll(selectors.stepLabel);
      expect(labelHandles).toHaveLength(expected.steps.withoutSale.length);

      labelHandles.forEach((handle, i) => {
        expect(handle).toHaveTextContent(expected.steps.withoutSale[i])
      });
    });

    it('"Visão geral" deve possuir label "active". "Configurações" e "Informações básicas" devem possuir labels "disabled"', async () => {
      const pageHandle = new DecoratedHandle(page);

      const labelSelectors = [
        selectors.steps.config.label.completed,
        selectors.steps.terrainDetails.label.completed,
        selectors.steps.overview.label.active,
      ];
      await Promise.all(labelSelectors.map((selector) => pageHandle.findOne(selector)))
    });

    it('"Visão geral" deve estar expandido. Os demais passos não devem estar expandidos', async () => {
      const pageHandle = new DecoratedHandle(page);

      const contentSelectors = [
        selectors.steps.config.content.hidden,
        selectors.steps.terrainDetails.content.hidden,
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
        expect(handle).toHaveTextContent(expected.newTerrainDetails[field]);
      }
    });

    it('seções "Venda", "Parcelamento" e "Compradores" devem exibir mensagem de que não há o que registrar', async () => {
      const pageHandle = new DecoratedHandle(page);

      let handle = await pageHandle.findOne(selectors.emptySaleDetails);
      expect(handle).toHaveTextContent('Nenhuma venda a registrar');
  
      handle = await pageHandle.findOne(selectors.emptyInstallments);
      expect(handle).toHaveTextContent('Nenhuma parcela a registrar');

      handle = await pageHandle.findOne(selectors.emptyBuyers);
      expect(handle).toHaveTextContent('Nenhum comprador a registrar');
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
      const terrainTwelveHandle = await pageHandle.findOne(selectors.terrainTwelveTestId);
  
      const viewer = await actions.getViewerData(terrainTwelveHandle);
      expect(viewer.details).toEqual(expected.newView.details);
    });
  });
});
