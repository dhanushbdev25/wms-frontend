import PropTypes from "prop-types";

// material-ui
import { Box, Grid } from "@mui/material";

// project import
import AuthCard from "./AuthCard";
import Logo from "../../components/common/logo";
import AuthFooter from "../../components/cards/AuthFooter";

// assets
import AuthBackground from "../../assets/images/auth/AuthBackground";
import { ReactNode } from "react";

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //
interface AuthWrapperProps {
  children: ReactNode;
  [key: string]: any;
}
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }: any) => (
  <Box sx={{ minHeight: "100vh" }}>
    <AuthBackground />
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
        <Logo />
      </Grid>
      <Grid item xs={12}>
        <Grid
          item
          xs={12}
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: { xs: "calc(100vh - 134px)", md: "calc(100vh - 127px)" },
          }}
        >
          <Grid item>
            <AuthCard>{children}</AuthCard>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 1, mt: 1 }}>
        <AuthFooter />
      </Grid>
    </Grid>
  </Box>
);

AuthWrapper.propTypes = {
  children: PropTypes.node,
};

export default AuthWrapper;
