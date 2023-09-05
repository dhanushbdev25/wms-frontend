import { Grid, Link, Typography, Breadcrumbs } from "@mui/material";
import React from "react";

function BreadcrumbsCustom({ breadcrumbValues }: any) {
  return (
    <Grid item xs={12}>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbValues?.map((element: any, index: any) =>
          index == breadcrumbValues?.length - 1 ? (
            <Typography
              color="#E03832"
              fontSize="13px"
              style={{ cursor: "default" }}
            >
              {element}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="inherit"
              href="/"
              style={{ color: "#7D8597", fontSize: "13px" }}
            >
              {element}
            </Link>
          )
        )}
      </Breadcrumbs>
    </Grid>
  );
}

export default BreadcrumbsCustom;
