import { Backdrop } from "@mui/material";
import React from "react";
import { Triangle } from "react-loader-spinner";

function BackdropLoader(props: any) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props?.openStates}
    >
      <Triangle
        height="180"
        width="80"
        color="#3865c3"
        ariaLabel="triangle-loading"
        visible={props?.openStates}
      />
    </Backdrop>
  );
}

export default BackdropLoader;
