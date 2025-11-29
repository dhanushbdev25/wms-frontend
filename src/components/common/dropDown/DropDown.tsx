import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

type DropDownProps = {
  label: string;
  name?: string;
  value?: any;
  onChange?: any;
  list: { value: any; label: string; data?: any }[];
  styles?: React.CSSProperties;
  defaultValue?: string;
  fullWidth?: boolean;
  onBlur?: any;
  size?: any;
  error?: any;
  helperText?: string;
  onSkuSelect?: any;
  removeBorder?: boolean; // Add this prop to conditionally remove the border
  disabled?: boolean;
};

const DropDown: React.FC<DropDownProps> = ({
  list,
  styles,
  helperText,
  removeBorder = false, // Default value is false
  disabled,
  size = "small",
  ...muiProps
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="custom-select-label">{muiProps.label}</InputLabel>
      <Select
        labelId="custom-select-label"
        id="custom-select"
        fullWidth
        disabled={disabled}
        size={size}
        MenuProps={{
          PaperProps: {
            sx: {

              maxHeight: 250,
              overflowY: "auto",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
            },
          },
        }}
        sx={{
          ...styles,
          backgroundColor: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            border: removeBorder ? "none" : undefined,
          },
        }}
        {...muiProps}
      >
        {list?.length === 0 ? (
          <MenuItem disabled>No data found</MenuItem>
        ) : (
          list?.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && (
        <FormHelperText style={{ color: "red" }}>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default DropDown;
