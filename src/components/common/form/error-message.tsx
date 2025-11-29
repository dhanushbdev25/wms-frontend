import { Typography } from "@mui/material";

const ErrorMessage = ({ message }: { message?: string }) => {
  return message ? (
    <Typography
      variant="caption"
      color="error"
      sx={{ mt: 0.5, display: "block" }}
    >
      {message}
    </Typography>
  ) : null;
};

export default ErrorMessage;
