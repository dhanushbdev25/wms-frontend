import { Select, styled, TextField, Typography } from "@mui/material";

export const Heading = styled(Typography)(() => ({
  color: "#172B4D",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: "700",
  lineHeight: "16px",
  letterSpacing: "0.024px",
}));

export const Label = styled(Typography)(() => ({
  color: "#626F86",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "14px",
  letterSpacing: "0.014px",
}));

export const Value = styled(Typography)(() => ({
  color: "#172B4D",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: "500",
  lineHeight: "16px",
}));

export const TextBox = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "fullWidth",
})<{ fullWidth?: boolean }>(({ fullWidth }) => ({
  borderRadius: "8px",
  width: fullWidth ? "100%" : "300px",
}));

export const Dropdown = styled(Select, {
  shouldForwardProp: (prop) => prop !== "fullWidth",
})<{ fullWidth?: boolean }>(({ fullWidth }) => ({
  borderRadius: "8px",
  width: fullWidth ? "100%" : "300px",
}));
