import React from "react";
import LoadingButton from "@mui/lab/LoadingButton"; 
import SaveIcon from "@mui/icons-material/Save";

export type ButtonProps = {
  label?: string;
  onClick?: () => void;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  style?: React.CSSProperties;
  loading?: boolean;
  children?: React.ReactNode;
};

const CustomLoadingButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  color = "primary",
  variant = "contained",
  disabled = false,
  type,
  fullWidth,
  style,
  children,
  loading = false,
  ...muiProps
}) => {
  return (
    <LoadingButton
      color={color}
      onClick={onClick}
      loading={loading}
      loadingPosition="start"
      startIcon={<SaveIcon />}
      variant={variant}
      disabled={disabled}
      type={type}
      fullWidth={fullWidth}
      style={style}
      {...muiProps}
    >
      {children || label}
    </LoadingButton>
  );
};

export default CustomLoadingButton;
