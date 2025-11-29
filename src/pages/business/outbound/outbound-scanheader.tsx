import KeyboardIcon from "@mui/icons-material/Keyboard";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState, useRef, useEffect } from "react";
import SwitchButton from "../../../components/common/button/ToggleButton";
import Button from "../../../components/common/button/Button";
import {
  SkuItem,
  StorageData,
} from "../../../store/api/outbound-validators/outbound.validator";
import { usePostPickUpItemsMutation } from "../../../store/api/outbound/api";
import Swal from "sweetalert2";
import useIsMobile from "../../../themes/useIsMobile";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import warnImg from "../../../assets/images/common/itemAlreadyScanned.png";

interface ScanHeaderDialogProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  tableDataSets: StorageData[] | undefined;
  setMatchedItems: React.Dispatch<React.SetStateAction<SkuItem | undefined>>;
  handleClickOpen: () => void;
  serialized?: boolean;
  orderId: number;
  normalTableData: any;
  setOrderItemId: Function;
  orderItems: any;
}

const ScanOutBoundHeaderDialog: React.FC<ScanHeaderDialogProps> = ({
  value,
  tableDataSets,
  setValue,
  setMatchedItems,
  handleClickOpen,
  serialized,
  orderId,
  normalTableData,
  orderItems,
  setOrderItemId,
}) => {
  const [isScanMode, setIsScanMode] = useState(true);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  // Separate popups
  const [openTypeModePopup, setOpenTypeModePopup] = useState(false);
  const [openWarningPopup, setOpenWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [newvalue, setNewValue] = useState<string>("");
  // const [orderItems,setOrderItemId] = useState<any>();
  // Track scanned items
  const [scannedItems, setScannedItems] = useState<string[]>([]);

  const handleCloseTypeModePopup = () => setOpenTypeModePopup(false);
  const [patchPickUpItems, { isLoading: fifoLoading }] =
    usePostPickUpItemsMutation();

  let lastKeyTime = 0;
  let scanTimer: NodeJS.Timeout | null = null;

  const handleSave = async () => {
    const body = {
      orderId: orderId,
      values: [
        {
          vin: newvalue,
        },
      ],
    };

    const res = await patchPickUpItems(body);
    setValue("");
    if (res.error) {
      Swal.fire({
        text: res.error.data?.error?.message,
        icon: "error",
        title: "Failed",
      });
      return;
    }

    Swal.fire({
      text: "New Item has been compromised",
      icon: "success",
      title: "FIFO Compromised",
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isScanMode, tableDataSets]);

  const normalizeItem = (items: StorageData[]): SkuItem[] => {
    return items.flatMap((item) => item.skuList);
  };

  const normalizedTableDataSets: SkuItem[] = useMemo(() => {
    return tableDataSets ? normalizeItem(tableDataSets as StorageData[]) : [];
  }, [tableDataSets]);

  const handleScan = (inputValue: string) => {
    const allItems = normalizedTableDataSets;

    const matchedItem = allItems.find((item) =>
      serialized
        ? item.vin_number?.toLowerCase() === inputValue.toLowerCase()
        : item.sku?.toLowerCase() === inputValue.toLowerCase(),
    );

    const matchingOrderItem = normalTableData?.find(
      (item: any) =>
        item.sku?.toLowerCase() === matchedItem?.sku?.toLowerCase(),
    );

    const orderItemId =
      matchingOrderItem?.orderItemId || matchedItem?.orderItemId;

    const AllocatedQTY = matchingOrderItem?.Allocated;
    if (!matchedItem && serialized) {
      setWarningMessage(
        "Item not found. Do you want to proceed with FIFO Compromise?",
      );
      setOpenWarningPopup(true);
      setNewValue(inputValue);
      return;
    }

    if (matchedItem.storage?.toLowerCase().includes("pickedup")) {
      Swal.fire({
        icon: "warning",
        title: "Already Picked Up",
        text: "This item has already been picked up. Please verify.",
        confirmButtonText: "OK",
      });
      return;
    }

    const itemKey = matchedItem?.vin_number || matchedItem?.sku;
    if (scannedItems.includes(itemKey)) {
      setWarningMessage("Item already scanned.");
      setOpenWarningPopup(true);
      return;
    }

    setScannedItems((prev) => [...prev, itemKey]);
    setMatchedItems(matchedItem);

    setOrderItemId({
      ...matchedItem,
      orderItemId: orderItemId,
      allocatedQty: AllocatedQTY,
    });
  };

  const handleEnter = () => {
    const inputValue = value.trim();
    if (!inputValue) return;
    handleScan(inputValue);
    setNewValue(inputValue);
    setValue("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <>
      <BackdropLoader openStates={fifoLoading} />
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.primary.lighter,
        }}
      >
        {isMobile ? (
          <>
            <Box
              display="flex"
              justifyContent={"center"}
              gap={2}
              width="100%"
              mb={1}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <QrCodeScannerIcon
                  fontSize="small"
                  sx={{ color: isScanMode ? "primary.main" : "text.secondary" }}
                />
                <Typography
                  sx={{
                    fontWeight: isScanMode ? "bold" : "normal",
                    color: isScanMode ? "primary.main" : "text.secondary",
                  }}
                >
                  Scan
                </Typography>
              </Box>

              <SwitchButton
                label=""
                id="toggle-scan-type"
                checked={!isScanMode}
                color="secondary"
                size="small"
                onChange={() => setIsScanMode(!isScanMode)}
              />

              <Box display="flex" alignItems="center" gap={0.5}>
                <KeyboardIcon
                  fontSize="small"
                  sx={{
                    color: !isScanMode ? "primary.main" : "text.secondary",
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: !isScanMode ? "bold" : "normal",
                    color: !isScanMode ? "primary.main" : "text.secondary",
                  }}
                >
                  Type
                </Typography>
              </Box>
            </Box>

            <Box display="flex" width="100%" gap={1}>
              <TextField
                inputRef={inputRef}
                value={value}
                id="sku-input"
                placeholder={
                  isScanMode ? "Scan SKU or Item Code" : "Type SKU or Item Code"
                }
                variant="outlined"
                fullWidth
                autoFocus
                onChange={(e) => {
                  const text = e.target.value;
                  const now = Date.now();
                  lastKeyTime = now;

                  if (isScanMode) {
                    if (scanTimer) clearTimeout(scanTimer);
                    scanTimer = setTimeout(() => {
                      if (text.length > 3) {
                        handleScan(text);
                        setValue("");
                      }
                    }, 300);
                  }

                  setValue(text);
                }}
                onKeyDown={(e) => {
                  if (isScanMode) {
                    const isManualTyping = /^[a-zA-Z0-9]$/.test(e.key);
                    if (isManualTyping && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      setOpenTypeModePopup(true);
                    }
                  } else {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEnter();
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedValue = e.clipboardData.getData("text").trim();
                  if (!pastedValue) return;

                  if (isScanMode) {
                    handleScan(pastedValue);
                    
                  } else {
                    setValue(pastedValue);
                  }
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                sx={{
                  backgroundColor: (theme) => theme.palette.background.paper,
                  "& .MuiOutlinedInput-root": {
                    height: "36px",
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-input": { padding: "6px 8px" },
                }}
              />

              {!isScanMode && (
                <Button
                  label="Enter"
                  onClick={handleEnter}
                  sx={{
                    minWidth: "70px",
                    height: "36px",
                    fontSize: "14px",
                    padding: "4px 12px",
                    textTransform: "none",
                  }}
                />
              )}
            </Box>
          </>
        ) : (
          <Grid container alignItems="center" spacing={2} wrap="wrap">
            <Grid item>
              <Box display="flex" alignItems="center" gap={1}>
                <QrCodeScannerIcon
                  fontSize="small"
                  sx={{ color: isScanMode ? "primary.main" : "text.secondary" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isScanMode ? "bold" : "normal",
                    color: isScanMode ? "primary.main" : "text.secondary",
                  }}
                >
                  Scan
                </Typography>
              </Box>
            </Grid>

            <Grid item>
              <SwitchButton
                label=""
                id="toggle-scan-type"
                checked={!isScanMode}
                color="secondary"
                size="small"
                onChange={() => setIsScanMode(!isScanMode)}
              />
            </Grid>

            <Grid item>
              <Box display="flex" alignItems="center" gap={1}>
                <KeyboardIcon
                  fontSize="small"
                  sx={{
                    color: !isScanMode ? "primary.main" : "text.secondary",
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: !isScanMode ? "bold" : "normal",
                    color: !isScanMode ? "primary.main" : "text.secondary",
                  }}
                >
                  Type
                </Typography>
              </Box>
            </Grid>

            <Grid item xs>
              <TextField
                inputRef={inputRef}
                value={value}
                id="sku-input"
                placeholder={
                  isScanMode ? "Scan SKU or Item Code" : "Type SKU or Item Code"
                }
                variant="outlined"
                fullWidth
                autoFocus
                onChange={(e) => {
                  const text = e.target.value;
                  const now = Date.now();
                  lastKeyTime = now;

                  if (isScanMode) {
                    if (scanTimer) clearTimeout(scanTimer);
                    scanTimer = setTimeout(() => {
                      if (text.length > 3) {
                        handleScan(text);
                        setValue("");
                      }
                    }, 300);
                  }

                  setValue(text);
                }}
                onKeyDown={(e) => {
                  if (isScanMode) {
                    const isManualTyping = /^[a-zA-Z0-9]$/.test(e.key);
                    if (isManualTyping && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                      setOpenTypeModePopup(true);
                    }
                  } else {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleEnter();
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedValue = e.clipboardData.getData("text").trim();
                  if (!pastedValue) return;

                  if (isScanMode) {
                    handleScan(pastedValue);
                    // setValue("");
                  } else {
                    setValue(pastedValue);
                  }
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
                sx={{
                  backgroundColor: (theme) => theme.palette.background.paper,
                  "& .MuiOutlinedInput-root": {
                    height: "36px",
                    fontSize: "14px",
                  },
                  "& .MuiOutlinedInput-input": { padding: "6px 8px" },
                }}
              />
            </Grid>

            {!isScanMode && (
              <Grid item>
                <Button
                  label="Enter"
                  onClick={handleEnter}
                  sx={{
                    minWidth: "70px",
                    height: "36px",
                    fontSize: "14px",
                    padding: "4px 12px",
                    textTransform: "none",
                  }}
                />
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      <Dialog open={openTypeModePopup} onClose={handleCloseTypeModePopup}>
        <DialogTitle>Type Mode Required</DialogTitle>
        <DialogContent>
          <Typography>
            Please use typing and press Enter in <b>Type Mode</b>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            label="OK"
            onClick={handleCloseTypeModePopup}
            variant="contained"
          />
        </DialogActions>
      </Dialog>

      <Dialog
        open={openWarningPopup}
        onClose={() => setOpenWarningPopup(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 340,
            textAlign: "center",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2,
          }}
        >
          <Box
            component="img"
            src={warnImg} 
            alt="Warning"
            sx={{ width: 80, height: 80, objectFit: "contain", mb: 2 }}
          />

          <Typography sx={{ color: "text.primary" }}>
            {warningMessage}
          </Typography>
        </DialogContent>
        <Box
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#ddd",
            my: 1,
          }}
        />
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          {warningMessage.toLowerCase().includes("fifo") ? (
            <>
              <Button
                label="No"
                onClick={() => setOpenWarningPopup(false)}
                variant="outlined"
                color="secondary"
              />
              <Button
                label="Yes"
                onClick={() => {
                  handleSave();
                  setOpenWarningPopup(false);
                }}
                variant="contained"
                color="warning"
                sx={{ color: "white" }}
              />
            </>
          ) : (
            <Button
              label="OK"
              onClick={() => setOpenWarningPopup(false)}
              variant="contained"
              color="warning"
              sx={{ color: "white", minWidth: 100 }}
            />
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScanOutBoundHeaderDialog;
