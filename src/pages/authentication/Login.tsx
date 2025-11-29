
// material-ui
import { Grid, Stack, Typography } from "@mui/material";

// project import
import AuthLogin from "./auth-forms/AuthLogin";
import AuthWrapper from "./AuthWrapper";

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          sx={{ mb: 3 }}
        >
          <Typography 
            variant="h3"
            sx={{
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "#32363A",
              letterSpacing: "-0.01em",
            }}
          >
            Login
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
