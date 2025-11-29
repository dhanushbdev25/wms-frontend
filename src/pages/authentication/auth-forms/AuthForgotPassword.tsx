import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";

import AnimateButton from "../../../components/@extended/AnimateButton";
import Button from "../../../components/common/button/Button";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { useForgotPasswordMutation } from "../../../store/api/auth/authApi";
import { RootState } from "../../../store/store";
import { displayError } from "../../../utils/helpers";

// Zod Schema for validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .nonempty("Email is required"),
});

// Form data type
type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const AuthForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const defaultRoute = useSelector(
    (state: RootState) => state.user.defaultRoute,
  );

  const [forgotPassword, { isLoading, isSuccess, error, isError }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess) {
      void Swal.fire({
        icon: "success",
        title: "Please check your mail for the reset link!",
      });
    } else if (defaultRoute) {
      navigate(defaultRoute);
    } else if (isError && error) {
      displayError(error as string);
    }
  }, [isSuccess, isError, error, defaultRoute, navigate]);

  const onSubmit = async (values: ForgotPasswordFormInputs) => {
    await forgotPassword({ EMAIL: values.email }).unwrap();
  };

  const handleBack = () => navigate(-1);

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Email Address</InputLabel>
              <OutlinedInput
                id="email-login"
                type="email"
                placeholder="Enter email address"
                fullWidth
                autoComplete="username"
                {...register("email")}
                error={Boolean(errors.email)}
              />
              {errors.email && (
                <FormHelperText error>{errors.email.message}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Grid item xs={6}>
                <AnimateButton>
                  <Button
                    label="Back"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    size="large"
                    onClick={handleBack}
                  />
                </AnimateButton>
              </Grid>
              <Grid item xs={6}>
                <AnimateButton>
                  <Button
                    disableElevation
                    label="Reset"
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  />
                </AnimateButton>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AuthForgotPassword;
