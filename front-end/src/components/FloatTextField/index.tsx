import React from 'react';
import toBRFloatNotation from 'utils/toBRFloatNotation';
import toFloatNotation from 'utils/toFloatNotation';
import NumericTextField, { INumericTextField } from 'components/NumericTextField';

interface FloatTextFieldProps extends INumericTextField {
  index?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => void;
  onBlur: (ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function FloatTextField(props: FloatTextFieldProps) {
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

  const brValueNotation = toBRFloatNotation(value);

  const valueToFloatNotation = <T extends { target: { value: string } }>(
    event: T,
  ): T => {
    const copy = { ...event };
    if (copy.target.value && copy.target.value[0] === ',') {
      copy.target.value = copy.target.value.slice(1);
    } else {
      copy.target.value = toFloatNotation(copy.target.value);
    }
    return copy;
  };

  const afterKeyDownCheck = (ev: React.KeyboardEvent) => {
    if (!/[0-9]|,/.test(ev.key) || (brValueNotation.includes(',') && ev.key === ',')) {
      ev.preventDefault();
    }
  };

  return (
    <NumericTextField
      name={name}
      label={label}
      value={brValueNotation}
      onChange={(ev) => onChange(valueToFloatNotation(ev), index)}
      onBlur={(ev) => onBlur(valueToFloatNotation(ev))}
      error={error}
      helperText={helperText}
      afterKeyDownCheck={afterKeyDownCheck}
      InputLabelProps={InputLabelProps}
      InputProps={InputProps}
      disabled={disabled}
      required={required}
      variant={variant}
      size={size}
      sx={sx}
    />
  );
}
