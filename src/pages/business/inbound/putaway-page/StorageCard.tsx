import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Divider,
  useTheme,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DoneIcon from "@mui/icons-material/Done";
import InventoryIcon from "@mui/icons-material/Inventory";

import Button from "../../../../components/common/button/Button";
import { Table, Cell } from "../../../../components/common/table";
import { PutAwaySkuDetails } from "../../../../store/api/inbound-validators/inbound.validator";
import MobileCardList from "../../../../components/common/mobile-components/mobile-cardlist";
import useIsMobile from "../../../../themes/useIsMobile";

type StorageTable = {
  storageId: number;
  storageName: string;
  skuList?: PutAwaySkuDetails[];
};

interface StorageCardProps {
  storage: StorageTable;
  serialized: boolean;
  payloadItemIdsLength: number;
  themeMode?: any;
  handleVerifyLocation: (tableIndex: number) => void;
  setQrScanner: (val: boolean) => void;
  setStorageName: (name: string) => void;
  setStorageId: (id?: number) => void;
  setMoveItem: (val: boolean) => void;
  setSelectedRow: (
    row: PutAwaySkuDetails & { storageId: number; storageName: string },
  ) => void;
  rowSelectionMap: Record<number, Record<string, boolean>>;
  setRowSelectionMap: React.Dispatch<
    React.SetStateAction<Record<number, Record<string, boolean>>>
  >;
  tableIndex: number;
  enableRowSelection?: boolean;
  setScanDialogOpen?: (val: boolean) => void;
  refType?: string;
  enableSelectAll?: boolean;
}

