import React from 'react';
import {
  Grid,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import SortButton from 'components/SortButton';
import './installments-step.css';
import InstallmentForm from 'components/InstallmentForm';
import { ReportedInstallment } from 'types/installments';
import RemoveButton from 'components/RemoveButton';

interface InstallmentFormContainerProps {
  installment: ReportedInstallment
  focusedInstallmentRef: React.MutableRefObject<HTMLDivElement | null> | null;
  index: number;
  lastIndex?: boolean;
  onRemove: () => void;
  onSort: () => void;
  onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void
  onChangeProgress: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number
  ) => void;
}

export default function InstallmentFormContainer(props: InstallmentFormContainerProps) {
  const {
    installment, focusedInstallmentRef, index,
    onRemove, onSort, lastIndex,
    onChange, onChangeProgress,
  } = props;

  let className = 'installment-container';
  if (installment.deferredPrice) {
    className += ' accumulated-installment';
  }
  if (installment.progress === 'Adiado') {
    className += ' deferred-installment';
  }

  return (
    <Grid
      id={installment.tmpId}
      ref={focusedInstallmentRef}
      container
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      className={className}
      data-testid={`${index}-installment-content`}
    >
      <Grid
        container
        flexDirection="row"
        alignItems="center"
        justifyContent="space-evenly"
        paddingBottom={1}
      >
        <Grid
          container
          item
          flexBasis="33%"
        />
        <Grid
          container
          item
          flexBasis="33%"
          justifyContent="center"
        >
          <Typography
            variant="h6"
            component="span"
          >
            {`#${index + 1}`}
          </Typography>
          <RemoveButton
            onRemove={onRemove}
            testId="remove-installment-button"
          />
        </Grid>
        <Grid
          container
          item
          flexBasis="33%"
          justifyContent="end"
        >
          <SortButton
            onSort={onSort}
            testId="sort-installments-button"
          />
        </Grid>
      </Grid>
      <InstallmentForm
        installment={installment}
        index={index}
        lastIndex={lastIndex}
        onChange={onChange}
        onChangeProgress={onChangeProgress}
      />
    </Grid>
  );
}
