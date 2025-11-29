import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";

import AnimateButton from "../../../components/@extended/AnimateButton";
import Button from "../../../components/common/button/Button";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { useResetPasswordMutation } from "../../../store/api/auth/authApi";
import { RootState } from "../../../store/store";

// ============================|| RESET PASSWORD SCHEMA ||============================ //

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(4, "Must be at least 4 characters")
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/\d/, "Must contain at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least 1 special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const AuthResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const defaultRoute = useSelector(
    (state: RootState) => state.user.defaultRoute,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetPassword, { isLoading, isSuccess, isError, error }] =
    useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      // Show success alert then navigate after it closes
      Swal.fire({
        icon: "success",
        title: "Password reset, please login to continue!",
      })
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          // If the alert fails for some reason, still navigate
          navigate("/");
        });
    } else if (defaultRoute) {
      navigate(defaultRoute);
    }
  }, [isSuccess, isError, error, navigate, defaultRoute]);

  const onSubmit = async (values: ResetPasswordFormInputs) => {
    await resetPassword({ PASSWORD: values.password, TOKEN: token });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Password Input */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password">New Password</InputLabel>
              <OutlinedInput
                fullWidth
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                {...register("password")}
                error={Boolean(errors.password)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle-password-visibility"
                      onClick={() => setShowPassword((prev) => !prev)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
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
                <FormHelperText error>{errors.password.message}</FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Confirm Password Input */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="confirm-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                fullWidth
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                error={Boolean(errors.confirmPassword)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle-confirm-password-visibility"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showConfirmPassword ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.confirmPassword && (
                <FormHelperText error>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting}
                label="Submit"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              />
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AuthResetPassword;
