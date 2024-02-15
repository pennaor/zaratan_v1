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

describe('PASSO A PASSO DE EDIÇÃO DE LOTE COM VENDA', () => {
  beforeAll(async () => {
    await resetDB(dbPool);
    await actions.login(page);
  });

  afterAll(async () => {
    await clearStorages(page);
  });

  describe('1 - TELA DE TERRENOS', () => {
    let pageHandle = new DecoratedHandle(page);
    let terrainViewerHandle = null;

    it('deve ser possível encontrar o lote predefinido para testes', async () => {
      terrainViewerHandle = await pageHandle.findOne(selectors.terrainUnsoldRegisteredTestId);
    });

    it('deve ser possível expandir as seções do visualizador, buscar e clicar no botão de edicação de lote', async () => {
      const expandIconHandles = await terrainViewerHandle.findAll(selectors.expandMoreIcon);
      expect(expandIconHandles).toHaveLength(5);
      await actions.expandViewer(expandIconHandles);
      const editButtonHandle = await terrainViewerHandle.findOne(selectors.editTerrainButton);
      await editButtonHandle.click(1000);
    });
  });

  describe('2 - CONFIGURAÇÔES', () => {
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
      expect(titleHandle).toHaveTextContent('Atualizar lote');

      const subTitleHandle = await pageHandle.findOne(selectors.steps.config.subtitle);
      expect(subTitleHandle).toHaveTextContent('Lote não possui venda registrada');
  
      const hasSaleLabelHandle = await pageHandle.findOne(selectors.steps.config.hasSaleLabel);
      expect(hasSaleLabelHandle).toHaveTextContent('Deseja registrar venda?');
  
      const hasSaleCheckboxHandle = await pageHandle.findOne(selectors.steps.config.hasSaleCheckbox);
      expect(hasSaleCheckboxHandle).not.toIncludeClass('Mui-checked');
  
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

    describe('2.2 - CAMPOS DEVEM ESTAR COM OS VALORES DO TERRENO REGISTRADO', () => {
      it('campo "Observações". Após verificação deve ter valor apagado', async () => {
        const { observations } = expected.registeredUnsoldTerrainDetails;
        const observationsHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.observations);
        expect(observationsHandles.constraint).toBeTruthy();
        expect(observationsHandles.constraint).toHaveTextContent(`${observations.length}/250`);
        expect(observationsHandles.label).toHaveTextContent('Observações');
        expect(observationsHandles.input).toHaveValue(observations);
        expect(observationsHandles.report).toHaveTextContent('');

        await observationsHandles.input.clearInput();
        expect(observationsHandles.input).toHaveValue('');
        expect(observationsHandles.constraint).toHaveTextContent(`0/250`);
      });

      it('campo "Registro". Após verificação deve ter valor apagado', async () => {
        const { registry } = expected.registeredUnsoldTerrainDetails;
        const registerHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.registry);
        expect(registerHandles.constraint).toBeTruthy();
        expect(registerHandles.constraint).toHaveTextContent(`${registry.length}/125`);
        expect(registerHandles.label).toHaveTextContent('Registro');
        expect(registerHandles.input).toHaveValue(registry);
        expect(registerHandles.report).toHaveTextContent('');

        await registerHandles.input.clearInput();
        expect(registerHandles.input).toHaveValue('');
        expect(registerHandles.constraint).toHaveTextContent(`0/125`);
      });

      it('campo "Data da escritura". Após verificação deve ter valor apagado', async () => {
        const { deed, deedDate } = expected.registeredUnsoldTerrainDetails;
        const deedDateHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.deedDate);
        expect(deedDateHandles.constraint).toBeNull();
        expect(deedDateHandles.label).toHaveTextContent('Data da escritura');
        expect(deedDateHandles.report).toHaveTextContent('');
        if (!deed.length) {
          expect(deedDateHandles.input).toHaveValue('');
          expect(deedDateHandles.input).toBeDisabled();
        } else {
          expect(deedDateHandles.input).toHaveValue(brDateToISO(deedDate));
          expect(deedDateHandles.input).toBeEnabled();

          await deedDateHandles.input.clearInput();
          expect(deedDateHandles.input).toHaveValue('');
        }
      });

      it('campo "Escritura". Após verificação deve ter valor apagado', async () => {
        const { deed } = expected.registeredUnsoldTerrainDetails;
        const deedHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.deed);
        expect(deedHandles.constraint).toBeTruthy();
        expect(deedHandles.constraint).toHaveTextContent(`${deed.length}/125`);
        expect(deedHandles.label).toHaveTextContent('Escritura');
        expect(deedHandles.input).toHaveValue(deed);
        expect(deedHandles.report).toHaveTextContent('');

        await deedHandles.input.clearInput();
        expect(deedHandles.input).toHaveValue('');
        expect(deedHandles.constraint).toHaveTextContent(`0/125`);
      });

      it('campo "Área". Após verificação deve ter valor apagado', async () => {
        const { area } = expected.registeredUnsoldTerrainDetails;
        const areaHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.area);
        expect(areaHandles.constraint).toBeNull();
        expect(areaHandles.label).toHaveTextContent('Área');
        expect(areaHandles.input).toHaveValue(area);
        expect(areaHandles.report).toHaveTextContent('');

        await areaHandles.input.clearInput();
        expect(areaHandles.input).toHaveValue('');
      });

      it('campo "Dimensões". Após verificação deve ter valor apagado', async () => {
        const { dimensions } = expected.registeredUnsoldTerrainDetails;
        const dimensionsHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.dimensions);
        expect(dimensionsHandles.constraint).toBeTruthy();
        expect(dimensionsHandles.constraint).toHaveTextContent(`${dimensions.length}/125`);
        expect(dimensionsHandles.label).toHaveTextContent('Dimensões');
        expect(dimensionsHandles.input).toHaveValue(dimensions);
        expect(dimensionsHandles.report).toHaveTextContent('');

        await dimensionsHandles.input.clearInput();
        expect(dimensionsHandles.input).toHaveValue('');
        expect(dimensionsHandles.constraint).toHaveTextContent(`0/125`);
      });

      it('campo "Formato". Após verificação deve ter valor apagado', async () => {
        const { shape } = expected.registeredUnsoldTerrainDetails;
        const shapeHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.shape);
        expect(shapeHandles.constraint).toBeTruthy();
        expect(shapeHandles.constraint).toHaveTextContent(`${shape.length}/25`);
        expect(shapeHandles.label).toHaveTextContent('Formato');
        expect(shapeHandles.input).toHaveValue(shape);
        expect(shapeHandles.report).toHaveTextContent('');

        await shapeHandles.input.clearInput();
        expect(shapeHandles.input).toHaveValue('');
        expect(shapeHandles.constraint).toHaveTextContent(`0/25`);
      });

      it('campo "Endereço". Após verificação deve ter valor apagado', async () => {
        const { address } = expected.registeredUnsoldTerrainDetails;
        const addressHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.address);
        expect(addressHandles.constraint).toBeTruthy();
        expect(addressHandles.constraint).toHaveTextContent(`${address.length}/125`);
        expect(addressHandles.label).toHaveTextContent('Endereço');
        expect(addressHandles.input).toHaveValue(address);
        expect(addressHandles.report).toHaveTextContent('');

        await addressHandles.input.clearInput();
        expect(addressHandles.input).toHaveValue('');
        expect(addressHandles.constraint).toHaveTextContent(`0/125`);
      });

      it('campo "Lote" deve estar presente e desabilitado', async () => {
        const { number } = expected.registeredUnsoldTerrainDetails;
        const numberHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.number);
        expect(numberHandles.constraint).toBeNull();
        expect(numberHandles.label).toHaveTextContent('Lote');
        expect(numberHandles.input).toHaveValue(number);
        expect(numberHandles.input).toBeDisabled();
        expect(numberHandles.report).toHaveTextContent('');
      });

      it('campo "Quadra" deve estar presente e desabilitado', async () => {
        const { block } = expected.registeredUnsoldTerrainDetails;
        const blockHandles = await actions.findTextField(new DecoratedHandle(page), selectors.steps.terrainDetails.block);
        expect(blockHandles.constraint).toBeNull();
        expect(blockHandles.label).toHaveTextContent('Quadra');
        expect(blockHandles.input).toHaveValue(block);
        expect(blockHandles.input).toBeDisabled();
        expect(blockHandles.report).toHaveTextContent('');
      });
    });

    describe('2.3 - CAMPOS DEVEM REPORTAR ERRO AO SUBMETER VALORES INVÁLIDOS. APÓS VERIFICAÇÃO DEVEM SUBMETER VALOR VÁLIDO PREDEFINIDO', () => {
      describe('2.3.1 - CAMPO "OBSERVAÇÕES"', () => {
        let pageHandle = new DecoratedHandle(page);
        let observationsHandles = null;
        let nextButtonHandle = null;
      
        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
          observationsHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.observations);
        });
  
        it('deve ser capaz de enviar valor válido sem reportar erro', async () => {
          const { observations } = expected.editedUnsoldTerrainDetails;
          await actions.submitTextField(observationsHandles.input, observations, nextButtonHandle);
          expect(observationsHandles.input).toHaveValue(observations);
          expect(observationsHandles.report).toHaveTextContent('');
          expect(observationsHandles.constraint).toHaveTextContent(`${observations.length}/250`); 
        });
      });

      describe('2.3.2 - CAMPO "REGISTRO"', () => {
        let pageHandle = new DecoratedHandle(page);
        let registerHandles = null;
        let nextButtonHandle = null;
  
        beforeAll(async () => {
          registerHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.registry);
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        });
  
        const submitRegistry = async () => {
          const { registry } = expected.editedUnsoldTerrainDetails;
          await actions.submitTextField(registerHandles.input, registry, nextButtonHandle);
          expect(registerHandles.input).toHaveValue(registry);
          expect(registerHandles.report).toHaveTextContent('');
          expect(registerHandles.constraint).toHaveTextContent(`${registry.length}/125`); 
        };
      
        optionalIt('deve reportar erro caso valor inserido não tenha caracteres suficiente', async () => {
          const { notLengthEnough } = expected.invalidTerrainDetails.registry;
      
          await registerHandles.input.type(notLengthEnough.value);
          expect(registerHandles.input).toHaveValue(notLengthEnough.value);
          expect(registerHandles.constraint).toHaveTextContent(`${notLengthEnough.value.length}/125`); 
      
          await nextButtonHandle.click(1000);
          expect(registerHandles.report).toHaveTextContent(notLengthEnough.message);
        });
  
        it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitRegistry());
      });

      describe('2.3.3 - CAMPOS "ESCRITURA" e "DATA DA ESCRITURA"', () => {
        let pageHandle = new DecoratedHandle(page);
        let deedDateHandles = null;
        let deedHandles = null;
        let nextButtonHandle = null;
  
        beforeAll(async () => {
          deedHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.deed);
          deedDateHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.deedDate);
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        });
  
        const submitFields = async () => {
          const { deed, deedDate } = expected.editedUnsoldTerrainDetails;
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
          const { deed, deedDate } = expected.editedUnsoldTerrainDetails;
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
        
        it('devem ser capazes de enviar valores válidos sem reportar erro', async () => submitFields());
      });

      describe('2.3.4 - CAMPO "ÁREA"', () => {
        let pageHandle = new DecoratedHandle(page);
        let areaHandles = null;
        let nextButtonHandle = null;
      
        beforeAll(async () => {
          areaHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.area);
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        });
  
        const submitArea = async () => {
          await actions.submitTextField(areaHandles.input, expected.editedUnsoldTerrainDetails.area, nextButtonHandle);
          expect(areaHandles.input).toHaveValue(expected.editedUnsoldTerrainDetails.area);
          expect(areaHandles.report).toHaveTextContent('');
        };

        const clearArea = async () => {
          await areaHandles.input.clearInput();
          expect(areaHandles.input).toHaveValue('');
        };
  
        const resetArea = async () => {
          await actions.resetTextField(areaHandles.input, expected.editedUnsoldTerrainDetails.area, nextButtonHandle);
          expect(areaHandles.input).toHaveValue('');
          expect(areaHandles.report).toHaveTextContent('');
        };
      
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

      describe('2.3.5 - CAMPO "DIMENSÕES"', () => {
        let pageHandle = new DecoratedHandle(page);
        let dimensionsHandles = null;
        let nextButtonHandle = null;
      
        beforeAll(async () => {
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
          dimensionsHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.dimensions);
        });
  
        const submitDimensions = async () => {
          const { dimensions } = expected.editedUnsoldTerrainDetails;
          await actions.submitTextField(dimensionsHandles.input, dimensions, nextButtonHandle);
          expect(dimensionsHandles.input).toHaveValue(dimensions);
          expect(dimensionsHandles.report).toHaveTextContent('');
          expect(dimensionsHandles.constraint).toHaveTextContent(`${dimensions.length}/125`);
        };
  
        const resetDimensions = async () => {
          await actions.resetTextField(dimensionsHandles.input, expected.editedUnsoldTerrainDetails.dimensions, nextButtonHandle);
          expect(dimensionsHandles.input).toHaveValue('');
          expect(dimensionsHandles.report).toHaveTextContent('');
          expect(dimensionsHandles.constraint).toHaveTextContent('0/125');
        };
      
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
  
        it('deve ser capaz de enviar valor válido sem reportar erro', async () => submitDimensions());
      });

      describe('2.7 - CAMPO "FORMATO"', () => {
        let pageHandle = new DecoratedHandle(page);
        let shapeHandles = null;
        let nextButtonHandle = null;
      
        beforeAll(async () => {
          shapeHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.shape);
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        });
  
        const submitShape = async () => {
          const { shape } = expected.editedUnsoldTerrainDetails;
          await actions.submitTextField(shapeHandles.input, shape, nextButtonHandle);
          expect(shapeHandles.input).toHaveValue(shape);
          expect(shapeHandles.report).toHaveTextContent('');
          expect(shapeHandles.constraint).toHaveTextContent(`${shape.length}/25`); 
        };
  
        const resetShape = async () => {
          await actions.resetTextField(shapeHandles.input, expected.editedUnsoldTerrainDetails.shape, nextButtonHandle);
          expect(shapeHandles.input).toHaveValue('');
          expect(shapeHandles.report).toHaveTextContent('');
          expect(shapeHandles.constraint).toHaveTextContent('0/25');
        };
      
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

      describe('2.3.6 - CAMPO "ENDEREÇO"', () => {
        let pageHandle = new DecoratedHandle(page);
        let addressHandles = null;
        let nextButtonHandle = null;
  
        beforeAll(async () => {
          addressHandles = await actions.findTextField(pageHandle, selectors.steps.terrainDetails.address);
          nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        });

        const clearAddress = async () => {
          await addressHandles.input.clearInput();
          expect(addressHandles.input).toHaveValue('');
        };
  
        optionalIt('deve constar reporte de erro por ter sido submetido sem valor', async () => {
          expect(addressHandles.report).toHaveTextContent(expected.invalidTerrainDetails.address.required.message);
        });
  
        optionalIt('deve permitir que seu valor seja apagado', async () => clearAddress());
  
        optionalIt('deve reportar erro caso valor inserido não tenha caracteres suficiente', async () => {
          const { notLengthEnough } = expected.invalidTerrainDetails.address;
          await addressHandles.input.type(notLengthEnough.value);
          expect(addressHandles.input).toHaveValue(notLengthEnough.value);
          expect(addressHandles.constraint).toHaveTextContent(`${notLengthEnough.value.length}/125`); 
  
          await nextButtonHandle.click(1000);
          
          expect(addressHandles.report).toHaveTextContent(notLengthEnough.message);
        });

        optionalIt('deve permitir que seu valor seja apagado', async () => clearAddress());
  
        it('deve receber valor válido predefinido', async () => {
          await addressHandles.input.type(expected.editedUnsoldTerrainDetails.address);
          expect(addressHandles.input).toHaveValue(expected.editedUnsoldTerrainDetails.address);
        });
      });
    });

    describe('2.11 - NAVEGAÇÃO', () => {  
      it('botão "Próximo" deve levar ao passo "Visão geral"', async () => {
        const pageHandle = new DecoratedHandle(page);
    
        const nextButtonHandle = await pageHandle.findOne(selectors.steps.terrainDetails.mainButton);
        await nextButtonHandle.click();

        await pageHandle.findOne(selectors.steps.overview.content.visible);
      });
    });
  });

  describe('6 - VISÃO GERAL', () => {
    it('botões "Atualizar" e "Voltar" devem estar presentes', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      let handle = await pageHandle.findOne(selectors.steps.overview.mainButton);
      expect(handle).toHaveTextContent('Atualizar');
      expect(handle).toBeEnabled();
  
      handle = await pageHandle.findOne(selectors.steps.overview.secondaryButton);
      expect(handle).toHaveTextContent('Voltar');
      expect(handle).toBeEnabled();
    });

    it('botão "Voltar" deve levar ao passo de "Informações básicas" que deve estar com os campos preenchidos. Botão "Próximo" deve retornar ao passo "Visão geral"', async () => {
      const pageHandle = new DecoratedHandle(page);

      const backButtonOverviewHandle = await pageHandle.findOne(selectors.steps.overview.secondaryButton);
      await backButtonOverviewHandle.click();

      await pageHandle.findOne(selectors.steps.terrainDetails.content.visible);

      const blockInput = await pageHandle.findOne(selectors.steps.terrainDetails.block.input);
      expect(blockInput).toHaveValue(expected.editedUnsoldTerrainDetails.block);

      const numberInput = await pageHandle.findOne(selectors.steps.terrainDetails.number.input);
      expect(numberInput).toHaveValue(expected.editedUnsoldTerrainDetails.number);

      const addressInput = await pageHandle.findOne(selectors.steps.terrainDetails.address.input);
      expect(addressInput).toHaveValue(expected.editedUnsoldTerrainDetails.address);

      const shapeInput = await pageHandle.findOne(selectors.steps.terrainDetails.shape.input);
      expect(shapeInput).toHaveValue(expected.editedUnsoldTerrainDetails.shape);

      const dimensionsInput = await pageHandle.findOne(selectors.steps.terrainDetails.dimensions.input);
      expect(dimensionsInput).toHaveValue(expected.editedUnsoldTerrainDetails.dimensions);

      const areaInput = await pageHandle.findOne(selectors.steps.terrainDetails.area.input);
      expect(areaInput).toHaveValue(expected.editedUnsoldTerrainDetails.area);

      const deedInput = await pageHandle.findOne(selectors.steps.terrainDetails.deed.input);
      expect(deedInput).toHaveValue(expected.editedUnsoldTerrainDetails.deed);

      const deedDateInput = await pageHandle.findOne(selectors.steps.terrainDetails.deedDate.input);
      expect(deedDateInput).toHaveValue(brDateToISO(expected.editedUnsoldTerrainDetails.deedDate));

      const registryInput = await pageHandle.findOne(selectors.steps.terrainDetails.registry.input);
      expect(registryInput).toHaveValue(expected.editedUnsoldTerrainDetails.registry);

      const observationsInput = await pageHandle.findOne(selectors.steps.terrainDetails.observations.input);
      expect(observationsInput).toHaveValue(expected.editedUnsoldTerrainDetails.observations);

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

    it('"Visão geral" deve possuir label "active". Passos anteriores devem ter labels "completed". Os posteriores devem ter labels "disabled"', async () => {
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
        expect(handle).toHaveTextContent(expected.editedUnsoldView.details[field]);
      }
    });

    it('botão "Atualizar" deve acionar modal quando clicado', async () => {
      const pageHandle = new DecoratedHandle(page);
  
      const updateButtonHandle = await pageHandle.findOne(selectors.steps.overview.mainButton);
      await updateButtonHandle.click();
  
      await pageHandle.findOne(selectors.swal.container);
    });

    it('modal acionado deve indicar sucesso da edição do lote', async () => {
      const pageHandle = new DecoratedHandle(page);

      await pageHandle.findOne(selectors.swal.icons.success);
  
      const htmlContainerHandle = await pageHandle.findOne(selectors.swal.htmlContainer);
      expect(htmlContainerHandle).toHaveTextContent('Lote atualizado');
  
      const confirmButtonHandle = await pageHandle.findOne(selectors.swal.buttons.confirm);
      expect(confirmButtonHandle).toHaveTextContent('OK');
    });

    it('modal de sucesso quando confirmado deve redirecionar para página de visualização do novo lote', async () => {
      const pageHandle = new DecoratedHandle(page);

      const confirmButtonHandle = await pageHandle.findOne(selectors.swal.buttons.confirm);  
      await confirmButtonHandle.click();

      const registeredTerrainViewerHandle = await pageHandle.findOne(selectors.terrainUnsoldRegisteredTestId);

      const expandMoreHandles = await registeredTerrainViewerHandle.findAll(selectors.expandMoreIcon);
      expect(expandMoreHandles).toHaveLength(5);
      await actions.expandViewer(expandMoreHandles);

      const viewer = await actions.getViewerData(registeredTerrainViewerHandle);
      expect(viewer).toEqual(expected.editedUnsoldView);
    });
  });
});
