import React, { ReactNode } from "react";
import PropTypes from "prop-types";

// material-ui
import { Box } from "@mui/material";
import MainCard from "../../components/cards/MainCard";

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //

interface AuthCardProps {
  children: ReactNode;
  [key: string]: any;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, ...other }) => (
  <MainCard
    sx={{
      maxWidth: { xs: 420, lg: 500 },
      margin: { xs: 2.5, md: 3 },
      borderRadius: "12px", // Modern rounded corners
      backgroundColor: "#FFFFFF", // SAP Fiori Surface
      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.08)", // Enhanced shadow for depth
      border: "1px solid rgba(0, 112, 242, 0.08)", // Subtle border
      backdropFilter: "blur(10px)",
      "& > *": {
        flexGrow: 1,
        flexBasis: "50%",
      },
      "&:hover": {
        boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.15), 0px 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease-in-out",
      },
    }}
    content={false}
    {...other}
    border={false}
    boxShadow={false}
  >
    <Box sx={{ p: { xs: 4, sm: 5, md: 6, xl: 7 } }}>{children}</Box>
  </MainCard>
);

AuthCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthCard;
