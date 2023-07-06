import {
  registeredBuyer01, registeredBuyer02,
  registeredSoldTerrainDetails,
} from './registeredSoldTerrain';
import {
  newTerrainDetails, newSaleDetails,
  newInstallments, newBuyer01,
  newBuyer02, newView,
} from './newTerrain';

export const editedSoldTerrainDetails = {
  ...newTerrainDetails,
  block: registeredSoldTerrainDetails.block,
  number: registeredSoldTerrainDetails.number,
};

export const editedSaleDetails = { ...newSaleDetails };

export const editedInstallments = [...newInstallments];

export const editedBuyers = [
  newBuyer01,
  registeredBuyer01,
  registeredBuyer02,
  newBuyer02,
];

export const editedSoldView = {
  details: {
    ...newView.details,
    block: registeredSoldTerrainDetails.block,
    number: registeredSoldTerrainDetails.number,
  },
  sale: {
    details: { ...newView.sale.details },
    installments: [...newView.sale.installments],
    buyers: [
      newBuyer01.view,
      registeredBuyer01.view,
      registeredBuyer02.view,
      newBuyer02.view,
    ],
  },
};

export const editedSoldTerrain = {
  details: editedSoldTerrainDetails,
  sale: {
    details: editedSaleDetails,
    installments: editedInstallments,
    buyers: editedBuyers,
  },
  view: editedSoldView,
};
