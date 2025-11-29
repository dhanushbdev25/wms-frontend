import { useRoutes } from "react-router-dom";
import { loginRoutesConfig } from "./loginRoutesConfig";

export default function LoginRoutes() {
  return useRoutes([loginRoutesConfig]);
}
