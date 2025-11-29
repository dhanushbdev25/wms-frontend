// src/components/textfeild/TextFieldBase.tsx
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";
import React from "react";

const TextFieldBase: React.FC<MuiTextFieldProps> = (props) => {
  return (
    <MuiTextField {...props} sx={{ margin: "3px", ...(props.sx || {}) }} />
  );
};

export default TextFieldBase;
