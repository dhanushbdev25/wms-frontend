// material-ui
import { alpha, Theme } from "@mui/material/styles";

// ==============================|| DEFAULT THEME - CUSTOM SHADOWS (SAP Fiori) ||============================== //

const CustomShadows = (theme: Theme) => ({
  button: `0 1px 2px ${alpha(theme.palette.grey[900], 0.08)}`,
  text: `0 -1px 0 ${alpha(theme.palette.grey[900], 0.08)}`,
  // SAP Fiori elevation levels
  z1: `0px 2px 4px ${alpha(theme.palette.grey[900], 0.08)}`, // Elevation 1
  z2: `0px 4px 8px ${alpha(theme.palette.grey[900], 0.12)}`, // Elevation 2
  z3: `0px 8px 16px ${alpha(theme.palette.grey[900], 0.12)}`, // Elevation 3
  z4: `0px 12px 24px ${alpha(theme.palette.grey[900], 0.12)}`, // Elevation 4
  z5: `0px 16px 32px ${alpha(theme.palette.grey[900], 0.12)}`, // Elevation 5
});

export default CustomShadows;
