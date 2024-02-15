import React, {
  useState, useCallback, useMemo, useEffect,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  Stepper,
} from '@mui/material';
import SaleEditor from 'components/SaleEditor';
import customSwal from 'customSwal';
import ConfigStep from 'components/ConfigStep';
import { stringfyArrayObjectsValues, stringfyObjectValues } from 'utils/stringfyObjectValues';
import { ITerrainDetailsForm } from 'types/terrainDetails';
import { ISaleDetailsForm } from 'types/saleDetails';
import { IBuyerForm } from 'types/buyers';
import { IInstallmentForm } from 'types/installments';
import { TerrainForm } from 'types/form';
import TerrainDetailsStep from 'components/TerrainDetailsStep';
import OverviewStep from 'components/OverviewStep';
import { Terrain } from '../../types/Terrain';
import { useFetch } from '../../hooks/useFetch';
import Main from '../Main';

const castTerrainValuesToString = (terrain: Terrain) => {
  const terrainDetails = stringfyObjectValues<ITerrainDetailsForm>(terrain.details);
  if (!terrain.sale) {
    return {
      details: terrainDetails,
      sale: null,
    };
  }

  const { sale } = terrain;

  const saleDetails = stringfyObjectValues<ISaleDetailsForm>(sale.details);
  const buyers = stringfyArrayObjectsValues<IBuyerForm>(sale.buyers);
  if (!sale.installments) {
    return {
      details: terrainDetails,
      sale: {
        details: saleDetails,
        buyers,
        installments: null,
      },
    };
  }

  const installments = stringfyArrayObjectsValues<IInstallmentForm>(sale.installments);
  return {
    details: terrainDetails,
    sale: {
      details: saleDetails,
      buyers,
      installments,
    },
  };
};

const initState = (): TerrainForm => ({
  details: {
    block: '',
    number: '',
    address: '',
    shape: '',
    dimensions: '',
    area: '',
    deed: '',
    deedDate: '',
    registry: '',
    observations: '',
  },
  sale: null,
});

export default function TerrainEditor() {
  const [terrain, setTerrain] = useState<TerrainForm>(initState());

  const [activeStep, setActiveStep] = useState(0);

  const [addSale, setAddSale] = useState(false);

  const { id = '' } = useParams<{ id?: string }>();

  const history = useHistory();

  const {
    response,
    loading,
    error,
    setFetchParams,
  } = useFetch<Terrain>('GET', `/terrain/${id}`);

  const nextStep = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const backStep = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const onFormSubmitHandler = () => {
    setFetchParams({
      method: 'PUT',
      url: '/terrain',
      payload: terrain,
    });
  };

  useEffect(() => {
    if (!response) return;

    if (response.status !== 204) {
      setTerrain(castTerrainValuesToString(response.data));
    } else {
      customSwal.Success('Lote atualizado')
        .then(() => history.push(`/lotes?block=${terrain.details.block}&terrain=${terrain.details.number}`));
    }
  }, [response, terrain, history, setTerrain, setFetchParams]);

  useEffect(() => {
    if (!error) return;
    customSwal.Error();
  }, [error]);

  useEffect(() => {
    if (terrain && (error || response)) {
      setFetchParams({});
    }
  }, [terrain, setFetchParams, error, response]);

  const stepIndexes = useMemo(() => {
    if (addSale) {
      return {
        config: 0, details: 1, sale: 2, overview: 5,
      };
    }
    if (terrain && terrain.sale) {
      return {
        config: -1, details: 0, sale: 1, overview: 4,
      };
    }
    return {
      config: 0, details: 1, sale: -1, overview: 2,
    };
  }, [terrain, addSale]);

  return (
    <Main childrenIsLoading={loading}>
      {terrain.details.id && (
        <Box
          component="form"
          noValidate
          autoComplete="off"
          maxWidth="560px"
          marginX="auto"
        >
          <Stepper activeStep={activeStep} orientation="vertical">
            {stepIndexes.config >= 0 && (
              <ConfigStep
                title="Atualizar lote"
                subtitle="Lote não possui venda registrada"
                addSaleLabel="Deseja registrar venda?"
                addSale={addSale}
                setAddSale={setAddSale}
                stepIndex={stepIndexes.config}
                nextStep={nextStep}
              />
            )}
            <TerrainDetailsStep
              stepIndex={stepIndexes.details}
              details={terrain.details}
              setTerrain={setTerrain}
              nextStep={nextStep}
            />
            {stepIndexes.sale >= 0 && (
              <SaleEditor
                setTerrain={setTerrain}
                stepIndex={stepIndexes.sale}
                initialState={terrain.sale}
                nextStep={nextStep}
                backStep={backStep}
              />
            )}
            <OverviewStep
              stepIndex={stepIndexes.overview}
              onFormSubmitHandler={onFormSubmitHandler}
              backStep={backStep}
              operationName="atualizar"
              terrain={terrain}
            />
          </Stepper>
        </Box>
      )}
    </Main>
  );
}
