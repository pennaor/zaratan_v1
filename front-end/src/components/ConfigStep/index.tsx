import React from 'react';
import Paper from '@mui/material/Paper';
import {
  Grid, Typography, FormControlLabel, Checkbox,
} from '@mui/material';
import StaticStep from 'components/StaticStep';
import StepController from 'components/StepController';

type ConfigStepProps = {
  stepIndex: number;
  title: string;
  subtitle?: string;
  addSaleLabel: string;
  addSale: boolean;
  setAddSale: React.Dispatch<React.SetStateAction<boolean>>;
  nextStep: () => void;
};

export default function ConfigStep(props: ConfigStepProps) {
  const {
    stepIndex,
    nextStep,
    title,
    subtitle,
    addSaleLabel,
    addSale,
    setAddSale,
  } = props;

  return (
    <StaticStep
      stepIndex={stepIndex}
      label="Configurações"
      testIdSuffix="config"
    >
      <Paper>
        <Grid
          container
          justifyContent="center"
          flexDirection="column"
          gap={2}
          paddingX={2}
          paddingY={1}
        >
          <Typography
            variant="h6"
            alignSelf="center"
            data-testid="factory-config-step-title"
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              alignSelf="center"
              data-testid="factory-config-step-subtitle"
            >
              {subtitle}
            </Typography>
          )}
          <FormControlLabel
            label={addSaleLabel}
            labelPlacement="bottom"
            data-testid="factory-config-step-has-sale-label"
            control={(
              <Checkbox
                checked={addSale}
                onChange={(ev) => setAddSale(() => ev.target.checked)}
                data-testid="factory-config-step-has-sale-checkbox"
              />
            )}
          />
        </Grid>
        <StepController
          mainButton={{
            text: 'Iniciar',
            onClickHandler: nextStep,
            testId: 'config-step-controller-main-button',
          }}
          secondaryButton={{
            text: 'Voltar',
            testId: 'config-step-controller-secondary-button',
          }}
        />
      </Paper>
    </StaticStep>
  );
}
