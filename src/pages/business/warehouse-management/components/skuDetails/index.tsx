import { useParams } from "react-router-dom";
import { Chip, Grid } from "@mui/material";
import { Cell, Table } from "../../../../../components/common/table";
import BackdropLoader from "../../../../../components/third-party/BackdropLoader";
import { useGetLocationSkuDetailsQuery } from "../../../../../store/api/warehouse-management/storageLocationApi";
import { LocationSkuDetails } from "../../../../../types/storage-location";
import { BarChart, BarChart2 } from "../../../../../components/common/charts";

const SKU_DATA = [
  { label: "HUNTER 100 TA...", value: 1000 },
  { label: "HUNTER 200 TA...", value: 2000 },
  { label: "HUNTER 300 TA...", value: 1600 },
];

const SkuDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetLocationSkuDetailsQuery(id, 
    // { refetchOnMountOrArgChange: true, }
);

  //  Arrays moved outside JSX, scoped inside function
  const labels = ["HUNTER 100 TA...", "HUNTER 100 TA...", "HUNTER 100 TA..."];

  const datasets = [
    {
      label: "In Flow",
      data: [1950, 1350, 750],
      backgroundColor: "green",
    },
    {
      label: "Out Flow",
      data: [1250, 1500, 2000],
      backgroundColor: "red",
    },
  ];
  const formattedData: LocationSkuDetails[] =
  data?.data?.map((item) => ({
    variantCode: item.VARIANT_CODE ?? "",
    variantName: item.VARIANT_NAME ?? "",
    materialType: item.MATERIAL_TYPE ?? "",
    locationCode: item.LOCATION_CODE ?? "",
    occupied: item.OCCUPIED ?? 0,
    assignedCapacity: item.ASSIGNED_CAPACITY ?? 0,
    maximumCapacity: item.MAXIMUM_CAPACITY ?? 0,
  })) || [];

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Grid container padding="20px" borderRadius="12px" bgcolor="#FFF" spacing={2}>
        <Grid item xs={12} md={6}>
          <BarChart title="SKU Distribution" label="SKU Count" data={SKU_DATA} />
        </Grid>
        <Grid item xs={12} md={6}>
          <BarChart2 title="SKU Inflow vs Outflow" labels={labels} datasets={datasets} />
        </Grid>
        <Grid item xs={12}>
          <Table<LocationSkuDetails> data={formattedData || []}>
            <Cell type="text" title="SKU Code" value="variantCode" />
            <Cell type="text" title="SKU Name" value="variantName" />
            <Cell
              type="custom"
              title="Type"
              render={(cell) => {
                const materialType = cell.row.original.materialType;
                return <Chip label={materialType} size="small" variant="outlined" />;
              }}
            />
            <Cell type="text" title="Location" value="locationCode" />
            <Cell type="text" title="Occupied" value="occupied" />
            <Cell type="text" title="Assigned Capacity" value="assignedCapacity" />
            <Cell type="text" title="Maximum Capacity" value="maximumCapacity" />
          </Table>
        </Grid>
      </Grid>
    </>
  );
};

export default SkuDetails;
