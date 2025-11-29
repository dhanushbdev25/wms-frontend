// ==============================|| OVERRIDES - BUTTON (SAP Fiori) ||============================== //

import { Theme } from "@mui/material";

export default function Button(theme: Theme) {
  const disabledStyle = {
    "&.Mui-disabled": {
      backgroundColor: "#D9D9D9",
      color: "#6A6D70",
    },
  };

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          textTransform: "none", // SAP Fiori uses no text transform
          borderRadius: "4px", // SAP Fiori border radius
          padding: "10px 24px",
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
        },
        contained: {
          backgroundColor: "#F57C00", // Professional Yellow/Orange primary
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#E65100", // Professional Yellow/Orange primary dark
          },
          "&:active": {
            backgroundColor: "#BF360C",
          },
          ...disabledStyle,
        },
        outlined: {
          borderColor: "#F57C00",
          color: "#F57C00",
          "&:hover": {
            borderColor: "#E65100",
            backgroundColor: "#FFF3E0", // Professional Yellow/Orange hover background
            color: "#E65100",
          },
          ...disabledStyle,
        },
        text: {
          color: "#F57C00",
          "&:hover": {
            backgroundColor: "#FFF3E0",
            color: "#E65100",
          },
          ...disabledStyle,
        },
      },
    },
  };
}
