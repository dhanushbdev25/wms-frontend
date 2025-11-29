import { lazy } from "react";
import Loadable from "../components/third-party/Loadable";

export const AuthLogin = Loadable(
  lazy(() => import("../pages/authentication/Login"))
);
export const AuthRegister = Loadable(
  lazy(() => import("../pages/authentication/Register"))
);
export const AuthForgotPassword = Loadable(
  lazy(() => import("../pages/authentication/ForgotPassword"))
);
export const AuthResetPassword = Loadable(
  lazy(() => import("../pages/authentication/ResetPassword"))
);
