import React from "react";
import { Box, Grid, Typography } from "@mui/material";

type OverviewTopProps = {
  options: {
    key: string;
    label: string;
    icon: React.ReactElement;
    disabled?: boolean;
  }[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
};

const Tabs: React.FC<OverviewTopProps> = ({
  options,
  selected,
  setSelected,
}) => {
  return (
    <Grid
      container
      spacing={2}
      sx={{ borderBottom: 1, marginLeft: 0 }}
      width="100%"
      role="tablist" //  Accessibility
    >
      {options.map((opt) => {
        const isActive = selected === opt.key;
        const isDisabled = opt.disabled;

        return (
          <Box
            key={opt.key}
            onClick={() => {
              if (!isDisabled) setSelected(opt.key);
            }}
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: "8px",
              cursor: isDisabled ? "not-allowed" : "pointer", //  disable cursor
              opacity: isDisabled ? 0.5 : 1,
              transition: "all 0.3s ease",
              borderBottom: isActive
                ? "2px solid #F57C00"
                : "2px solid transparent",
              background: isActive
                ? "linear-gradient(to top, rgba(245, 124, 0, 0.3) 0%, transparent 50%)"
                : "transparent",
              "&:hover": {
                borderBottom: "2px solid #F57C00",
                "& .OptionIcon": { color: "#F57C00" },
                "& .OptionText": { color: "black", fontWeight: 500 },
              },
              outline: "none", //  Prevent default focus ring
            }}
          >
            <Box
              className="OptionBox"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {React.cloneElement(opt.icon, {
                className: "OptionIcon",
                sx: {
                  fontSize: "18px",
                  color: isActive ? "#F57C00" : "rgb(138, 138, 138)",
                },
              })}
              <Typography
                className="OptionText"
                sx={{
                  color: isActive ? "black" : "rgb(138, 138, 138)",
                  transition: "color 0.3s ease",
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : "normal",
                }}
              >
                {opt.label}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Grid>
  );
};

export default Tabs;
