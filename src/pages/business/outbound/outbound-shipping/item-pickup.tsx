import React, { useEffect, useState } from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import {
  Box,
  Typography,
  Grid,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  TextField,
  Chip,
} from "@mui/material";
import {
  useGetPickupItemsQuery,
  usePostPickUpItemsMutation,
} from "../../../../store/api/outbound/api";
import ScanOutBoundHeaderDialog from "../outbound-scanheader";
import CustomAccordion from "../../../../components/accordian/Accordian";
import { Cell, Table } from "../../../../components/common/table";
import OutboundStorageCard from "../components/OutboundStorageCard";
import { ScanDialogPickup } from "./itempickup-popup";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { SkuItem } from "@/store/api/outbound-validators/outbound.validator";
import useIsMobile from "../../../../themes/useIsMobile";
import MobileCardList from "../../../../components/common/mobile-components/mobile-cardlist";
import { displayError } from "../../../../utils/helpers";

const ItemPickup: React.FC<{
  orderId: number;
  serialized: boolean;
  setEnableDispatchItem: Function;
}> = ({ orderId, serialized, setEnableDispatchItem }) => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { data: responseData, isLoading: pickupLoading } =
    useGetPickupItemsQuery(orderId!, {
      skip: !orderId,
      refetchOnMountOrArgChange: true,
    });
  const [patchPickUpItems, { isLoading: postloading }] =
    usePostPickUpItemsMutation();

  const [orderItems, setOrderItemId] = useState<any>();
  const [pickupData, setPickupData] = useState<any>();

  useEffect(() => {
    setPickupData(responseData?.data);
    if (responseData?.data?.pickedUpItems.length > 0) {
      setEnableDispatchItem(true);
    }
  }, [responseData]);

  const normalTableData =
    pickupData?.pickupSummary?.map((item: any) => ({
      sku: item.SKU,
      skuName: item.VARIANT_NAME,
      Allocated: item.ALLOCATED,
      Picked: item.PICKED,
      ReqQuantity: item.REQUESTED_QTY,
      orderItemId: item.ORDER_ITEM_ID,
    })) ?? [];

  const pickedUpData =
    pickupData?.pickedUpItems?.map((item :any) => ({
      sku: item.VARIANT_CODE,
      skuName: item.VARIANT_NAME,
      vin_number: item.ATTRIBUTE_VALUE,
      stockId: item.STOCK_ID,
      storage: item.STATUS == "WAYB_UNDER_APPROVAL"
          ? "WAYBILL UNDER APPROVAL"
          : item.STATUS =="LTO_UNDER_APPROVAL" ? "LTO Under Approval" :item.STATUS ,
      quantity: 1,
    })) || [];

  const storageData =
    pickupData?.readyForPickup?.flatMap((warehouse: any) =>
      warehouse.locations.map((loc: any) => ({
        storageName: loc.LOCATION_NAME,
        skuList: loc.items
          .filter((data: any) => !data.IS_PICKED)
          .map((item: any) => ({
            sku: item.VARIANT_CODE,
            skuName: item.VARIANT_NAME,
            vin_number: item.VIN,
            stockId: item.STOCK_ID,
            storage:
              item.STATUS === "AVAILABLE" ? "Yet To Pickup" : item.STATUS,
            orderItemId: item.ORDER_ITEM_ID,
            qty: item.QUANTITY,
          })),
      })),
    ) ?? [];

  const storageDataforScan =
    pickupData?.readyForPickup?.flatMap((warehouse: any) =>
      warehouse.locations.map((loc: any) => ({
        storageName: loc.LOCATION_NAME,
        skuList: loc.items
          // .filter((data: any) => !data.IS_PICKED)
          .map((item: any) => ({
            sku: item.VARIANT_CODE,
            skuName: item.VARIANT_NAME,
            vin_number: item.VIN,
            stockId: item.STOCK_ID,
            storage:
              item.STATUS === "AVAILABLE" ? "yet to pickup" : item.STATUS,
            orderItemId: item.ORDER_ITEM_ID,
            qty: item.QUANTITY,
            ispicked : item.IS_PICKED
          })),
      })),
    ) ?? [];

  const statusColors: Record<string, string> = {
    "yet to pickup": theme.palette.error.dark,
    "PICKEDUP -FIFO": theme.palette.primary.light,
    pickedup: theme.palette.success.light,
  };

  const [openItem, setOpenItem] = useState(false);
  const [matchedItems, setMatchedItems] = useState<any>(null);
  const [value, setValue] = useState("");
  const handleClickOpen = () => setOpenItem(true);
  const handleClose = () => setOpenItem(false);
  // console.log("storage.skuList",storageData);

  // console.log("matchedItems",matchedItems ,storageDataforScan);
  
  useEffect(() => {
    if (!matchedItems) return;
    handleSave();
  }, [matchedItems]);

  const handleSave = async () => {
    if (!matchedItems) return;

    const body = serialized
      ? {
          orderId: orderId,
          values: [
            {
              vin: matchedItems.vin_number,
              orderItemId: orderItems?.orderItemId || orderId,
            },
          ],
        }
      : {
          orderId: orderId,
          values: [
            {
              orderItemId: orderItems?.orderItemId || orderId,
              VARIANT_CODE: matchedItems?.sku,
              // Qty: Number(quantity) || matchedItems?.quantity || 1,
              Qty: orderItems?.allocatedQty,
            },
          ],
        };

    // console.log("body", body);
    const res = await patchPickUpItems(body);
    if (res.error) {
      displayError(res.error.data);
    } else {
      handleClickOpen();
    }
  };

  return (
    <>
      <BackdropLoader openStates={pickupLoading || postloading} />
      
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
          <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />
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
            Items Pick-Up
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
            }}
          >
            Pick up allocated items from storage locations. Scan items or manually select them for pickup.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "white",
            pb: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <ScanOutBoundHeaderDialog
            value={value}
            tableDataSets={storageDataforScan}
            setValue={setValue}
            setMatchedItems={setMatchedItems}
            normalTableData={normalTableData}
            handleClickOpen={handleClickOpen}
            orderId={orderId}
            serialized={serialized}
            orderItems={orderItems}
            setOrderItemId={setOrderItemId}
          />
        </Box>

        {/* <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <SwitchButton
            label="Manual Pickup"
            checked={manualPickup}
            onChange={() => setManualPickup(!manualPickup)}
            color="primary"
          />
        </Box> */}
      </Box>

      <Grid container spacing={3}>
        {isMobile ? (
          <Grid item xs={12} md={4}>
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  mb: 2,
                  pb: 1.5,
                  borderBottom: "2px solid rgba(0, 112, 242, 0.12)",
                  color: theme.palette.text.primary,
                }}
              >
                Items Allocated
              </Typography>

              <MobileCardList
                data={normalTableData}
                headers={[
                  {
                    titleKey: { name: "SKU", value: "sku" },
                  },
                ]}
                columns={[
                  { title: "SKU Name", value: "skuName" },
                  { title: "Allocated", value: "Allocated" },
                  ...(serialized ? [{ title: "Picked", value: "Picked" }] : []),
                  // { title: "Requested", value: "ReqQuantity" },
                ]}
                actions={[]}
              />
            </Box>
          </Grid>
        ) : (
          <Grid item xs={12} md={4}>
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  mb: 2,
                  pb: 1.5,
                  borderBottom: "2px solid rgba(0, 112, 242, 0.12)",
                }}
              >
                Items Allocated
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <MuiTable size="small" aria-label="sku allocation table">
                  <TableHead
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell align="right">Allocated</TableCell>
                      {serialized && (
                        <TableCell align="right">Picked</TableCell>
                      )}
                      <TableCell align="right">Requested</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {normalTableData.map((row: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {row.skuName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {row.sku}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{row.Allocated}</TableCell>
                        {serialized && (
                          <TableCell align="center">{row.Picked}</TableCell>
                        )}
                        <TableCell align="center">{row.ReqQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </Box>
          </Grid>
        )}

        {/* Storage Cards */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {storageData.length > 0 && (
              <Box
                sx={{
                  mb: 2,
                  pb: 1.5,
                  borderBottom: "2px solid rgba(0, 112, 242, 0.12)",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ fontSize: "1rem", color: "text.primary" }}
                >
                  Items Ready to Pickup
                </Typography>
              </Box>
            )}
            {storageData.map((storage: any, idx: number) => (
              <OutboundStorageCard
                key={idx}
                storage={storage}
                serialized={serialized}
                statusColors={statusColors}
                index={idx}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
      {pickedUpData.length > 0 && (
        <Grid item xs={12} md={8}>
          <Box sx={{ mt: 3 }}>
            <OutboundStorageCard
              storage={{
                storageName: "Picked Up Items",
                skuList: pickedUpData,
              }}
              serialized={serialized}
              statusColors={statusColors}
              index={-1}
            />
          </Box>
        </Grid>
      )}
      <ScanDialogPickup
        openItem={openItem}
        handleClose={handleClose}
        matchedItems={matchedItems}
        orderId={orderId}
        // orderItemId={orderItemId}
        serialized={serialized}
        orderItems={orderItems}
        setMatchedItems={setMatchedItems}
      />
    </>
  );
};

export default ItemPickup;
