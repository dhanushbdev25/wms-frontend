import { Button, Grid, Paper } from "@mui/material";
import BreadcrumbsCustom from "../components/breadcrumbs/Breadcrumbs";
import ScanToProceed from "./images/Scan-To-Proceed.svg";
import PartListCard from "../components/partListCard/PartListCard";
import { useState } from "react";

function ReceivingAndQC() {
  const breadcrumbValues = ["Dashbord", "Receiving & Quality Inspection"];
  const [partDetails, setPartDetails] = useState([
    {
      partNo: "ENG921093198990",
      partDescription: "Engine",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
    {
      partNo: "CHA921093198990",
      partDescription: "Chassis",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
    {
      partNo: "RAD921093198990",
      partDescription: "Radiator",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
    {
      partNo: "RAD921093198990",
      partDescription: "Radiator",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
    {
      partNo: "RAD921093198990",
      partDescription: "Radiator",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
    {
      partNo: "RAD921093198990",
      partDescription: "Radiator",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
    {
      partNo: "RAD921093198990",
      partDescription: "Radiator",
      packingDate: "29-08-2023",
      dimensions: "24X34",
      quantity: 1,
    },
  ]);

  return (
    <Grid container spacing={3}>
      <BreadcrumbsCustom breadcrumbValues={breadcrumbValues} />
      {/* <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(70vh)",
        }}
      >
        <img
          src={ScanToProceed}
          style={{ width: "80%", maxWidth: "400px" }}
          alt="Scan To Proceed"
        />
      </Grid> */}
      <Grid item xs={11}>
        <Paper
          elevation={0}
          square
          style={{
            minHeight: "10vh",
            filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.07))",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <Grid
              item
              xs={5}
              style={{
                paddingLeft: "3%",
                color: "#1a2b58",
                fontWeight: "bolder",
              }}
            >
              BOX.12312312513
            </Grid>
            <Grid
              item
              xs={3}
              style={{
                color: "#1a2b58",
                fontWeight: "bolder",
              }}
            >
              No. Of items: {7}
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                paddingRight: "3%",
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                style={{ color: "#e03832", borderColor: "#e03832" }}
              >
                QC Hold
              </Button>
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                paddingRight: "3%",
              }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ background: "#e03832" }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} style={{ paddingLeft: "5%" }}>
        <Grid
          container
          spacing={2}
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {partDetails?.map((element) => (
            <PartListCard
              partNo={element.partNo}
              partDescription={element.partDescription}
              packingDate={element.packingDate}
              dimensions={element.dimensions}
              quantity={element.quantity}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ReceivingAndQC;
