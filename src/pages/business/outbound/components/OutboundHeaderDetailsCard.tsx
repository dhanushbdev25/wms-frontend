import {
  Box,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import MainCard from "../../../../components/cards/MainCard";

interface HeaderDetail {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

interface OutboundHeaderDetailsCardProps {
  details: HeaderDetail[];
}

const OutboundHeaderDetailsCard: React.FC<OutboundHeaderDetailsCardProps> = ({
  details,
}) => {
  const theme = useTheme();

  return (
    <MainCard
      sx={{
        borderRadius: 2,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        mb: 3,
      }}
      content={false}
    >
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {details.map((detail, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 1.5,
                  backgroundColor: "rgba(0, 112, 242, 0.04)",
                  border: "1px solid rgba(0, 112, 242, 0.08)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(0, 112, 242, 0.06)",
                    borderColor: "rgba(0, 112, 242, 0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    backgroundColor: "rgba(0, 112, 242, 0.1)",
                    color: theme.palette.primary.main,
                  }}
                >
                  {detail.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    {detail.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "text.primary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {detail.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainCard>
  );
};

export default OutboundHeaderDetailsCard;

