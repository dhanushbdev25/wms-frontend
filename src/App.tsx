import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { extend } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

extend(utc);
extend(timezone);

import Loadable from "./components/third-party/Loadable";
import ScrollTop from "./components/third-party/ScrollTop";
import { RootState } from "./store/store";
import ThemeCustomization from "./themes";
import "./App.css";

const LoginRoutes = Loadable(lazy(() => import("./routes/LoginRoutes")));
const PostLogin = Loadable(
  lazy(() => import("./pages/authentication/PostLogin")),
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const startsWithAppName = path.startsWith(`/${process.env.APP_NAME}`);
    const isPublicRoute = !startsWithAppName;

    if (!userInfo?.token && !isPublicRoute) {
      navigate("/");
    }
  }, [userInfo?.token, location.pathname, navigate]);

  return (
    <ThemeCustomization>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ScrollTop>
          {userInfo?.token ? <PostLogin /> : <LoginRoutes />}
        </ScrollTop>
      </LocalizationProvider>
    </ThemeCustomization>
  );
};

export default App;
