import DoneIcon from "@mui/icons-material/Done";
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import Button from "../../../../components/common/button/Button";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import {
  useGetPutawayItemsByIdQuery,
  usePatchBinningMutation,
  usePatchCreateGrnMutation,
  usePatchScanItemsBulkMutation,
} from "../../../../store/api/Inbound/inboundApi";
import ScanHeaderDialog from "../scan-headerdialog";
import { Scandialog } from "../putaway-dialogs/scandialog";
import { MoveItemdialog } from "../putaway-dialogs/moveitem-dialog";
import { OpenQrScanner } from "../putaway-dialogs/open-qrscanner-dialog";
import { ScanLocationDialog } from "../putaway-dialogs/scan-location-dialog";
import {
  PutAwaySkuDetails,
  ResponseData,
  StorageData,
  StorageResponse,
  StorageResponseSchema,
} from "../../../../store/api/inbound-validators/inbound.validator";
import { StorageAccordion } from "./putaway-table";
import { ResponseDialog } from "../putaway-dialogs/putaway-response-dialog";
import MapBinLocation from "../putaway-dialogs/mapbin-location";
import { useAppSelector } from "../../../../store/store";
import { displayError } from "../../../../utils/helpers";

type StorageTable = {
  storageId: number;
  storageName: string;
  skuList?: PutAwaySkuDetails[];
};

interface PutawayProps {
  itemID: number;
  serialized: boolean;
  refType: string;
  items?:any;
}

