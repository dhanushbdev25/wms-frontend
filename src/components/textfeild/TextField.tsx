import React from "react";
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import { useController, Control } from "react-hook-form";

export interface TextFieldProps extends Omit<MuiTextFieldProps, "name"> {
  name: string;
  control: Control<any>;
  label?: string;
  fullWidth?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  name,
  control,
  label,
  fullWidth = true,
  ...muiProps
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <MuiTextField
      {...field}
      {...muiProps}
      label={label}
      fullWidth={fullWidth}
      error={!!error}
      helperText={error?.message || muiProps.helperText}
      sx={{ margin: "3px", ...(muiProps.sx || {}) }}
    />
  );
};

export default TextField;
