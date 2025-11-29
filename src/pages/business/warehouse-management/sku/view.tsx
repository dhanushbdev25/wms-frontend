import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Chip, Tooltip, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Header from "../../../../components/common/header";
import { 
  Heading,
  Label, 
  Value,
} from "../../../../components/common/form/style";
import { Cell, Table } from "../../../../components/common/table";
import { useGetSkuLocationDetailQuery } from "../../../../store/api/warehouse-management/skuApi";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { SkuDetailById } from "../../../../types/sku";

//  Define column config outside JSX
const columns: {
  type: "text" | "status" | "custom" | "person";
  title: string;
  value:
    | "LOCATION"
    | "STOCK_QUALITY"
    | "RECEIVING_STATUS"
    | "TYPE"
    | "CONDITION"
    | "ASSIGNED_CAPACITY"
    | "MAX_CAPACITY";
}[] = [
  { type: "text", title: "Location", value: "LOCATION" },
  { type: "text", title: "Stock Quality", value: "STOCK_QUALITY" },
  { type: "text", title: "Receiving Status", value: "RECEIVING_STATUS" },
  { type: "text", title: "Type", value: "TYPE" },
  { type: "text", title: "Condition", value: "CONDITION" },
  { type: "text", title: "Assigned Capacity", value: "ASSIGNED_CAPACITY" },
  { type: "text", title: "Maximum Capacity", value: "MAX_CAPACITY" },
];

const ViewSku = () => {
  const { warehouseId, id } = useParams();
  const navigate = useNavigate();
  const [skuData, setSkuData] = useState<SkuDetailById | null>(null);

  const { data, isLoading } = useGetSkuLocationDetailQuery({ warehouseId: warehouseId as string, id: id as string });

  useEffect(() => {
    console.log("SKU Data fetched:", data);
    if (!isLoading && data?.data) {
      setSkuData(data.data);
    }
  }, [data, isLoading]);

  //  Explicitly typed header buttons
  const headerButtons: {
    label: string;
    color?: "primary" | "secondary";
    variant?: "contained" | "outlined";
    icon?: JSX.Element;
    onClick: () => void;
  }[] = [
    {
      label: "Edit",
      color: "secondary",
      variant: "outlined",
      icon: <EditIcon />,
      onClick: () => {
        navigate(
          `/${process.env.APP_NAME}/warehouse-management/${warehouseId}/sku/${id}/edit`
        );
      },
    },
  ];

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      {skuData && (
        <>
        <Grid item xs={12} container alignItems="center">
          <Grid item xs={12}>
            <Header
              onBack={() =>
                navigate(
                  `/${process.env.APP_NAME}/warehouse-management/${warehouseId}`,
                )
              }
              title={skuData.DESCRIPTION}
              buttons={headerButtons}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                padding: "20px",
                borderRadius: "12px 12px 0 0",
                background: "#FFF",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Heading>SKU Information</Heading>
                </Grid>
                <Grid item xs={3}>
                  <Label>Description</Label>
                </Grid>
                <Grid item xs={9}>
                  <Value>{skuData.DESCRIPTION}</Value>
                </Grid>
                <Grid item xs={3}>
                  <Label>SKU</Label>
                </Grid>
                <Grid item xs={9}>
                  <Value>{skuData.VARIANT_NAME}</Value>
                </Grid>
                <Grid item xs={3}>
                  <Label>SKU Code</Label>
                </Grid>
                <Grid item xs={9}>
                  <Value>{skuData.VARIANT_CODE}</Value>
                </Grid>
                <Grid item xs={3}>
                  <Label>SKU Type</Label>
                </Grid>
                <Grid item xs={9}>
                  <Chip label={skuData.MATERIAL_TYPE} size="small" />
                </Grid>
                <Grid item xs={3}>
                  <Label>Status</Label>
                </Grid>
                <Grid item xs={9}>
                  <Chip
                    label={skuData.STATUS}
                    color={skuData.STATUS === "Active" ? "primary" : "default"}
                    size="small"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Heading>Stock Alerts</Heading>
                </Grid>
                <Grid item xs={3} display="flex" alignItems="center" gap={0.5}>
                  <Label>Low Stock Alert</Label>
                  <Tooltip title="Threshold for low stock alert">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Grid>
                <Grid item xs={9}>
                  <Value>{skuData.LOW_STOCK_ALERT}</Value>
                </Grid>
                <Grid item xs={3} display="flex" alignItems="center" gap={0.5}>
                  <Label>High Stock Alert</Label>
                  <Tooltip title="Threshold for high stock alert">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </Grid>
                <Grid item xs={9}>
                  <Value>{skuData.HIGH_STOCK_ALERT}</Value>
                </Grid>
                <Grid item xs={12}>
                  <Heading>Storage Location Mapping</Heading>
                </Grid>
                <Grid item xs={12}>
                  <Table<any> data={skuData.STORAGE_LOCATIONS}>
                    {columns.map((col) => (
                      <Cell
                        key={col.value}
                        type={col.type}
                        title={col.title}
                        value={col.value}
                      />
                    ))}
                  </Table>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
        </>
      )}
    </>
  );
};

export default ViewSku;
