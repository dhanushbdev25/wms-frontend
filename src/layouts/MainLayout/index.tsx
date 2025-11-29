import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

// material-ui

// project import
import { openDrawer } from "../../store/reducers/menu";
import { useAppDispatch, useAppSelector, RootState } from "../../store/store";

import Drawer from "./Drawer";
import Header from "./Header";

// types

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout: React.FC = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useAppDispatch();
  const { drawerOpen } = useAppSelector((state: RootState) => state.menu);

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
  }, [matchDownLG, dispatch]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
  }, [drawerOpen, open]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#F5F6FA", // SAP Fiori background
      }}
    >
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            width: `${open ? "calc(100% - 270px)" : "100%"}`,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F5F6FA", // SAP Fiori background
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Toolbar sx={{ minHeight: "64px !important" }} />
          <Box 
            sx={{ 
              flexGrow: 1, 
              overflow: "auto", 
              padding: { xs: 2, sm: 3 }, // SAP Fiori spacing
              backgroundColor: "#F5F6FA",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
