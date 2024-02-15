import React, {
  useEffect, useState,
} from 'react';
import Paper from '@mui/material/Paper';
import { useHistory } from 'react-router-dom';
import StaticStep from 'components/StaticStep';
import customSwal from 'customSwal';
import {
  ITerrainDetailsForm, ReportedTerrainDetails, makeTerrainDetailsForm, newReportedTerrainDetails,
} from 'types/terrainDetails';
import { TerrainForm } from 'types/form';
import TerrainDetailsForm from 'components/TerrainDetailsForm';
import StepController from '../StepController';
import { useFetch } from '../../hooks/useFetch';

type TerrainDetailsState = {
  fieldInvalid: boolean;
  reportedDetails: ReportedTerrainDetails;
};

type TerrainDetailsStepProps = {
  stepIndex: number;
  details: ITerrainDetailsForm;
  setTerrain: React.Dispatch<React.SetStateAction<TerrainForm>>;
  nextStep: () => void;
};

export default function TerrainDetailsStep(props: TerrainDetailsStepProps) {
  const {
    stepIndex,
    details,
    setTerrain,
    nextStep,
  } = props;

  const defaultState = (terrainDetails: ITerrainDetailsForm): TerrainDetailsState => ({
    fieldInvalid: true,
    reportedDetails: newReportedTerrainDetails(terrainDetails),
  });

  const [
    { fieldInvalid, reportedDetails },
    setForm,
  ] = useState<TerrainDetailsState>(defaultState(details.id ? details : makeTerrainDetailsForm()));

  const { response, error, setFetchParams } = useFetch<ITerrainDetailsForm>();

  const history = useHistory();

  const onStepCheckout = () => {
    setFetchParams({
      method: 'POST',
      url: '/terrain/details/report',
      payload: reportedDetails,
    });
  };

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = ev.target.name as keyof ITerrainDetailsForm;
    setForm((prev) => ({
      fieldInvalid: prev.fieldInvalid,
      reportedDetails: {
        ...prev.reportedDetails,
        [name]: ev.target.value,
      },
    }));
  };

  const onChangeDeed = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => {
      const helper = {
        deed: ev.target.value,
        deedDate: prev.reportedDetails.deedDate,
        report: { ...prev.reportedDetails.report },
      };
      if (ev.target.value === '') {
        helper.deedDate = '';
        helper.report.deedDate = '';
      }
      return {
        fieldInvalid: prev.fieldInvalid,
        reportedDetails: {
          ...prev.reportedDetails,
          ...helper,
        },
      };
    });
  };

  useEffect(() => {
    if (!response) return;
    setForm((prev) => ({ reportedDetails: prev.reportedDetails, fieldInvalid: false }));
  }, [response]);

  useEffect(() => {
    if (!error) return;

    const data = error.response?.data;
    if (data) {
      return setForm((prev) => ({
        fieldInvalid: true,
        reportedDetails: {
          ...prev.reportedDetails,
          report: data,
        },
      }));
    }

    customSwal.Error();
  }, [error]);

  useEffect(() => {
    if (!fieldInvalid) {
      setForm((prev) => defaultState(prev.reportedDetails));
      setTerrain((prev) => ({
        ...prev,
        details: {
          ...reportedDetails,
          id: prev.details.id,
        },
      }));
      nextStep();
    }
  }, [fieldInvalid, setTerrain, nextStep, reportedDetails]);

  const onBackStep = async () => {
    const { isConfirmed } = await customSwal
      .Warn('Ao reiniciar, todas alterações serão descartadas. Prosseguir?');

    if (isConfirmed) {
      history.go(0);
    }
  };

  return (
    <StaticStep
      stepIndex={stepIndex}
      label="Informações básicas"
      testIdSuffix="terrain-details"
    >
      <Paper>
        <TerrainDetailsForm
          reportedDetails={reportedDetails}
          onChange={onChange}
          onChangeDeed={onChangeDeed}
          disableFields={!!details.id}
        />
        <StepController
          mainButton={{
            text: 'Próximo',
            onClickHandler: onStepCheckout,
            testId: 'terrain-details-step-controller-main-button',
          }}
          secondaryButton={{
            text: 'Reiniciar',
            onClickHandler: onBackStep,
            testId: 'terrain-details-step-controller-secondary-button',
          }}
        />
      </Paper>
    </StaticStep>
  );
}
