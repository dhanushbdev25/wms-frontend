import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import loginImage from "./images/truck-login-page.svg";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<any>({ status: false, message: "" });
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/login`,
      data: {
        email: email,
        password: password,
      },
    })
      .then((result) => {
        sessionStorage.setItem("jwt", result.data.token);
        sessionStorage.setItem("role", result.data.role);
        navigate("/mainscreen");
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setError({
          status: true,
          message: "Invalid email/password, please check again.",
        });
      });
  };

  return (
    <Grid container>
      <Grid item sm={4} md={7}>
        <img src={loginImage} style={{ height: "590px" }} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        style={{ background: "#d9e5ff" }}
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#3865c3" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              InputLabelProps={{ shrink: true }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ background: "#3865c3" }}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
            <Grid container>
              {error.status ? (
                <Grid
                  item
                  xs
                  style={{
                    fontSize: "12px",
                    color: "grey",
                    textAlign: "center",
                  }}
                >
                  {error.message}
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
