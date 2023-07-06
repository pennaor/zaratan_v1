import React from 'react';
import {
  Typography,
} from '@mui/material';

interface FieldHelperTextProps {
  value?: string;
  report: string;
  constraint?: number;
  testIdPrefix?: string;
}

export default function FieldHelperText(props: FieldHelperTextProps) {
  const {
    constraint = 0, value = '',
    report, testIdPrefix,
  } = props;

  return (
    <>
      <Typography
        component="span"
        display="block"
        textAlign="start"
        fontSize="0.80rem"
        data-testid={`${testIdPrefix}-field-helper-report`}
      >
        {report}
      </Typography>
      { !!constraint && (
      <Typography
        component="span"
        display="block"
        color="grey"
        fontWeight={value.length === constraint ? 700 : 400}
        textAlign="end"
        fontSize="0.75rem"
        marginTop={0.25}
        data-testid={`${testIdPrefix}-field-helper-constraint`}
      >
        {`${value.length}/${constraint}`}
      </Typography>
      ) }
    </>
  );
}
