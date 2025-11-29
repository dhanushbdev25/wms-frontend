// material-ui
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";

// project import
import { drawerWidth } from "../../../config";

// ==============================|| HEADER - APP BAR STYLED ||============================== //

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<any>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  borderBottom: "1px solid #D9D9D9", // SAP Fiori subtle border
  boxShadow: "none", // No shadow, just border
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default AppBarStyled;
