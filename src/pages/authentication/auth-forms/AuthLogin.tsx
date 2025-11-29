import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircularProgress,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z } from "zod";

import AnimateButton from "../../../components/@extended/AnimateButton";
import Button from "../../../components/common/button/Button";
import { useLoginUserMutation } from "../../../store/api/auth/authApi";
import { displayError } from "../../../utils/helpers";

//  Zod Schema for Validation
const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address")
    .nonempty("Email is required"),
  password: z.string().min(5, "Password must be at least 6 characters"),
});

//  Form Data Type
type LoginFormInputs = z.infer<typeof loginSchema>;

const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginUser, { isLoading, isSuccess, error, isError, data }] =
    useLoginUserMutation();

  //  React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  //  Navigate after successful login
  useEffect(() => {
    if (isSuccess && data) {
      navigate("/");
    } else if (isError) {
      displayError(error);
    }
  }, [isSuccess, isError, error, data, navigate]);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (values: LoginFormInputs) => {
    await loginUser({ EMAIL: values.email, PASSWORD: values.password });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
          {/* Email Field */}
          <Grid item xs={12}>
            <Stack spacing={1.5}>
              <InputLabel 
                htmlFor="email-login"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#32363A",
                  mb: 0.5,
                }}
              >
                Email Address
              </InputLabel>
              <OutlinedInput
                id="email-login"
                type="email"
                autoComplete="username"
                placeholder="Enter email address"
                fullWidth
                {...register("email")}
                error={Boolean(errors.email)}
                sx={{
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D9D9D9",
                    borderWidth: "1px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#F57C00",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#F57C00",
                    borderWidth: "2px",
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E9730C",
                  },
                }}
              />
              {errors.email && (
                <FormHelperText 
                  error
                  sx={{
                    fontSize: "0.75rem",
                    marginTop: 0.5,
                  }}
                >
                  {errors.email.message}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Password Field */}
          <Grid item xs={12}>
            <Stack spacing={1.5}>
              <InputLabel 
                htmlFor="password-login"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#32363A",
                  mb: 0.5,
                }}
              >
                Password
              </InputLabel>
              <OutlinedInput
                id="password-login"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                fullWidth
                {...register("password")}
                error={Boolean(errors.password)}
                sx={{
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#D9D9D9",
                    borderWidth: "1px",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#F57C00",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#F57C00",
                    borderWidth: "2px",
                  },
                  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E9730C",
                  },
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      size="large"
                      sx={{
                        color: "#6A6D70",
                        "&:hover": {
                          color: "#F57C00",
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      {showPassword ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <FormHelperText 
                  error
                  sx={{
                    fontSize: "0.75rem",
                    marginTop: 0.5,
                  }}
                >
                  {errors.password.message}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Forgot Password Link */}
          <Grid item xs={12} sx={{ mt: 0.5 }}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  color: "#F57C00",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#E65100",
                  },
                }}
              >
                Forgot Password?
              </Link>
            </Stack>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting || isLoading}
                label={isLoading ? "Logging in..." : "Login"}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                startIcon={
                  isLoading ? (
                    <CircularProgress
                      size={16}
                      thickness={4}
                      sx={{
                        color: "#FFFFFF",
                      }}
                    />
                  ) : null
                }
                sx={{
                  backgroundColor: "#F57C00",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  padding: "10px 24px",
                  textTransform: "none",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: isLoading ? "#F57C00" : "#E65100",
                  },
                  "&:active": {
                    backgroundColor: "#BF360C",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#D9D9D9",
                    color: "#6A6D70",
                  },
                }}
              />
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
  );
};

export default AuthLogin;
