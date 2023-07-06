import React from 'react';
import {
  InputLabelProps as TInputLabelProps,
  TextField, SxProps, Theme, InputProps as IInputPRops,
} from '@mui/material';

export interface INumericTextField {
  label: string;
  name: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  error: boolean;
  helperText: React.ReactNode;
  InputProps?: Partial<IInputPRops>;
  InputLabelProps?: Partial<TInputLabelProps>;
  variant?: 'standard' | 'filled' | 'outlined';
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

interface NumericTextFieldProps extends INumericTextField {
  afterKeyDownCheck?: (keyboardEvent: React.KeyboardEvent) => void;
}

export default function NumericTextField(props: NumericTextFieldProps) {
  const {
    label, name,
    value, error,
    helperText, InputProps,
    InputLabelProps, onChange,
    onBlur, afterKeyDownCheck,
    disabled = false, required = false,
    variant = 'outlined', size = 'medium',
    sx = { marginTop: 1.65 },
  } = props;

  const onKeyDown = (ev: React.KeyboardEvent) => {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowRight',
      'ArrowLeft',
      'End',
      'Delete',
    ];
    if (allowedKeys.includes(ev.key)) {
      return;
    }

    if (ev.ctrlKey && ev.key === 'v') {
      return ev.preventDefault();
    }

    if (!ev.ctrlKey && afterKeyDownCheck) {
      afterKeyDownCheck(ev);
    }
  };

  return (
    <TextField
      type="text"
      name={name}
      label={label}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      error={error}
      helperText={helperText}
      variant={variant}
      size={size}
      sx={sx}
      FormHelperTextProps={{ sx: { textAlign: 'center' } }}
      InputLabelProps={InputLabelProps}
      InputProps={{ ...InputProps, inputMode: 'numeric' }}
      fullWidth
      required={required}
    />
  );
}
