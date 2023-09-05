import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            boxShadow: "none",
          },
        },
        sizeLarge: {
          height: 48,
        },
        containedInherit: {
          backgroundColor: "#e03832",
          color: theme.palette.grey[800],

          // boxShadow: theme.customShadows.z8,
          "&:hover": {
            backgroundColor: theme.palette.grey[400],
          },
        },
        // containedPrimary: {
        //   boxShadow: theme.customShadows.primary,
        // },
        // containedSecondary: {
        //   boxShadow: theme.customShadows.secondary,
        // },
        outlinedInherit: {
          border: `1px solid #e03832`,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
        textInherit: {
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
