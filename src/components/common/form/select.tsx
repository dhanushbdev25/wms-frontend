import React from "react";
import { Grid, FormControl, MenuItem, Box, Link } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Label, Dropdown } from "./style";
import ErrorMessage from "./error-message";
import { useFormContext, Controller } from "react-hook-form";

type SelectProps = {
  label: string;
  name: string;
  fullWidth?: boolean;
  data: any[];
  labelKey?: string;
  valueKey?: string;
  action?: { label: string; onClick: () => void };
  required?: boolean;
  onChange?: (value: string) => void;
};

const Select: React.FC<SelectProps> = ({
  label,
  name,
  data,
  labelKey,
  valueKey,
  action,
  fullWidth = false,
  required,
  onChange,
}) => {
  const { control } = useFormContext();

  return (
    <Grid item xs={12} container alignItems="center">
      <Grid item xs={3}>
        <Label>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Label>
      </Grid>
      <Grid item xs={9}>
        <Box display="flex" alignItems="center">
          <FormControl fullWidth={fullWidth} size="small">
            <Controller
              name={name}
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                      if (onChange) onChange(String(e.target.value || ""));
                    }}
                    displayEmpty
                  >
                    {data.map((item, idx) => (
                      <MenuItem
                        key={idx}
                        value={valueKey ? item[valueKey] : item}
                      >
                        {labelKey ? item[labelKey] : item}
                      </MenuItem>
                    ))}
                  </Dropdown>
                  <ErrorMessage message={fieldState.error?.message || ""} />
                </>
              )}
            />
          </FormControl>

          {action && (
            <Link
              sx={{
                ml: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              onClick={action.onClick}
            >
              <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
              {action.label}
            </Link>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Select;
