import { Box, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import InspectionSummaryTable from "./InspectionSummaryTable";
import Header from "../../../../components/common/header";
import PutAwayOperationTable from "./PutAwayOperationTable";
import {
  useGetPackageOrderByIdQuery,
  useGetPutawayItemsByIdQuery,
} from "../../../../store/api/Inbound/inboundApi";
import StatisticsSummary from "../../../../components/common/statistics-summary";
import { useMemo } from "react";

export type PutAwayItem = {
  skuName: string;
  skuCode: string;
  vinNumber: string;
  uom: string;
  status: string;
  location: string;
};

const InfoField = ({
  label,
  value,
  gridSize = 4,
}: {
  label: string;
  value: string | number | null;
  gridSize?: number;
}) => (
  <Grid item xs={12} sm={gridSize}>
    <Box sx={{ bgcolor: "#F3F4F6", p: 1.5, borderRadius: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600} sx={{ color: "inherit" }}>
        {value ?? "-"}
      </Typography>
    </Box>
  </Grid>
);

const Summary = () => {
  const location = useLocation();
  const packageId = location.state?.packageId;

  // ✅ Cast response so TS knows about all_sku_list
  const { data: summaryData, isLoading } =
    useGetPackageOrderByIdQuery(packageId);

  const { data: putawayData, isLoading: putawayload } =
    useGetPutawayItemsByIdQuery(packageId);

  console.log("summaryData", putawayData);

  const navigate = useNavigate();

  // Static placeholders
  const dateTime = "01/01/2025 – 12:28";
  const performedBy = "john.doe@hero.com";

  const containerInfo = summaryData?.data;

  // 🔧 Normalize QTY to number for inspection items
  const normalizedItems =
    containerInfo?.ITEM_QUALITY_INSPECTION?.data?.map((item: any) => ({
      ...item,
      QTY: Number(item.QTY) || 0,
    })) ?? [];
  const skuList: PutAwayItem[] = useMemo(() => {
    if (!putawayData?.data) return [];
    const { placedItems = [], putawayItems = [] } = putawayData.data;
    const sourceItems = placedItems.length > 0 ? placedItems : putawayItems;
    const allSkus = sourceItems.flatMap((item: any) => item.SKU_LIST || []);
    return allSkus.map((sku: any) => ({
      skuName: sku.SKU_NAME ?? "",
      skuCode: sku.SKU_CODE ?? "",
      vinNumber: sku.VIN_NUMBER ?? "",
      uom: sku.UOM ?? "",
      status: sku.ITEM_STATUS ?? "",
      location: sku.LOCATION_STATUS ?? "",
    }));
  }, [putawayData]);

  return (
    <>
      <BackdropLoader openStates={isLoading || putawayload} />
      <Header title="Summary" onBack={() => navigate(-1)} buttons={[]} />

      <Box sx={{ px: 2, py: 2, bgcolor: "#fff" }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <InfoField
            label="Container Number"
            value={containerInfo?.CONTAINER_NO ?? null}
          />
          <InfoField
            label="Shipment Advice Number"
            value={containerInfo?.SHIPMENT_ADVICE_NO ?? null}
          />
          <InfoField
            label="Purchase Order"
            value={containerInfo?.PO_NO ?? null}
          />
        </Grid>
        <StatisticsSummary data={containerInfo?.STATISTICS ?? []} />
        {/* Container Quality Inspection */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Container Quality Inspection
            </Typography>
            <Typography variant="body2">{dateTime}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Performed by: {performedBy}
          </Typography>
          <Typography variant="body2">
            Result:{" "}
            <b>{containerInfo?.CONTAINER_QUALITY_INSPECTION?.STATUS ?? "-"}</b>
          </Typography>
        </Box>
        {/* Item-Level Quality Inspection */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Item-Level Quality Inspection
            </Typography>
            <Typography variant="body2">{dateTime}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Performed by: {performedBy}
          </Typography>
          <Typography variant="body2">
            Result:{" "}
            <b>
              {containerInfo?.ITEM_QUALITY_INSPECTION?.data?.length
                ? "Partially Passed"
                : "-"}
            </b>
          </Typography>
        </Box>
        {/* Item details table */}
        <InspectionSummaryTable items={normalizedItems} />
        {/* Put-Away Operation */}
        <Box sx={{ mb: 3, mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Put-Away Operation
            </Typography>
            <Typography variant="body2">{dateTime}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Performed by: {performedBy}
          </Typography>
        </Box>
        <PutAwayOperationTable items={skuList} />
        {/* GRN Timestamps */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              GRN Initiated
            </Typography>
            <Typography variant="body2">{dateTime}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Performed by: {performedBy}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              GRN Created
            </Typography>
            <Typography variant="body2">{dateTime}</Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Summary;
