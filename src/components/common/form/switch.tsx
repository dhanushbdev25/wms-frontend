import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Grid, Switch } from "@mui/material";
import { Label } from "./style";
import ErrorMessage from "./error-message";

type SwitchProps = {
  label: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  xs?: number;
  labelPosition?: "top" | "left";
};

const SwitchField: React.FC<SwitchProps> = ({
  label,
  name,
  required,
  disabled = false,
  xs = 12,
  labelPosition = "left",
}) => {
  const { control } = useFormContext();

  const renderLabel = () => (
    <Label>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </Label>
  );

  const renderSwitch = () => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <Switch {...field} checked={!!field.value} disabled={disabled} />
          <ErrorMessage message={fieldState.error?.message || ""} />
        </>
      )}
    />
  );

  return (
    <>
      {labelPosition === "top" && (
        <Grid item xs={xs}>
          {renderLabel()}
          {renderSwitch()}
        </Grid>
      )}
      {labelPosition === "left" && (
        <Grid item xs={xs} container alignItems="center">
          <Grid item xs={3}>
            {renderLabel()}
          </Grid>
          <Grid item xs={9}>
            {renderSwitch()}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default SwitchField;
