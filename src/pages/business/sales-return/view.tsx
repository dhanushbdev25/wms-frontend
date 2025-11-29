import { useEffect, useMemo } from "react";
import { Box, Chip, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../../../components/common/header";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import TextFieldBase from "../../../components/textfeild/TextFieldBase";
import { Table, Cell } from "../../../components/common/table";
import { useGetReturnDetailBySRNQuery } from "../../../store/api/sales-return/salesReturnApi";
import {
  SalesReturnItemView,
  SalesReturnViewItemSchema,
} from "../../../store/api/sales-return-validators/sales-return.validator";
import useIsMobile from "../../../themes/useIsMobile";
import MobileCardList from "../../../components/common/mobile-components/mobile-cardlist";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Grid
    container
    alignItems="center"
    sx={{
      mb: 1,
      px: 1,
      py: 0.5,
      backgroundColor: "#fff",
      borderRadius: 1,
    }}
  >
    <Grid item xs={5}>
      <Typography variant="subtitle2" fontWeight={600}>
        {label}
      </Typography>
    </Grid>
    <Grid item xs={7}>
      <Chip label={value || "-"} size="small" sx={{ fontWeight: 500 }} />
    </Grid>
  </Grid>
);

const SalesReturnView = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  // Get SRN_NO from navigation state
  const { returnId } = location.state || {};
  const { data, isLoading } = useGetReturnDetailBySRNQuery(returnId, {
    skip: !returnId,
  });

  // Extract response data safely
  const detail = data?.data?.[0];
  const items = detail?.returnItems || [];

  // Transform API data → table data
  const tableData: SalesReturnItemView[] = useMemo(() => {
    if (!items.length) return [];
    return items.map((item: any, index: number) =>
      SalesReturnViewItemSchema.parse({
        id: String(index + 1),
        sku: item.VARIANT_CODE || "",
        vin: item.ATTRIBUTE_VALUE || "",
        quantity: item.RETURNED_QTY || 0,
        uom: item.UOM || "-",
        location: "-", // you can update this once location is available
        // putAwayStatus: "Not Placed",
      }),
    );
  }, [items]);
  const showVinColumn = tableData.some((item) => item.vin);

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Header
        title={detail?.SRN_NO || "Sales Return"}
        onBack={() => navigate(-1)}
        buttons={[]}
      />

      <Box sx={{ px: 2, py: 1, backgroundColor: "#fff", minHeight: "100vh" }}>
        {/* Metadata */}
        <Box sx={{ mb: 2 }}>
          <InfoRow label="Return ID:" value={detail?.SRN_NO || "-"} />
          <InfoRow
            label="Source Sales Order:"
            value={detail?.ORDER_NO || "-"}
          />
          <InfoRow
            label="Dispatch Date & Time:"
            value={
              detail?.DISPATCHED_DATE
                ? dayjs(detail.DISPATCHED_DATE).format("DD-MM-YYYY HH:mm")
                : "-"
            }
          />
          <InfoRow
            label="Return Reason:"
            value={detail?.RETURN_REASON || "-"}
          />
          <InfoRow label="Comments:" value={detail?.RETURN_COMMENTS || "-"} />
        </Box>

        {/* Return Items header */}
        <Stack direction="row" alignItems="center" sx={{ mb: 1.5, gap: "4px" }}>
          <Typography variant="h6" fontWeight={600}>
            Return Items
          </Typography>
          <TextFieldBase
            value={tableData.length.toString().padStart(2, "0")}
            size="small"
            id="return-items-count"
            aria-label="Return items count"
            inputProps={{
              readOnly: true,
              sx: {
                width: 36,
                textAlign: "center",
                fontWeight: "bold",
                padding: "2px 4px",
              },
            }}
          />
        </Stack>

        {/* Table */}
        {isMobile ? (
          <MobileCardList<SalesReturnItem>
            data={tableData}
            headers={[
              {
                titleKey: { name: "SKU", value: "sku" },
                datakey: showVinColumn
                  ? [{ name: "VIN Number", value: "vin" }]
                  : [],
                statusKey: "putAwayStatus",
                renderStatus: (putAwayStatus: any) => {
                  const status = (putAwayStatus ?? "").toString().toLowerCase();

                  let bgColor;
                  if (status === "not placed")
                    bgColor = theme.palette.error.light;
                  else if (status === "placed")
                    bgColor = theme.palette.success.light;
                  else bgColor = theme.palette.grey[400];

                  return (
                    <Chip
                      label={putAwayStatus || "-"}
                      size="small"
                      sx={{
                        backgroundColor: bgColor,
                        color: "#fff",
                        fontSize: "11px",
                        height: 22,
                        textTransform: "capitalize",
                      }}
                    />
                  );
                },
              },
            ]}
            columns={[
              { title: "Quantity", value: "quantity" },
              // { title: "UoM", value: "uom" },
              // { title: "Location", value: "location" },
            ]}
            actions={[]}
          />
        ) : (
          <Table<SalesReturnItem>
            data={tableData}
            globalFilter={false}
            initialState={{ columnPinning: { right: ["actions"] } }}
            sx={{
              borderCollapse: "collapse",
              "& .MuiTableCell-root": {
                padding: "6px 8px",
                fontSize: "0.85rem",
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                fontWeight: 600,
                color: theme.palette.grey[700],
                fontSize: "0.85rem",
              },
              "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            <Cell type="text" title="SKU" value="sku" />
            {showVinColumn && (
              <Cell type="text" title="VIN Number" value="vin" />
            )}
            <Cell type="text" title="Quantity" value="quantity" />
            {/* <Cell type="text" title="UoM" value="uom" /> */}
            {/* <Cell type="text" title="Storage Location" value="location" /> */}
            {/* <Cell
              type="custom"
              title="Put-Away Status"
              render={(cell) => {
                const { putAwayStatus } = cell.row.original;
                const status = (putAwayStatus ?? "").toString().toLowerCase();

                let bgColor;

                if (status === "not placed") {
                  bgColor = theme.palette.error.light; // red tone
                } else if (status === "placed") {
                  bgColor = theme.palette.success.light; // green tone
                } else {
                  bgColor = theme.palette.grey[400]; // fallback color
                }

                return (
                  <Chip
                    label={putAwayStatus || "-"}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: bgColor,
                      color: theme.palette.common.white,
                      fontSize: "12px",
                      height: "24px",
                      textTransform: "capitalize",
                    }}
                  />
                );
              }}
            /> */}
          </Table>
        )}
      </Box>
    </>
  );
};

export default SalesReturnView;
