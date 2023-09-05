import React, { Fragment, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
// @mui
import { Grid } from "@mui/material";
import NavBar from "../components/nav-bar/NavBar";
//screens
import ReceivingAndQC from "./ReceivingAndQC";
import GateEntry from "./GateEntry";

//icons
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import GppGoodIcon from "@mui/icons-material/GppGood";
import InventoryIcon from "@mui/icons-material/Inventory";
import ChecklistIcon from "@mui/icons-material/Checklist";

export default function DashboardAppPage() {
  const [activeScreen, setActiveScreen] = useState("CREATE");
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <NavBar
          routes={[
            // {
            //   name: "Packing List",
            //   route: "",
            //   component: <GateEntry />,
            //   icon: <ChecklistIcon />,
            // },
            {
              name: "Gate Entry",
              route: "",
              component: <GateEntry />,
              icon: <MeetingRoomIcon />,
            },
            {
              name: "Receiving & QC",
              route: "",
              component: <ReceivingAndQC />,
              icon: <GppGoodIcon />,
            },
          ]}
        />
      </Grid>
      {/* <Grid item xs={10} style={{ marginTop: "2%" }}> */}
      {/* {sessionStorage.getItem("role") == "edit" ? (
          <Fragment>
            {activeScreen === "VIEW" ? <ViewWaybill /> : <CreateWaybill />}
          </Fragment>
        ) : (
          <Fragment>
            <ViewWaybill />
          </Fragment>
        )} */}
      {/* <ViewWaybill /> */}
      {/* </Grid> */}
    </Grid>
  );
}