const Putaway: React.FC<PutawayProps> = ({ itemID, serialized, refType ,items}) => {
  const {
    data: putawayItemsState,
    isLoading: loadingPutaway,
    refetch,
  } = useGetPutawayItemsByIdQuery(itemID, {
    refetchOnMountOrArgChange: true,
    skip: !itemID,
  });
  const [patchBinning, { isLoading: postLoading }] = usePatchBinningMutation();
  const [putawayItems, setputawayItems] = useState<StorageResponse>();
  const warehouseId = useAppSelector(
    (State: any) => State.user.selectWareHouse,
  );

  const [value, setValue] = useState<string>("");
  const [openItem, setOpenItem] = useState(false);
  const [moveItem, setMoveItem] = useState(false);
  const [payload, setPayload] = useState<{ ITEM_IDS: number[] }>({
    ITEM_IDS: [],
  });
  const [openMapBin, setOpenMapBin] = useState<boolean>(false);
  const [matchedItems, setMatchedItems] = useState<
    PutAwaySkuDetails | undefined
  >(undefined);

  const [dialogData, setDialogData] = useState({
    warehouseId: null,
    warehouseLocationId: "",
    location: "",
    type: "",
    condition: "",
    assignedCapacity: "",
    maximumCapacity: "",
    receivingStatus: "Open",
  });

  const [tableDataSets, setTableDataSets] = useState<StorageData[]>([]);
  const [qrScanner, setQrScanner] = useState<boolean>(false);
  const [qrStorageName, setStorageName] = useState<string>("");
  const [qrStorageId, setStorageId] = useState<number>();
  // const [status, setStatus] = useState("");
  // const [storage, setStorage] = useState("");
  const [scandialogOpen, setScanDialogOpen] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<ResponseData>();
  const [openResponse, setOpenResponse] = useState<boolean>(false);

  const [rowSelectionMap, setRowSelectionMap] = useState<
    Record<number, Record<string, boolean>>
  >({});
  const [selectedRow, setSelectedRow] = useState<
    (PutAwaySkuDetails & { storageId: number; storageName: string }) | null
  >(null);

  const [patchScanItemsBulk, { isLoading: patchScanItemBulkLoading }] =
    usePatchScanItemsBulkMutation();
  const theme = useTheme();

  const [patchCreateGrn, { isLoading: SubmitGrnLoading }] =
    usePatchCreateGrnMutation();

  useEffect(() => {
    if (!matchedItems) return;
    handleSave();
  }, [matchedItems]);

  useEffect(() => {
    if (!putawayItemsState) return;

    try {
      if (putawayItemsState?.error && warehouseId) {
        const unmapped = putawayItemsState?.error?.unmapped_skus?.[0];
        setDialogData({
          warehouseId: Number(warehouseId),
          materialId: unmapped?.MATERIAL_ID || "",
          VariantCode: unmapped?.VARIANT_CODE || "",
          materialType: unmapped?.MATERIAL_TYPE || "",
          status: unmapped?.STATS,
          highStock: unmapped?.HIGH_STOCK_ALERT,
          lowStock: unmapped?.LOW_STOCK_ALERT,
          VariantId: unmapped?.VARIANT_ID,
        });
        setOpenMapBin(true);
        return;
      }
      const parsed = StorageResponseSchema.parse(putawayItemsState);
      setTableDataSets(parsed.data.putawayItems || []);
      setputawayItems(parsed);
    } catch (err) {
      console.error("Failed to parse putaway items", err);
      setTableDataSets([]);
      setputawayItems(undefined);
    }
  }, [putawayItemsState, warehouseId]);

  const handleUpdateItems = useCallback(
    (updatedItems: PutAwaySkuDetails[]) => {
      setTableDataSets((prev) =>
        prev.map((storage) => ({
          ...storage,
          skuList: storage.skuList.map((sku) => {
            const updated = updatedItems.find(
              (u) => u.vin_number === sku.vin_number,
            );
            return updated ?? sku;
          }),
        })),
      );
    },
    [setTableDataSets, putawayItems, matchedItems],
  );

  useEffect(() => {
    const allSelectedIds = tableDataSets.flatMap(
      (storage, tableIndex) =>
        storage.skuList
          ?.map((item) => {
            const rowId = item.packageListItemId.toString();
            return rowSelectionMap[tableIndex]?.[rowId]
              ? item.packageListItemId
              : null;
          })
          .filter(Boolean) as number[],
    );

    setPayload({ ITEM_IDS: allSelectedIds });
  }, [rowSelectionMap, tableDataSets]);

  const handleVerifyLocation = async (tableIndex: number) => {
    const selectedIds = Object.entries(rowSelectionMap[tableIndex] || {})
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => Number(id));

    if (selectedIds.length === 0) return;

    const payload = { ITEM_IDS: selectedIds };
    await patchScanItemsBulk(payload).unwrap();
    setRowSelectionMap((prev) => ({
      ...prev,
      [tableIndex]: {},
    }));
  };

  const handleClickOpen = () => setOpenItem(true);
  const handleClose = () => setOpenItem(false);
  const handleMoveItem = () => setMoveItem(false);
  const handleCloseQrScanner = () => setQrScanner(false);

  const handleMove = (storageData: StorageData) => {
    if (!selectedRow) return;

    const oldIndex = tableDataSets.findIndex(
      (storage) => storage.storageId === selectedRow.storageId,
    );

    tableDataSets[oldIndex].skuList = tableDataSets[oldIndex]?.skuList?.filter(
      (item) => item.packageListItemId !== selectedRow.packageListItemId,
    );

    const index = tableDataSets.findIndex(
      (storage) => storage.storageId === storageData.storageId,
    );

    if (index === -1) {
      setTableDataSets([...tableDataSets, storageData]);
    } else {
      tableDataSets[index].skuList = [
        ...tableDataSets[index]?.skuList,
        ...storageData.skuList,
      ];
      setTableDataSets([...tableDataSets]);
    }

    setSelectedRow(null);
  };

  const handleCreateGrn = async () => {
    const result = await patchCreateGrn({ ITEM_ID: itemID }).unwrap();
    // Swal.fire({
    //   icon: "success",
    //   title: "GRN Created",
    //   text: `ID: ${result.data.ID}\nGRN No: ${result.data.GRN_NO}\nStatus: ${result.data.GRN_STATUS}`,
    // });
    // setResponseData(`ID: ${result.data.ID}\nGRN No: ${result.data.GRN_NO}\nStatus: ${result.data.GRN_STATUS}`);
    setResponseData({
      type: refType === "MR" ? "LTI" : "GRN",
      data: result.data,
    });

    if (result.data) setOpenResponse(true);
  };

  const handleSave = async () => {
    if (!matchedItems) return;
    try {
      const ITEM_ID = matchedItems.packageListItemId;
      await patchBinning(ITEM_ID).unwrap();

      if (!matchedItems.vin_number && !matchedItems.sku) {
        console.warn("Cannot update item without VIN or SKU");
        return;
      }
      const updated = [{ ...matchedItems, locationStatus: "Placed" }];
      handleUpdateItems(updated);
      // handleClose();
      handleClickOpen();
      setValue("");
      // setMatchedItems("");
    } catch (err) {
      displayError(err);
    }
  };

  const flattenedTableDataSets = useMemo(() => {
    if (!tableDataSets?.length) return [];

    return tableDataSets.flatMap((storage: any) =>
      storage?.skuList?.map((sku: any) => ({
        ...sku,
        STORAGE_ID: storage.STORAGE_ID,
        STORAGE_NAME: storage.STORAGE_NAME,
      })),
    );
  }, [tableDataSets]);

const hasItems = tableDataSets.length > 0;

