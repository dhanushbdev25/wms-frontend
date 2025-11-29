import { useMemo } from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import DrawerHeader from "./DrawerHeader";
import DrawerContent from "./DrawerContent";
import MiniDrawerStyled from "./MiniDrawerStyled";

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //
interface MainDrawerProps {
  open: boolean;
  handleDrawerToggle: () => void;
  window?: any;
}
const MainDrawer = ({ open, handleDrawerToggle, window }: MainDrawerProps) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  // Create a custom theme for the drawer component
  const customTheme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
            boxShadow: "none", // SAP Fiori uses border instead of shadow
            borderRight: "1px solid #D9D9D9", // SAP Fiori subtle border
            backgroundColor: "#FFFFFF", // SAP Fiori white background
          },
        },
      },
    },
  });

  // Responsive drawer container
  const container =
    window !== undefined ? () => window().document.body : undefined;

  // Header content
  const drawerContent = useMemo(() => <DrawerContent />, []);
  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

  return (
    <ThemeProvider theme={customTheme}>
      <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}>
        {!matchDownMD ? (
          <MiniDrawerStyled variant="permanent" open={open}>
            {drawerHeader}
            {drawerContent}
          </MiniDrawerStyled>
        ) : (
          <Drawer
            container={container}
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", lg: "none" },
            }}
          >
            {open && drawerHeader}
            {open && drawerContent}
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default MainDrawer;
