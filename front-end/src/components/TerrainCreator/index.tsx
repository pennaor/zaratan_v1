import React, {
  useState, useCallback, useEffect,
} from 'react';
import {
  Box,
  Stepper,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import SaleCreator from 'components/SaleCreator';
import customSwal from 'customSwal';
import { TerrainForm } from 'types/form';
import Main from '../Main';
import ConfigStep from '../ConfigStep';
import { useFetch } from '../../hooks/useFetch';
import TerrainDetailsStep from '../TerrainDetailsStep';
import OverviewStep from '../OverviewStep';

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

export default function TerrainCreator() {
  const [terrain, setTerrain] = useState(initState());

  const [activeStep, setActiveStep] = useState(0);

  const [addSale, setAddSale] = useState(false);

  const { response, error, setFetchParams } = useFetch<string>();

  const history = useHistory();

  const nextStep = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  const backStep = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const onFormSubmitHandler = () => {
    setFetchParams({
      method: 'POST',
      url: '/terrain',
      payload: terrain,
    });
  };

  useEffect(() => {
    if (!response) return;

    if (response.status === 201) {
      customSwal.Success('Lote registrado')
        .then(() => history.push(`/lotes?block=${terrain.details.block}&terrain=${terrain.details.number}`));
    }
  }, [response, terrain, history]);

  useEffect(() => {
    if (!error) return;

    if (error.response?.status === 409) {
      customSwal.Error(error.response.data);
      return;
    }

    customSwal.Error('O registro falhou');
  }, [error, setFetchParams]);

  useEffect(() => {
    if (terrain && (error || response)) {
      setFetchParams({});
    }
  }, [terrain, setFetchParams, error, response]);

  return (
    <Main childrenIsLoading={false}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        maxWidth="560px"
        marginX="auto"
      >
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          data-testid="terrain-creator"
        >
          <ConfigStep
            stepIndex={0}
            nextStep={nextStep}
            title="Registrar lote"
            addSaleLabel="Possui venda?"
            addSale={addSale}
            setAddSale={setAddSale}
          />
          <TerrainDetailsStep
            stepIndex={1}
            nextStep={nextStep}
            details={terrain.details}
            setTerrain={setTerrain}
          />
          {addSale && (
            <SaleCreator
              stepIndex={2}
              nextStep={nextStep}
              backStep={backStep}
              setTerrain={setTerrain}
            />
          )}
          <OverviewStep
            stepIndex={addSale ? 5 : 2}
            onFormSubmitHandler={onFormSubmitHandler}
            backStep={backStep}
            operationName="registrar"
            terrain={terrain}
          />
        </Stepper>
      </Box>
    </Main>
  );
}
