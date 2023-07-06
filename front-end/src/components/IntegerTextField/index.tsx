import React from 'react';
import NumericTextField, { INumericTextField } from 'components/NumericTextField';
import toBRIntegerNotation from 'utils/toBRIntegerNotation';
import toIntegerNotation from 'utils/toIntegerNotation';

interface IntegerTextFieldProps extends INumericTextField {
  index?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
  onBlur: (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function IntegerTextField(props: IntegerTextFieldProps) {
  const {
    label, name,
    value, error,
    helperText, InputProps,
    InputLabelProps, index = 0,
    onChange, onBlur,
    required, disabled,
    variant, size,
    sx,
  } = props;

  const brValueNotation = toBRIntegerNotation(value);

  const valueToIntegerNotation = <T extends { target: { value: string } }>(
    event: T,
  ): T => {
    const copy = { ...event };
    copy.target.value = toIntegerNotation(copy.target.value);
    return copy;
  };

  const afterKeyDownCheck = (keyboardEvent: React.KeyboardEvent) => {
    if (!/[0-9]/.test(keyboardEvent.key)) {
      keyboardEvent.preventDefault();
    }
  };

  return (
    <NumericTextField
      label={label}
      name={name}
      value={brValueNotation}
      onChange={(ev) => onChange(valueToIntegerNotation(ev), index)}
      onBlur={(ev) => onBlur(valueToIntegerNotation(ev))}
      afterKeyDownCheck={afterKeyDownCheck}
      error={error}
      helperText={helperText}
      InputLabelProps={InputLabelProps}
      InputProps={{ ...InputProps, inputMode: 'numeric' }}
      disabled={disabled}
      required={required}
      variant={variant}
      size={size}
      sx={sx}
    />
  );
}
