import { Alert, Grid, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StatisticsSummary from "./statistics-summary";
import StorageLocationDetails from "./storage-location-details";
import SubStorageLocationTypes from "./storage-location-types";
import { LocationOverview } from "../../../../../types/storage-location";
import { LineChart, PieChart } from "../../../../../components/common/charts";

type Props = {
  data: LocationOverview;
};

const LocationOverviewDetails = ({ data }: Props) => {
  //  Arrays moved outside JSX, inside function scope
  const OCCUPANCY_DATA = [
    {
      label: "Available",
      value: (data.availableSpace / data.maxSize) * 100,
      color: "#35B933",
    },
    {
      label: "Occupied",
      value: (data.occupied / data.maxSize) * 100,
      color: "#3379F9",
    },
  ];

  const capacityStats = [
    { label: "Total Cap", value: data.fullSize },
    { label: "Max Cap", value: data.maxSize },
    { label: "Occupied Cap", value: data.occupied },
    { label: "Available Cap", value: data.availableSpace },
  ];

  const skuStats =
    data.locationPurpose === "Split"
      ? [
          { label: "SKU Type", value: data.numberOfMaterialVariants },
          { label: "Sub Locations", value: data.numberOfSublocations },
        ]
      : [{ label: "SKU Type", value: data.numberOfMaterialVariants }];

  return (
    <Grid
      container
      padding="20px"
      borderRadius="12px"
      bgcolor="#FFF"
      spacing={2}
    >
      <Grid item xs={12}>
        <StorageLocationDetails data={data} />
      </Grid>
      <Grid item xs={12} md={9}>
        <StatisticsSummary data={capacityStats} />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatisticsSummary data={skuStats} />
      </Grid>
      {data.locationPurpose === "Split" && (
        <>
          <Grid item xs={12}>
            <Alert
              icon={<InfoOutlinedIcon fontSize="small" />}
              severity="info"
              sx={{
                backgroundColor: "#EDF4FF",
                color: "text.primary",
                borderRadius: 2,
                py: 1.5,
              }}
            >
              <Typography variant="body2">
                The above storage details are sum of children details
              </Typography>
            </Alert>
          </Grid>
          <Grid item xs={12}>
            <SubStorageLocationTypes data={data.hierarchyCounts} />
          </Grid>
        </>
      )}
      <Grid item xs={12} md={6}>
        <PieChart title="Occupancy" data={OCCUPANCY_DATA} />
      </Grid>
      <Grid item xs={12} md={6}>
        <LineChart title="Occupancy Trend" data={OCCUPANCY_DATA} />
      </Grid>
    </Grid>
  );
};

export default LocationOverviewDetails;
