// ==============================|| OVERRIDES - INPUT (SAP Fiori) ||============================== //

import { Theme } from "@mui/material";

export default function Input(theme: Theme) {
  return {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderRadius: "4px", // SAP Fiori border radius
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D9D9D9", // SAP Fiori border color
            borderWidth: "1px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F57C00", // Professional Yellow/Orange primary on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F57C00", // Professional Yellow/Orange primary when focused
            borderWidth: "2px",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E9730C", // SAP Fiori error
          },
          "&.Mui-disabled": {
            backgroundColor: "#F5F6FA",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D9D9D9",
            },
          },
        },
        input: {
          padding: "10px 14px",
          fontSize: "0.875rem",
          color: "#32363A", // SAP Fiori text
          "&::placeholder": {
            color: "#6A6D70", // SAP Fiori secondary text
            opacity: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#32363A", // SAP Fiori text
          "&.Mui-focused": {
            color: "#F57C00", // Professional Yellow/Orange primary
          },
          "&.Mui-error": {
            color: "#E9730C", // SAP Fiori error
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          marginTop: "4px",
          "&.Mui-error": {
            color: "#E9730C", // SAP Fiori error
          },
        },
      },
    },
  };
}

