import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import { Box, Grid, Typography } from "@mui/material";

// ==============================|| BREADCRUMBS ||============================== //

interface BreadcrumbsProps {
  navigation: Array<any>;
  enableTitle?: boolean;
}

const Breadcrumbs = ({ navigation, enableTitle }: BreadcrumbsProps) => {
  const location = useLocation();
  const [main, setMain] = useState<any>();
  const [item, setItem] = useState<any>();

  // Get the default route from Redux store
  const defaultRoute = useSelector((state: any) => state.user.defaultRoute);
  const userInfo = useSelector((state: any) => state.user.userInfo);

  // Calculate the home route dynamically
  const getHomeRoute = () => {
    // If we have a default route set, use that
    if (defaultRoute) {
      return defaultRoute;
    }

    // Otherwise, calculate from user's first available module
    if (
      userInfo?.defaultRoleModules &&
      userInfo.defaultRoleModules.length > 0
    ) {
      const firstModule = userInfo.defaultRoleModules[0];
      return `/${process.env.APP_NAME}/${firstModule.MODULE.ROUTE}`;
    }

    // Fallback to current path if nothing else available
    return location.pathname;
  };

  // set active item state
  const getCollapse = useCallback(
    (menu: any) => {
      if (menu.CHILDREN) {
        menu.CHILDREN.forEach((collapse: any) => {
          if (collapse.TYPE && collapse.TYPE === "COLLAPSE") {
            getCollapse(collapse);
          } else if (collapse.TYPE && collapse.TYPE === "ITEM") {
            const currentPath = location.pathname?.split("/");
            if (currentPath[currentPath.length - 1] === collapse.ROUTE) {
              setMain(menu);
              setItem(collapse);
            }
          }
        });
      }
    },
    [location.pathname]
  );

  useEffect(() => {
    navigation.forEach((menu) => {
      if (menu.TYPE && menu.TYPE === "GROUP") {
        getCollapse(menu);
      }
    });
  }, [navigation, location.pathname, getCollapse]);

  let mainContent;
  let itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = "";

  // collapse item
  if (main && main.TYPE === "COLLAPSE") {
    mainContent = (
      <Typography
        component={Link}
        to={document.location.pathname}
        variant="h6"
        sx={{ textDecoration: "none" }}
        color="textSecondary"
      >
        {main.MODULEGROUPDESC || main.MODULEGROUPNAME}
      </Typography>
    );
  }

  // items
  if (item && item.TYPE === "ITEM") {
    itemTitle = item.MODULEDESC || item.MODULENAME;
    itemContent = (
      <Typography variant="subtitle1" color="textPrimary">
        {itemTitle}
      </Typography>
    );

    // main
    if (item.REVEAL !== false) {
      breadcrumbContent = (
        <Box sx={{ margin: "0px 20px 20px 0px" }}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item>
              <MuiBreadcrumbs aria-label="breadcrumb">
                <Typography
                  component={Link}
                  to={getHomeRoute()} // Now dynamic!
                  color="textSecondary"
                  variant="h6"
                  sx={{ textDecoration: "none" }}
                >
                  Home
                </Typography>
                {mainContent}
                {itemContent}
              </MuiBreadcrumbs>
            </Grid>
            {enableTitle ? (
              <Grid item sx={{ mt: 2 }}>
                <Typography variant="h5">{itemTitle}</Typography>
              </Grid>
            ) : null}
          </Grid>
        </Box>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
