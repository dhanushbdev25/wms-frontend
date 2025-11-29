import { Theme } from "@mui/material/styles";

export type LocationStatus =
  | "QI-Passed"
  | "Damaged"
  | "Not-Found"
  | "QI-Pending"
  | "Placed"
  | "Received"
  | "unKnown";

export const mapStatusToLocationStatus = (status: string): LocationStatus => {
  switch (status) {
    case "QI-PASSED":
      return "QI-Passed";
    case "DAMAGED":
      return "Damaged";
    case "NOT-FOUND":
      return "Not-Found";
    case "QI-PENDING":
      return "QI-Pending";
    case "PLACED":
      return "Placed";
    case "RECEIVED":
      return "Received";
    default:
      return "unKnown";
  }
};

export const getStatusStyles = (status: string, theme: Theme) => {
  switch (status) {
    case "QI-Passed":
    case "Placed":
      return {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.contrastText,
      };

    case "Damaged":
    case "QI-FAILED":
    case "QI-Failed":
      return {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
      };

    case "Not-Found":
      return {
        backgroundColor: theme.palette.grey[400],
        color: theme.palette.getContrastText(theme.palette.grey[400]),
      };

    case "QI-Pending":
      return {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.contrastText,
      };

    case "Received":
      return {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.contrastText,
      };
    case "NEW":
      case "New":
      return {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.contrastText,
      };

    case "unKnown":
      return {
        backgroundColor: theme.palette.text.disabled,
        color: theme.palette.getContrastText(theme.palette.text.disabled),
      };

    default:
      return {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      };
  }
};
