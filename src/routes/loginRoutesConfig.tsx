import { RouteObject } from "react-router-dom";
import {
  AuthLogin,
  AuthRegister,
  AuthForgotPassword,
  AuthResetPassword,
} from "./AuthComponents";
import MinimalLayout from "../layouts/MinimalLayout";

export const loginRoutesConfig: RouteObject = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    { path: "/", element: <AuthLogin /> },
    { path: "register", element: <AuthRegister /> },
    { path: "forgot-password", element: <AuthForgotPassword /> },
    { path: "reset-password/:token", element: <AuthResetPassword /> },
    
  ],
};
