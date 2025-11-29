// material-ui
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import { AppBar, IconButton, Toolbar, useMediaQuery } from "@mui/material";

// project import
import AppBarStyled from "./AppBarStyled";
import HeaderContent from "./HeaderContent";

// assets
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

// ==============================|| MAIN LAYOUT - HEADER ||============================== //
interface HeaderProps {
  open: boolean;
  handleDrawerToggle: any;
}
const Header = ({ open, handleDrawerToggle }: HeaderProps) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const iconBackColor = "#F5F6FA"; // SAP Fiori background
  const iconBackColorOpen = "#E8EBF0"; // SAP Fiori hover background
  
  // Create a custom theme by extending the existing theme
  const customTheme = createTheme({
    ...theme,
    components: {
      ...theme.components,
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "0px",
            boxShadow: "none",
            border: "none !important",
          },
        },
      },
    },
  });

  // common header
  const mainHeader = (
    <Toolbar
      sx={{
        minHeight: "64px !important", // SAP Fiori standard header height
        height: "64px",
        px: { xs: 2, sm: 3 },
      }}
    >
      <IconButton
        disableRipple
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        color="secondary"
        sx={{
          color: "#32363A",
          bgcolor: open ? iconBackColorOpen : "transparent",
          ml: { xs: 0, lg: -1 },
          borderRadius: "4px",
          "&:hover": {
            bgcolor: "#E8EBF0",
            color: "#F57C00",
          },
        }}
      >
        {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </IconButton>
      <HeaderContent />
    </Toolbar>
  );

  const appBar = {
    position: "fixed",
    color: "inherit",
    background: "#FFFFFF", // SAP Fiori white header
    elevation: 0,
    borderBottom: "1px solid #D9D9D9", // SAP Fiori subtle border
    boxShadow: "none", // No shadow, just border
  };

  return (
    <ThemeProvider theme={customTheme}>
      {!matchDownMD ? (
        <AppBarStyled open={open} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar 
          sx={{ 
            background: "#FFFFFF !important",
            borderBottom: "1px solid #D9D9D9",
            boxShadow: "none",
          }}
        >
          {mainHeader}
        </AppBar>
      )}
    </ThemeProvider>
  );
};

export default Header;
