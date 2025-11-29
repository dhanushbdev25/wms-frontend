import { Box, Chip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import React, { useMemo, useState } from "react";

import { Table, Cell } from "../../../../components/common/table/index";
import {
  useGetDispatchedItemsQuery,
  usePostCreateWayBillMutation,
} from "../../../../store/api/outbound/api";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import Button from "../../../../components/common/button/Button";
import useIsMobile from "../../../../themes/useIsMobile";
import MobileCardList from "../../../../components/common/mobile-components/mobile-cardlist";
import { ResponseDialog } from "../../inbound/putaway-dialogs/putaway-response-dialog";

const DispatchTable: React.FC<{ orderId: number; serialized: boolean }> = ({
  orderId,
  serialized,
}) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { data: responseData, isLoading: dispatchIsLoading } =
    useGetDispatchedItemsQuery(orderId!, {
      skip: !orderId,
      refetchOnMountOrArgChange: true,
    });

  const dispatchdata = responseData?.data;
  // console.log("dispatchdata",dispatchdata);
  const [openResponse, setOpenResponse] = useState<boolean>(false);
  const [wayBillResponse, setWayBillResponse] = useState<any>();
  const [postCreateWayBill, { isLoading: postLoading }] =
    usePostCreateWayBillMutation();

  const statusColors: Record<string, string> = {
    "picked up": theme.palette.success.light,
    pickedup: theme.palette.success.light,
    "PICKED UP": theme.palette.success.light,
    item_sold: theme.palette.primary.dark,
    transferred: theme.palette.primary.dark,
    "to assembly": theme.palette.primary.dark,
  };

  const mappedPickedUp = useMemo(() => {
    const pickedUp = dispatchdata?.pickedUp ?? [];
    return pickedUp.map((item: any) => ({
      sku: item.VARIANT_CODE,
      skuName: item.VARIANT_NAME,
      vinNumber: item.ATTRIBUTE_VALUE,
      status: item.STATUS === "PICKEDUP" ? "PICKED UP" : item.STATUS,
      dispatchId: item.DISPATCH_ID,
    }));
  }, [dispatchdata]);

  // console.log("mappedPickedUp", dispatchdata);

  const mappedOthers = useMemo(() => {
    const others = dispatchdata?.others ?? [];
    return others.map((item: any) => ({
      sku: item.VARIANT_CODE,
      skuName: item.VARIANT_NAME,
      vinNumber: item.ATTRIBUTE_VALUE,
      status:
        item.STATUS == "WAYB_UNDER_APPROVAL"
          ? "WAYBILL UNDER APPROVAL"
          : item.STATUS == "ITEM_SOLD" ? "Item Sold" : item.STATUS,
      dispatchId: item.DISPATCH_ID,
      REF_DOC_NO: item.REF_DOC_NO,
      REF_DOC_APPROVED: item.REF_DOC_APPROVED,
    }));
  }, [dispatchdata]);

  // Row selection state for Picked Up table only
  const [rowSelectionPickedUp, setRowSelectionPickedUp] = useState<{
    [key: string]: boolean;
  }>({});

  const handleCreateWaybill = async () => {
    const selectedRows = Object.keys(rowSelectionPickedUp)
      .filter((key) => rowSelectionPickedUp[key])
      .map((key) => mappedPickedUp[Number(key)].dispatchId);

    if (selectedRows.length === 0) return;

    const payload = { allocationIds: selectedRows };
    const res = await postCreateWayBill(payload).unwrap();

    
    if (res) {
      setOpenResponse(true);
      if (dispatchdata?.ORDER_TYPE === "SO" || dispatchdata?.data?.ORDER_TYPE === "SO") {
        setWayBillResponse({
          type: "WB",
          data: res.data,
        });
      } else {
        setWayBillResponse({
          type: "LTO",
          data: res.data,
        });
      }
    }

    // Reset selection after creation
    setRowSelectionPickedUp({});
  };
  const orderTypeLabels: Record<string, string> = {
    SO: "Create Way Bill",
    AO: "Create Assembly",
    MR: "Create LTO",
    MI: "Create LTO",
  };

  return (
    <Box>
      <BackdropLoader openStates={dispatchIsLoading || postLoading} />

      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 1.5,
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
        >
          <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Dispatch
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
            }}
          >
            Dispatch picked up items and create waybills or LTOs. Select items and generate shipping documents.
          </Typography>
        </Box>
      </Box>

      {isMobile ? (
        <>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <h3>Picked Up</h3>
              <Button
                label={
                  orderTypeLabels[dispatchdata?.data?.ORDER_TYPE] ||
                  "Create Order"
                }
                onClick={handleCreateWaybill}
                disabled={Object.keys(rowSelectionPickedUp).length === 0}
                sx={{ height: "35px" }}
              />
            </Box>

            <MobileCardList
              data={mappedPickedUp}
              enableRowSelection={true}
              enableSelectAll={true}
              // getRowId={(row) => row?.id}
              getRowId={(_, index) => index.toString()}
              rowSelection={rowSelectionPickedUp}
              onRowSelectionChange={(newSel) => setRowSelectionPickedUp(newSel)}
              headers={[
                {
                  titleKey: { name: "SKU Code", value: "sku" },
                  datakey: [{ name: "SKU Name", value: "skuName" }],
                },
              ]}
              columns={[
                // serialized
                //   ? { title: "VIN Number", value: "vinNumber" }
                //   : { title: "Quantity", value: "quantity" },
                ...(serialized ? [{ title: "Picked", value: "Picked" }] : []),
                {
                  title: "Status",
                  value: "status",
                  render: (item) => {
                    const lower = (item.status ?? "").toLowerCase();
                    const color = statusColors?.[lower] ?? "#666";
                    return (
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                            backgroundColor: color,
                            color: "#fff",
                            height: 22,
                            fontSize: "10px",
                            padding: "0 3px",
                          }}
                      />
                    );
                  },
                },
              ]}
              actions={[]}
            />
          </Box>
          <Box>
            <h3>Others</h3>

            <MobileCardList
              data={mappedOthers}
              headers={[
                {
                  titleKey: { name: "SKU Code", value: "sku" },
                  datakey: [serialized
                  ? { title: "VIN", value: "vinNumber" }
                  : { title: "Quantity", value: "quantity" }],
                },
              ]}
              columns={[{name: "SKU Name", value: "skuName"},
                {
                  title: "Status",
                  value: "status",
                  render: (item) => {
                    const lower = (item.status ?? "").toLowerCase();
                    const color = statusColors?.[lower] ?? "#666";
                    return (
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                            backgroundColor: color,
                            color: "#fff",
                            height: 22,
                            fontSize: "10px",
                            padding: "0 3px",
                          }}
                      />
                    );
                  },
                },

                { title: "REF DOC Number", value: "REF_DOC_NO" },
                {
                  title: "REF DOC Approved",
                  value: "REF_DOC_APPROVED",
                  render: (item) =>
                    item.REF_DOC_APPROVED ? (
                      <Chip label="Yes" size="small" color="success" />
                    ) : (
                      <Chip label="No" size="small" color="error" />
                    ),
                },
              ]}
              actions={[]}
            />
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <h3>Picked Up</h3>
              <Button
                label={
                  orderTypeLabels[dispatchdata?.ORDER_TYPE] || "Create Order"
                }
                onClick={handleCreateWaybill}
                disabled={Object.keys(rowSelectionPickedUp).length === 0}
                sx={{ height: "35px" }}
              />
            </Box>

            <Table
              data={mappedPickedUp}
              enableRowSelection={true}
              state={{ rowSelection: rowSelectionPickedUp }}
              onRowSelectionChange={(updaterOrValue) =>
                setRowSelectionPickedUp(
                  typeof updaterOrValue === "function"
                    ? updaterOrValue(rowSelectionPickedUp)
                    : updaterOrValue,
                )
              }
            >
              <Cell type="text" title="SKU Code" value="sku" />
              <Cell type="text" title="SKU Name" value="skuName" />
              {serialized && (
                <Cell type="text" title="VIN" value="vinNumber" />
              )}
              {/* {serialized ? (
                <Cell type="text" title="Vin Number" value="vinNumber" />
              ) : (
                <Cell type="text" title="Quantity" value="quantity" />
              )} */}
              <Cell
                type="status"
                title="Status"
                value="status"
                colors={statusColors}
              />
            </Table>
          </Box>

          <Box>
            <h3>Others</h3>
            <Table data={mappedOthers}>
              <Cell type="text" title="SKU Code" value="sku" />
              <Cell type="text" title="SKU Name" value="skuName" />
              {serialized && (
                <Cell type="text" title="VIN" value="vinNumber" />
              )}

              {/* {serialized ? (
                <Cell type="text" title="VIN Number" value="vinNumber" />
              ) : (
                <Cell type="text" title="Quantity" value="quantity" />
              )} */}
              <Cell
                type="status"
                title="Status"
                value="status"
                colors={statusColors}
              />
              <Cell type="text" title="REF DOC Number" value="REF_DOC_NO" />
              <Cell
                type="boolean"
                title="REF DOC Approved"
                value="REF_DOC_APPROVED"
              />
            </Table>
          </Box>
        </>
      )}

      <ResponseDialog
        open={openResponse}
        setOpenResponse={setOpenResponse}
        data={wayBillResponse}
      />
    </Box>
  );
};

export default DispatchTable;
