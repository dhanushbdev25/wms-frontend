import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import React from "react";

export type ButtonPropsType<T = React.MouseEvent<HTMLButtonElement>> = {
  label: string;
  name?: string;
  disableElevation?: boolean;
  size?: "small" | "medium" | "large";
  onClick?: (payload: T) => void; 
  color?: MUIButtonProps["color"];
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  sx?: React.CSSProperties;
  id?: string;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  isUpload?: boolean;
  onFileChange?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  isInboundUpload?: boolean;
};

const Button = <T,>({
  color = "primary",
  variant = "contained",
  disabled = false,
  id,
  sx,
  label,
  isUpload = false,
  onFileChange,
  multiple = false,
  accept = "*",
  onClick,
  ...buttonProps
}: ButtonPropsType<T>) => {
  return (
    <MUIButton
      color={color}
      variant={variant}
      disabled={disabled}
      sx={sx}
      id={id}
      component={isUpload ? "label" : "button"}
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
  if (typeof onClick === "function") {
    onClick(e as T);
  }


      }}
      {...buttonProps}
    >
      {label}
      {isUpload && (
        <input
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onFileChange?.(files);
          }}
        />
      )}
    </MUIButton>
  );
};

export default Button;
