import { Backdrop, useTheme } from "@mui/material";
import { Dna } from "react-loader-spinner";
interface BackdropLoaderprops {
  openStates: boolean;
}
function BackdropLoader({ openStates }: BackdropLoaderprops) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openStates}
    >
      <Dna
        visible={openStates}
        height="100"
        width="100"
        // color={theme.palette.secondary.main}
        // secondaryColor={theme.palette.secondary.main}
        // radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </Backdrop>
  );
}

export default BackdropLoader;
