import selectors from '../../selectors';

function prepareEntry(handles, key) {
  return handles.map((handle) => [key, handle.element.textContent]);
}

function normalizeSections(sections) {
  const entities = [];
  for (let i = 0; i < sections[0].length; i += 1) {
    entities.push({});
    for (let y = 0; y < sections.length; y += 1) {
      const key = sections[y][i][0];
      const value = sections[y][i][1];
      entities[i] = { ...entities[i], [key]: value };
    }
  }
  return entities;
}

async function getSections(parentHandle, entries) {
  return Promise.all(entries.map(async ([key, testId]) => {
    return parentHandle.findAll(testId)
      .then((handles) => prepareEntry(handles, key))
      .catch(() => []);
  })).then(normalizeSections);
}

function buildTerrainView(sections) {
  const [terrainDetails, saleDetails, buyers, installments] = sections;
  if (!saleDetails[0]) {
    return {
      details: terrainDetails[0],
      sale: null,
    };
  }
  if (!installments.length) {
    return {
      details: terrainDetails[0],
      sale: {
        details: saleDetails[0],
        buyers,
        installments: null,
      },
    };
  }
  return {
    details: terrainDetails[0],
    sale: {
      details: saleDetails[0],
      buyers,
      installments,
    },
  };
}

export default async function getViewerData(parentHandle) {
  const terrainDetails = Object.entries(selectors.viewer.terrainDetails);
  const saleDetails = Object.entries(selectors.viewer.sale.details);
  const installment = Object.entries(selectors.viewer.sale.installment);
  const buyer = Object.entries(selectors.viewer.sale.buyer);

  return Promise.all([
    getSections(parentHandle, terrainDetails),
    getSections(parentHandle, saleDetails),
    getSections(parentHandle, buyer),
    getSections(parentHandle, installment),
  ]).then(buildTerrainView);
}
