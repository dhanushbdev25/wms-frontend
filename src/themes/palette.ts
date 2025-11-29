// material-ui
import { presetPalettes } from "@ant-design/colors";
import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// project import
import ThemeOption from "./theme";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode: PaletteMode | undefined) => {
  const colors = presetPalettes;

  const greyPrimary = [
    "#ffffff",
    "#fafafa",
    "#f5f5f5",
    "#f0f0f0",
    "#d9d9d9",
    "#bfbfbf",
    "#8c8c8c",
    "#595959",
    "#262626",
    "#141414",
    "#000000",
  ];
  const greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  const greyConstant = ["#fafafb", "#e6ebf1"];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  return createTheme({
    palette: {
      mode,
      common: {
        black: "#000",
        white: "#fff",
      },
      ...paletteColor,
      text: {
        primary: "#32363A", // SAP Fiori Text
        secondary: "#6A6D70", // SAP Fiori Secondary Text
        disabled: paletteColor.grey[400],
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: paletteColor.grey[200],
      background: {
        paper: "#FFFFFF", // SAP Fiori Surface
        default: "#F5F6FA", // SAP Fiori Background
      },
    },
  });
};

export default Palette;
