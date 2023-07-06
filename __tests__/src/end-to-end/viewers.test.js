import * as actions from './actions';
import * as expected from '../expected';
import selectors from '../selectors';
import { DecoratedHandle, clearStorages } from './helpers';

describe('Testes da página de lotes', () => {
  beforeAll(async () => {
    await actions.login(page);
  });

  afterAll(async () => {
    await clearStorages(page);
  });

  it('deve ser possivel visualizar informações corretas do "LOTE 1" da "QUADRA 1"', async () => {
    const pageHandle = new DecoratedHandle(page);

    const terrainHandle = await pageHandle.findOne(selectors.terrainOneTestId);
    const expandMoreHandles = await terrainHandle.findAll(selectors.expandMoreIcon);
    expect(expandMoreHandles).toHaveLength(5);
    await actions.expandViewer(expandMoreHandles);
    const viewerData = await actions.getViewerData(terrainHandle);
    expect(viewerData).toEqual(expected.viewers[0]);
  });

  it('deve ser possivel visualizar informações corretas do "LOTE 1" da "QUADRA 2"', async () => {
    const pageHandle = new DecoratedHandle(page);

    const terrainHandle = await pageHandle.findOne(selectors.terrainTwoTestId);
    const expandMoreHandles = await terrainHandle.findAll(selectors.expandMoreIcon);
    expect(expandMoreHandles).toHaveLength(5);
    await actions.expandViewer(expandMoreHandles);
    const viewerData = await actions.getViewerData(terrainHandle);
    expect(viewerData).toEqual(expected.viewers[1]);
  });

  it('deve ser possível visualizar informações corretas do "LOTE 2" da "QUADRA 2"', async () => {
    const pageHandle = new DecoratedHandle(page);

    const terrainHandle = await pageHandle.findOne(selectors.terrainFiveTestId);
    const expandMoreHandles = await terrainHandle.findAll(selectors.expandMoreIcon);
    expect(expandMoreHandles).toHaveLength(5);
    await actions.expandViewer(expandMoreHandles);
    const viewerData = await actions.getViewerData(terrainHandle);
    expect(viewerData).toEqual(expected.viewers[4]);
  });
});
