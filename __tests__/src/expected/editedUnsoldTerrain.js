import {
  registeredUnsoldTerrainDetails,
} from './registeredUnsoldTerrain';
import {
  newTerrainDetails, newView,
} from './newTerrain';

export const editedUnsoldTerrainDetails = {
  ...newTerrainDetails,
  block: registeredUnsoldTerrainDetails.block,
  number: registeredUnsoldTerrainDetails.number,
};

export const editedUnsoldView = {
  details: {
    ...newView.details,
    block: registeredUnsoldTerrainDetails.block,
    number: registeredUnsoldTerrainDetails.number,
  },
  sale: null,
};
