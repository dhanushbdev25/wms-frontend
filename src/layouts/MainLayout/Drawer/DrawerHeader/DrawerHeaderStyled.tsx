// material-ui
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

// ==============================|| DRAWER HEADER - STYLED ||============================== //

interface DrawerHeaderStyledProps extends BoxProps<any> {
  open: boolean;
}

const DrawerHeaderStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerHeaderStyledProps>(({ theme, open }) => ({
  ...theme.mixins.toolbar,
  minHeight: "64px", // Match header height
  background: "#FFFFFF", // SAP Fiori white
  boxShadow: "none",
  borderBottom: "1px solid #D9D9D9", // SAP Fiori subtle separator
  borderRadius: "0px !important",
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "flex-start" : "center",
  paddingLeft: theme.spacing(open ? 3 : 0),
  paddingRight: theme.spacing(2),
}));

export default DrawerHeaderStyled;
