import { Grid, Paper } from "@mui/material";
import React from "react";

function PartListCard(props: any) {
  const { partNo, partDescription, packingDate, dimensions, quantity } = props;
  return (
    <Grid item xs={10.5}>
      <Paper
        elevation={0}
        square
        style={{
          minHeight: "10vh",
          filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.07))",
          padding: "1%",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Grid container>
              <Grid
                item
                xs={12}
                style={{ color: "#E03832", fontWeight: "600" }}
              >
                {partDescription}
              </Grid>
              <Grid item xs={12} style={{ color: "#99A3AD" }}>
                {partNo}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container>
              <Grid
                item
                xs={12}
                style={{ color: "#5C677D", fontWeight: "600" }}
              >
                Packing Date
              </Grid>
              <Grid item xs={12} style={{ color: "#99A3AD" }}>
                {packingDate}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container>
              <Grid
                item
                xs={12}
                style={{ color: "#5C677D", fontWeight: "600" }}
              >
                Quantity
              </Grid>
              <Grid item xs={12} style={{ color: "#99A3AD" }}>
                {quantity}N
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container>
              <Grid
                item
                xs={12}
                style={{ color: "#5C677D", fontWeight: "600" }}
              >
                Status
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  borderRadius: "4px",
                  background: "var(--green-green-90, #E8F3EB)",
                  textAlign: "center",
                  color: "var(--green-green, #158932)",
                  fontWeight: 400,
                }}
              >
                Verified
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default PartListCard;