const allItemsReceived =
  hasItems &&
  tableDataSets.every((storage) =>
    storage.skuList.every((item) => item.itemStatus?.toLowerCase() === "received",
    )
  );
  // console.log("refType", refType);

  const showScanDialog = hasItems && !allItemsReceived;

  return (
    <Box>
      <BackdropLoader
        openStates={
          loadingPutaway ||
          patchScanItemBulkLoading ||
          SubmitGrnLoading ||
          postLoading
        }
      />
      {showScanDialog && (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "white",
            mb: 2,
            pb: 2,
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <ScanHeaderDialog
            value={value}
            tableDataSets={flattenedTableDataSets ?? []}
            setValue={setValue}
            setMatchedItems={setMatchedItems}
            handleSave={handleSave}
            serialized={serialized}
          />
        </Box>
      )}
      
      {/* Items Ready to Place Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{
            mb: 2,
            pb: 1.5,
            borderBottom: "2px solid rgba(0, 112, 242, 0.12)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1rem",
              color: "text.primary",
            }}
          >
            Items Ready to Place
          </Typography>
          <Chip
            label={items?.[2]?.value ?? 0}
            size="small"
            sx={{
              backgroundColor: "rgba(0, 112, 242, 0.1)",
              color: "primary.main",
              fontWeight: 600,
              border: "1px solid rgba(0, 112, 242, 0.2)",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tableDataSets?.map((storage: any, index) => (
            <StorageAccordion
              key={storage.storageId ?? index}
              tableIndex={index}
              storage={storage}
              serialized={serialized}
              payloadItemIdsLength={payload.ITEM_IDS.length}
              themeMode={theme}
              handleVerifyLocation={handleVerifyLocation}
              setQrScanner={setQrScanner}
              setStorageName={setStorageName}
              setStorageId={setStorageId}
              setMoveItem={setMoveItem}
              setSelectedRow={setSelectedRow}
              rowSelectionMap={rowSelectionMap}
              setRowSelectionMap={setRowSelectionMap}
              setScanDialogOpen={setScanDialogOpen}
              enableRowSelection={true}
              enableSelectAll={true}
            />
          ))}
        </Box>
      </Box>

      {/* Items Placed Section */}
      {putawayItems?.data.placedItems && putawayItems.data.placedItems.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              mb: 2,
              pb: 1.5,
              borderBottom: "2px solid rgba(0, 112, 242, 0.12)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "text.primary",
              }}
            >
              Items Placed
            </Typography>
            <Chip
              label={items?.[0]?.value ?? 0}
              size="small"
              sx={{
                backgroundColor: "rgba(0, 112, 242, 0.1)",
                color: "primary.main",
                fontWeight: 600,
                border: "1px solid rgba(0, 112, 242, 0.2)",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {putawayItems.data.placedItems.map((storage, index) => (
              <StorageAccordion
                key={`placed-${storage.storageId}-${index}`}
                tableIndex={0}
                storage={storage}
                serialized={serialized}
                payloadItemIdsLength={0}
                themeMode={theme}
                handleVerifyLocation={() => {}}
                setQrScanner={() => {}}
                setStorageName={() => {}}
                setStorageId={() => {}}
                setMoveItem={() => {}}
                setSelectedRow={() => {}}
                rowSelectionMap={{}}
                setRowSelectionMap={() => {}}
                enableRowSelection={false}
                refType={refType}
                enableSelectAll={false}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Create GRN/LTI Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pt: 3,
          mt: 3,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Button
          data-testid="submit-btn"
          id="submit-btn"
          label={refType === "MR" ? "Create LTI" : "Create GRN"}
          startIcon={<DoneIcon />}
          onClick={handleCreateGrn}
          disabled={
            !putawayItems?.data?.placedItems ||
            putawayItems.data.placedItems.length === 0 ||
            putawayItems.data?.placedItems[0]?.skuList[0].grn_no
          }
        />
      </Box>

      {/* Dialogs */}
      <Scandialog // in use
        openItem={openItem}
        handleClose={handleClose}
        matchedItems={matchedItems}
        setvalue={setValue}
        updateItems={handleUpdateItems}
        serialized={serialized}
        setMatchedItems={setMatchedItems}
      />
      <ScanLocationDialog // in use
        open={scandialogOpen}
        onOpenChange={setScanDialogOpen}
        onQrScannerChange={setQrScanner}
        qrStorageName={qrStorageName ?? null}
      />
      <ResponseDialog // in use
        open={openResponse}
        setOpenResponse={setOpenResponse}
        data={responseData}
      />

      <MapBinLocation // in use
        open={openMapBin}
        onClose={() => setOpenMapBin(false)}
        data={dialogData}
        message={putawayItemsState}
        onSuccess={refetch}
      />

      <MoveItemdialog // not in use
        moveItem={moveItem}
        handleMoveItem={handleMoveItem}
        selectedRow={selectedRow}
        onMove={handleMove}
      />
      <OpenQrScanner // in use
        qrScanner={qrScanner}
        handleCloseQrScanner={handleCloseQrScanner}
        qrStorageName={qrStorageName}
        onOpenChange={setScanDialogOpen}
        locationId={qrStorageId ?? null}
        setResponseData={setResponseData}
        setOpenResponse={setOpenResponse}
      />
    </Box>
  );
};

export default Putaway;
