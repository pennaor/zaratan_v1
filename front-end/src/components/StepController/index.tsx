import React from 'react';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';

type MainButton = {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  testId?: string;
};

type SecondaryButton = {
  onClickHandler?: React.MouseEventHandler<HTMLButtonElement>;
  text: string;
  testId?: string;
};

type StepControllerProps = {
  mainButton: MainButton;
  secondaryButton: SecondaryButton;
};

export default function StepController({ mainButton, secondaryButton }: StepControllerProps) {
  return (
    <Grid
      container
      justifyContent="center"
      paddingX={1}
      paddingTop={2}
      paddingBottom={2}
    >
      <Button
        variant="contained"
        onClick={mainButton.onClickHandler}
        data-testid={mainButton.testId}
        sx={{ mr: 1, color: 'white' }}
      >
        { mainButton.text }
      </Button>
      <Button
        disabled={!secondaryButton.onClickHandler}
        onClick={secondaryButton.onClickHandler}
        data-testid={secondaryButton.testId}
      >
        { secondaryButton.text }
      </Button>
    </Grid>
  );
}
