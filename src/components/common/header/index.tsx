import { Box, Button, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useIsMobile from "../../../themes/useIsMobile";

type Props = {
  title: string;
  onBack?: () => void;
  buttons: {
    label: string;
    color?:
      | "inherit"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    variant?: "contained" | "outlined" | "text";
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
};

const Header = ({ title, onBack, buttons }: Props) => {
  const isMobile = useIsMobile();

  return (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    padding={isMobile ? "4px 6px" : "10px 0px"}
    sx={{
      width: "100%",
    }}
  >
    {/* LEFT SECTION */}
    <Box display="flex" alignItems="center" gap={isMobile ? 0.5 : 1}>
      {onBack && (
        <IconButton
          sx={{
            background: "#fff",
            border: "1px solid #ccc",
            width: isMobile ? 28 : 36,
            height: isMobile ? 28 : 36,
            "&:hover": { background: "#f0f0f0" },
          }}
          onClick={onBack}
        >
          <ArrowBackIcon sx={{ fontSize: isMobile ? 18 : 22 }} />
        </IconButton>
      )}
      <Typography
        color="primary"
        fontWeight={isMobile ? 600 : 700}
        fontSize={isMobile ? "16px" : "20px"}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: isMobile ? "65vw" : "auto",
        }}
      >
        {title}
      </Typography>
    </Box>
    {/* RIGHT SECTION */}
    {buttons.length > 0 && (
      <Box display="flex" alignItems="center" gap={isMobile ? 0.5 : 1}>
        {buttons.map(({ label, variant, icon, onClick, disabled }, index) => (
          <Button
            key={index}
            variant={variant || "contained"}
            startIcon={icon || null}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 65 : 90,
              height: isMobile ? 28 : 36,
              textTransform: "none",
              padding: isMobile ? "2px 6px" : "6px 12px",
            }}
            onClick={onClick}
            disabled={disabled}
          >
            <Typography fontSize={isMobile ? 10 : 13}>
              {label}
            </Typography>
          </Button>
        ))}
      </Box>
    )}
  </Box>
);
};

export default Header;
