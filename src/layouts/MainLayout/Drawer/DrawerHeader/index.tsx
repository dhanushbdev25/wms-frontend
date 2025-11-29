// material-ui
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/material";

// project import
import DrawerHeaderStyled from "./DrawerHeaderStyled";
import Logo from "../../../../components/common/logo";

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }: any) => {
  const theme = useTheme();

  return (
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo />
      </Stack>
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
