// material-ui
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";

// project import
import { drawerWidth } from "../../../config";

const openedMixin = (theme: any) => ({
  width: drawerWidth,
  borderRight: "1px solid #D9D9D9", // SAP Fiori subtle border
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  boxShadow: "none", // SAP Fiori uses border instead of shadow
  backgroundColor: "#FFFFFF", // SAP Fiori white background
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 0,
  borderRight: "1px solid #D9D9D9", // Keep border even when closed
  boxShadow: "none",
  backgroundColor: "#FFFFFF",
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<any>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default MiniDrawerStyled;
