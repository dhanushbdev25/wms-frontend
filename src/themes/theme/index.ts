// ==============================|| PRESET THEME - THEME SELECTOR ||============================== //

import { darken, lighten } from "@mui/material";

const Theme = (colors: Record<string, string[]>) => {
  const { gold, cyan, green, grey, red, yellow } = colors;
  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16],
  };
  const yellowColors = {
    0: yellow[0],
    50: yellow[1],
    100: yellow[2],
    200: yellow[3],
    300: yellow[4],
    400: yellow[5],
    500: yellow[6],
    600: yellow[7],
    700: yellow[8],
    800: yellow[9],
    900: yellow[10],
    A50: yellow[15],
    A100: yellow[11],
    A200: yellow[12],
    A400: yellow[13],
    A700: yellow[14],
    A800: yellow[16],
  };
  const contrastText = "#fff";

  // Define the primary and secondary base colors - Professional Yellow/Orange Palette
  const primaryBaseColor = "#F57C00"; // Material Design Orange 700
  const secondaryBaseColor = "#E65100"; // Material Design Orange 900

  // Utility functions to generate shades
  const generateShades = (color: string) => ({
    lighter: lighten(color, 0.85),
    100: lighten(color, 0.7),
    200: lighten(color, 0.5),
    light: lighten(color, 0.25),
    400: lighten(color, 0.15),
    main: color,
    dark: darken(color, 0.2),
    700: darken(color, 0.3),
    darker: darken(color, 0.4),
    900: darken(color, 0.5),
    contrastText: "#ffffff",
  });

  const primaryShades = generateShades(primaryBaseColor);
  const secondaryShades = generateShades(secondaryBaseColor);

  return {
    primary: {
      lighter: primaryShades.lighter,
      100: primaryShades[100],
      200: primaryShades[200],
      light: primaryShades.light,
      400: primaryShades[400],
      main: primaryShades.main,
      dark: primaryShades.dark,
      700: primaryShades[700],
      darker: primaryShades.darker,
      900: primaryShades[900],
      contrastText: "#ffffff",
    },
    secondary: {
      lighter: secondaryShades.lighter,
      100: secondaryShades[100],
      200: secondaryShades[200],
      light: secondaryShades.light,
      400: secondaryShades[400],
      main: secondaryShades.main,
      dark: secondaryShades.dark,
      700: secondaryShades[700],
      darker: secondaryShades.darker,
      900: secondaryShades[900],
      contrastText: "",
    },
    error: {
      lighter: "#FFE8E0",
      light: "#FF8C42",
      main: "#E9730C", // SAP Fiori Error
      dark: "#C55A00",
      darker: "#A04700",
      contrastText,
    },
    warning: {
      lighter: "#FFF4E6",
      light: "#FFCC66",
      main: "#FFB300", // SAP Fiori Warning
      dark: "#CC8F00",
      darker: "#996C00",
      contrastText: greyColors[100],
    },
    info: {
      lighter: "#FFF3E0",
      light: "#FFB74D",
      main: "#F57C00", // Professional Yellow/Orange (same as primary)
      dark: "#E65100",
      darker: "#BF360C",
      contrastText,
    },
    success: {
      lighter: "#E6F5EC",
      light: "#4DB87A",
      main: "#107E3E", // SAP Fiori Success
      dark: "#0D6532",
      darker: "#0A4B26",
      contrastText,
    },
    grey: greyColors,
    yellow: yellowColors,
    status: {
      pending: "#FEF8E8",
      accepted: "#48D7B9",
      rejected: "#F9789A",
    },
  };
};

export default Theme;