const StorageCard: React.FC<StorageCardProps> = ({
  storage,
  serialized,
  handleVerifyLocation,
  setStorageName,
  setStorageId,
  setScanDialogOpen,
  rowSelectionMap,
  setRowSelectionMap,
  tableIndex,
  enableRowSelection = true,
  refType,
  enableSelectAll,
  themeMode,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const skuList = Array.isArray(storage?.skuList) ? storage.skuList : [];
  const allReceived = skuList.every(
    (item) => (item?.itemStatus ?? "").toString().toUpperCase() === "RECEIVED",
  );
  const isMobile = useIsMobile();

  const selectedCount = Object.values(rowSelectionMap[tableIndex] || {}).filter(
    Boolean,
  ).length;

  const placedCount = skuList.filter(
    (item) => item.locationStatus?.toLowerCase() === "placed",
  ).length;

  const receivedCount = skuList.filter(
    (item) => item.itemStatus?.toLowerCase() === "received",
  ).length;

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease-in-out",
          overflow: "hidden",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.12)",
            borderColor: "rgba(0, 112, 242, 0.2)",
          },
        }}
      >
      {/* Card Header */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: "rgba(0, 112, 242, 0.02)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 1.5,
              backgroundColor: "rgba(0, 112, 242, 0.1)",
              color: "primary.main",
            }}
          >
            <InventoryIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1.125rem",
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {storage.storageName}
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={`${skuList.length} Items`}
                size="small"
                sx={{
                  backgroundColor: "rgba(0, 112, 242, 0.08)",
                  color: "primary.main",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  height: 24,
                }}
              />
              {placedCount > 0 && (
                <Chip
                  label={`${placedCount} Placed`}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.success.light + "20",
                    color: theme.palette.success.dark,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              )}
              {receivedCount > 0 && (
                <Chip
                  label={`${receivedCount} Received`}
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.warning.light + "20",
                    color: theme.palette.warning.dark,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: 24,
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {allReceived && skuList.length > 0 && (
            <Tooltip title="All items must be received before scanning" arrow>
              <span>
                <Button
                  label="Scan Location"
                  startIcon={<QrCodeScannerIcon />}
                  onClick={() => {
                    setScanDialogOpen?.(true);
                    setStorageName(storage.storageName);
                    setStorageId(storage.storageId);
                  }}
                  disabled={!allReceived}
                  sx={{ minWidth: 140 }}
                />
              </span>
            </Tooltip>
          )}
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Card Content */}
      <Collapse in={expanded} timeout="auto">
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            {selectedCount > 0 && (
              <Box sx={{ mb: 2 }}>
                <Button
                  label={`Verify Location (${selectedCount})`}
                  startIcon={<DoneIcon />}
                  onClick={() => handleVerifyLocation(tableIndex)}
                />
              </Box>
            )}

            {isMobile ? (
              <MobileCardList<PutAwaySkuDetails>
                data={skuList}
                enableRowSelection={true}
                enableSelectAll={enableSelectAll}
                isRowSelectable={(row) =>
                  row.itemStatus?.toLowerCase() !== "received"
                }
                getRowId={(row) => row.packageListItemId.toString()}
                rowSelection={rowSelectionMap[tableIndex]}
                onRowSelectionChange={(newSel) => {
                  setRowSelectionMap((prev) => {
                    const oldState = prev[tableIndex] ?? {};
                    const nextState =
                      typeof newSel === "function" ? newSel(oldState) : newSel;
                    return {
                      ...prev,
                      [tableIndex]: nextState,
                    };
                  });
                }}
                headers={[
                  {
                    titleKey: { name: "SKU Code", value: "sku" },
                    datakey: [{ name: "VIN ", value: "vin_number" }],
                    statusKey: "locationStatus",
                    renderStatus: (status) => {
                      const lower = status?.toLowerCase();
                      const color =
                        lower === "placed"
                          ? theme.palette.success.light
                          : lower === "received"
                            ? theme.palette.warning.light
                            : theme.palette.error.light;

                      return (
                        <Chip
                          label={status}
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
                columns={[
                  serialized
                    ? { title: "SKU ", value: "skuName" }
                    : { title: "Quantity", value: "quantity" },
                  { title: "UOM", value: "uom" },
                  {
                    title: "Item Status",
                    value: "itemStatus",
                    render: (item: any) => {
                      const s = item.itemStatus?.toLowerCase();
                      const color =
                        s === "placed"
                          ? theme.palette.success.light
                          : s === "received"
                            ? theme.palette.warning.light
                            : theme.palette.error.light;

                      return (
                        <Chip
                          label={item.itemStatus}
                          size="small"
                          sx={{
                            backgroundColor: color,
                            color: "#fff",
                            fontWeight: 300,
                            height: 22,
                            fontSize: "10px",
                            padding: "0 3px",
                          }}
                        />
                      );
                    },
                  },
                  skuList[0]?.grn_no && {
                    title: "GRN Status",
                    value: "grn_status",
                  },
                  skuList[0]?.grn_no && {
                    title: "GRN Number",
                    value: "grn_no",
                  },
                ].filter(Boolean)}
              />
            ) : (
              <Table<PutAwaySkuDetails>
                data={skuList}
                enableRowSelection={
                  enableRowSelection
                    ? (row) =>
                        row.itemStatus?.toLowerCase() !== "received"
                    : false
                }
                getRowId={(row) => row.packageListItemId.toString()}
                state={{ rowSelection: rowSelectionMap[tableIndex] ?? {} }}
                onRowSelectionChange={(updaterOrValue) => {
                  setRowSelectionMap((prev) => {
                    const oldState = prev[tableIndex] ?? {};
                    const newSelection =
                      typeof updaterOrValue === "function"
                        ? updaterOrValue(oldState)
                        : updaterOrValue;
                    return {
                      ...prev,
                      [tableIndex]: newSelection,
                    };
                  });
                }}
              >
                <Cell type="text" title="SKU Name" value="skuName" />
                <Cell type="text" title="SKU code" value="sku" />
                {serialized ? (
                  <Cell type="text" title="VIN" value="vin_number" />
                ) : (
                  <Cell type="text" title="Quantity" value="quantity" />
                )}
                <Cell type="text" title="UOM" value="uom" />

                <Cell<PutAwaySkuDetails>
                  type="custom"
                  title="Item Status"
                  render={(cell) => {
                    const { itemStatus } = cell.row.original;
                    const Placed =
                      (itemStatus ?? "").toString().toLowerCase() === "placed";
                    const recived =
                      (itemStatus ?? "").toString().toLowerCase() ===
                      "received";
                    return (
                      <Chip
                        label={itemStatus}
                        size="small"
                        variant="outlined"
                        sx={{
                          backgroundColor: Placed
                            ? theme.palette.success.light
                            : recived
                              ? theme.palette.warning.light
                              : theme.palette.error.light,
                          color: theme.palette.common.white,
                          fontSize: "12px",
                          height: "24px",
                        }}
                      />
                    );
                  }}
                />

                <Cell<PutAwaySkuDetails>
                  type="custom"
                  title="Location Status"
                  render={(cell) => {
                    const rowData = cell.row.original;
                    const { locationStatus } = rowData;

                    return (
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={locationStatus}
                          size="small"
                          variant="outlined"
                          sx={{
                            backgroundColor:
                              (locationStatus ?? "").toLowerCase() ===
                              "not-placed"
                                ? theme.palette.error.light
                                : theme.palette.success.light,
                            color: theme.palette.common.white,
                            fontSize: "12px",
                            height: "24px",
                          }}
                        />
                      </Box>
                    );
                  }}
                />

                {skuList[0]?.grn_no &&
                  (refType === "MR" ? (
                    <Cell type="text" title="LTI Status" value="grn_status" />
                  ) : (
                    <Cell type="text" title="GRN Status" value="grn_status" />
                  ))}
                {skuList[0]?.grn_no &&
                  (refType === "MR" ? (
                    <Cell type="text" title="LTI Number" value="grn_no" />
                  ) : (
                    <Cell type="text" title="GRN Number" value="grn_no" />
                  ))}
              </Table>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
    </Box>
  );
};

export default StorageCard;

