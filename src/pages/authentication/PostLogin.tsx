import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useRoutes, Navigate } from "react-router-dom";
 
import { Screens } from "../../routes/screenList";
import MainLayout from "../../layouts/MainLayout";
import { useAppDispatch } from "../../store/store";
import { setDefaultRoute } from "../../store/reducers/userInfo";
import { setRouteMapping } from "../../store/reducers/routeMapping";
 
export default function PostLogin() {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const routeMapping = useSelector(
    (state: any) => state.routeMapping.routeMapping
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [childRoutes, setChildRoutes] = useState<any[]>([]);
  const [defaultPath, setDefaultPath] = useState<string>("");


  useEffect(() => {
    if (!userInfo?.token) {
      navigate("/");
      return;
    }

    const finalRoutes = (userInfo.defaultRoleModules || [])
      .map((mod: any) => {
        const screen = Screens[mod?.MODULE?.MODULENAME];
        return screen
          ? {
              path: mod.MODULE.ROUTE,
              element: <screen.element />,
            }
          : null;
      })
      .filter(Boolean) as Array<{ path: string; element: JSX.Element }>;
 
    if (!finalRoutes.length) {
      navigate("/");
      return;
    }
 
    setChildRoutes(finalRoutes);
 
    const firstPath = `/${process.env.APP_NAME}/${finalRoutes[0].path}`;
    setDefaultPath(firstPath);
 
    if (!routeMapping) {
      navigate(firstPath);
    }
    dispatch(setRouteMapping(userInfo.consolidatedModuleGroupingParent));
    dispatch(setDefaultRoute(firstPath));
  }, [userInfo, routeMapping, navigate, dispatch]);
 
  const routes = [
    {
      path: "/",
      element: defaultPath && <Navigate to={defaultPath} replace />,
    },
    {
      path: `/${process.env.APP_NAME}/*`,
      element: <MainLayout />,
      children: childRoutes,
    },
  ];
 
  return useRoutes(routes);
}
