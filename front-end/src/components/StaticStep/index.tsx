import React from 'react';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import './static-step.css';

type StaticStepProps = {
  stepIndex: number;
  label: string;
  children: JSX.Element | JSX.Element[];
  testIdSuffix?: string
};

export default function StaticStep(props: StaticStepProps) {
  const {
    stepIndex,
    label,
    children,
    testIdSuffix,
  } = props;

  return (
    <Step index={stepIndex}>
      <StepLabel className="static-step-label" data-testid={`step-label-${testIdSuffix}`}>
        {label}
      </StepLabel>
      <StepContent
        TransitionProps={{
          unmountOnExit: false,
          onEnter: () => document.querySelector('body')?.classList.add('freeze-body'),
          onExited: () => document.querySelector('body')?.classList.remove('freeze-body'),
        }}
        data-testid={`step-content-${testIdSuffix}`}
      >
        {children}
      </StepContent>
    </Step>
  );
}
