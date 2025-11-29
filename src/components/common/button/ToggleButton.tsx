import { Switch, FormControlLabel, SxProps, Theme } from "@mui/material";
import React from "react";

interface SwitchButtonProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: false;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  required?: false;
  id?: string;
  name?: string;
  sx?: SxProps<Theme>;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  label,
  checked,
  disabled = false,
  color = "primary",
  size = "medium",
  onChange,
  required = false,
  id,
  name,
  sx,
}) => {
  if (checked !== undefined ) {
    console.warn(
      "SwitchButton: Do not use both checked and defaultChecked. Use checked for controlled, defaultChecked for uncontrolled.",
    );
  }

  const switchElement = (
    <Switch
      checked={checked}
      disabled={disabled}
      color={color}
      size={size}
      onChange={onChange}
      required={required}
      id={id}
      name={name}
      inputProps={{ "aria-label": label || name || id }}
      sx={sx}
    />
  );

  if (label) {
    return <FormControlLabel control={switchElement} label={label} />;
  }

  return switchElement;
};

export default SwitchButton;
