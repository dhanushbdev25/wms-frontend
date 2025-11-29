import React from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

type SectionNavigationProps = {
  options: {
    key: string;
    label: string;
    icon: React.ReactElement;
    disabled?: boolean;
    description?: string;
  }[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  options,
  selected,
  setSelected,
}) => {
  const ACTIVE_COLOR = "#F57C00";

  return (
    <Grid
      container
      spacing={2}
      sx={{
        mb: 3,
        px: { xs: 1, sm: 2 },
        pt: 2,
      }}
      role="tablist"
    >
      {options.map((opt) => {
        const isActive = selected === opt.key;
        const isDisabled = opt.disabled;

        return (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            key={opt.key}
            sx={{
              display: "flex",
            }}
          >
            <Card
              onClick={() => {
                if (!isDisabled) setSelected(opt.key);
              }}
              sx={{
                width: "100%",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1,
                transition: "all 0.3s ease-in-out",
                border: isActive
                  ? `2px solid ${ACTIVE_COLOR}`
                  : "1px solid rgba(0, 0, 0, 0.12)",
                backgroundColor: isActive
                  ? "rgba(245, 124, 0, 0.04)"
                  : "white",
                boxShadow: isActive
                  ? "0px 4px 12px rgba(245, 124, 0, 0.15)"
                  : "0px 2px 4px rgba(0, 0, 0, 0.08)",
                "&:hover": {
                  boxShadow: isDisabled
                    ? "0px 2px 4px rgba(0, 0, 0, 0.08)"
                    : "0px 6px 16px rgba(0, 0, 0, 0.12)",
                  transform: isDisabled ? "none" : "translateY(-2px)",
                  border: isDisabled
                    ? "1px solid rgba(0, 0, 0, 0.12)"
                    : `2px solid ${ACTIVE_COLOR}`,
                  backgroundColor: isDisabled
                    ? "white"
                    : "rgba(245, 124, 0, 0.06)",
                },
                outline: "none",
              }}
              elevation={0}
            >
              <CardContent
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  position: "relative",
                  "&:last-child": {
                    pb: { xs: 2, sm: 2.5 },
                  },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: isActive
                      ? "rgba(245, 124, 0, 0.1)"
                      : "rgba(0, 0, 0, 0.04)",
                    transition: "all 0.3s ease-in-out",
                    mb: 0.5,
                  }}
                >
                  {React.cloneElement(opt.icon, {
                    sx: {
                      fontSize: { xs: 24, sm: 28 },
                      color: isActive ? ACTIVE_COLOR : "rgb(138, 138, 138)",
                      transition: "color 0.3s ease-in-out",
                    },
                  })}
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isActive ? "text.primary" : "text.secondary",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                    transition: "all 0.3s ease-in-out",
                    lineHeight: 1.3,
                  }}
                >
                  {opt.label}
                </Typography>
                {opt.description && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      display: { xs: "none", sm: "block" },
                      lineHeight: 1.2,
                    }}
                  >
                    {opt.description}
                  </Typography>
                )}
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      backgroundColor: ACTIVE_COLOR,
                      borderRadius: "0 0 4px 4px",
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SectionNavigation;

