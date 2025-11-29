import { Grid } from "@mui/material";
import { FC } from "react";
import { useFormContext, Controller } from "react-hook-form";

import ErrorMessage from "./error-message";
import { Label, TextBox } from "./style";

type TextProps = {
  type?: string;
  label: string;
  name: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  xs?: number;
  labelPosition?: "top" | "left";
};

const Text: FC<TextProps> = ({
  type = "text",
  label,
  name,
  fullWidth = false,
  required,
  disabled = false,
  xs = 12,
  labelPosition = "left",
}) => {
  const { control } = useFormContext();

  const getValue = (value: string | undefined) => {
    if (value) {
      return type === "date" ? value.replace(/T.*/, "") : value;
    }
    return "";
  };

  const renderLabel = () => (
    <Label>
      {label}
      {required && <span style={{ color: "red" }}> *</span>}
    </Label>
  );

  const renderTextBox = () => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <TextBox
            {...field}
            type={type}
            fullWidth={fullWidth}
            size="small"
            disabled={disabled}
            value={getValue(field.value)}
            InputProps={{
              inputProps:
                type === "number"
                  ? {
                      min: 0,
                    }
                  : {},
            }}
          />
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
          {renderTextBox()}
        </Grid>
      )}
      {labelPosition === "left" && (
        <Grid item xs={xs} container alignItems="center">
          <Grid item xs={3}>
            {renderLabel()}
          </Grid>
          <Grid item xs={9}>
            {renderTextBox()}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Text;
