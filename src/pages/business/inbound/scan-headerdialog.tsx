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
import { PutAwaySkuDetails } from "../../../store/api/inbound-validators/inbound.validator";
import { normalizeItem, RawSkuItem } from "../../../utils/NormalizedFormatter";
import useIsMobile from "../../../themes/useIsMobile";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import warnImg from "../../../assets/images/common/itemAlreadyScanned.png";

interface ScanHeaderDialogProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  tableDataSets: PutAwaySkuDetails[] | undefined;
  setMatchedItems: React.Dispatch<
    React.SetStateAction<PutAwaySkuDetails | undefined>
  >;
  handleSave: Function;
  serialized?: boolean;
  flag?: string;
}

const ScanHeaderDialog: React.FC<ScanHeaderDialogProps> = ({
  value,
  tableDataSets,
  setValue,
  setMatchedItems,
  handleSave,
  serialized,
  flag,
}) => {
  const [isScanMode, setIsScanMode] = useState(true);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  // Separate popups
  const [openTypeModePopup, setOpenTypeModePopup] = useState(false);
  const [openWarningPopup, setOpenWarningPopup] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Track scanned items
  const [scannedItems, setScannedItems] = useState<string[]>([]);

  const handleCloseTypeModePopup = () => setOpenTypeModePopup(false);
  const handleCloseWarningPopup = () => setOpenWarningPopup(false);
  let scanTimer: NodeJS.Timeout | null = null;
  let lastKeyTime = 0;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanMode, tableDataSets]);

  const normalizedTableDataSets: PutAwaySkuDetails[] = useMemo(() => {
    return tableDataSets
      ? tableDataSets.map((item) => normalizeItem(item as RawSkuItem))
      : [];
  }, [tableDataSets]);

  const handleScan = (inputValue: string) => {
    const allItems = normalizedTableDataSets;
    const matchedItem = allItems.find((item) =>
      serialized
        ? item.vin_number?.toLowerCase() === inputValue.toLowerCase()
        : item.sku?.toLowerCase() === inputValue.toLowerCase(),
    );

    if (!matchedItem) {
      setWarningMessage("The Selected Item/SKU not found");
      setOpenWarningPopup(true);
      return;
    }

    const itemKey = matchedItem?.vin_number || matchedItem?.sku;
    if (scannedItems?.includes(itemKey) && flag !== "Inspectiondata") {
      setWarningMessage("The Selected Item/SKU has been already scanned");
      setOpenWarningPopup(true);
      return;
    }
    setScannedItems((prev) => [...prev, itemKey]);
    setMatchedItems(matchedItem);
    // handleSave();
  };

  const handleEnter = () => {
    const inputValue = value.trim();
    if (!inputValue) return;

    handleScan(inputValue);
    setValue("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  useEffect(() => {
    if (isScanMode) {
      document.getElementById("scanInput")?.focus();
    }
  }, [isScanMode]);
  const isMobile = useIsMobile();
  return (
    <>
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
                placeholder={isScanMode ? "Scan / Paste SKU" : "Type SKU"}
                variant="outlined"
                fullWidth
                autoFocus
                inputProps={{ inputMode: "none" }}
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
                    setValue("");
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
                placeholder={isScanMode ? "Scan / Paste SKU" : "Type SKU"}
                variant="outlined"
                fullWidth
                autoFocus
                inputProps={{ inputMode: "none" }}
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
                    setValue("");
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
        onClose={handleCloseWarningPopup}
        PaperProps={{
          sx: { borderRadius: 2, width: "360px", },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pt: 3,
          }}
        >
          <Box
            component="img"
            src={warnImg}
            alt="Warning"
            sx={{ width: 80, height: 80, mb: 2, objectFit: "contain", }}
          />
          <Typography variant="body1" sx={{ color: "#5d4037" }}>
            {warningMessage}
          </Typography>
        </DialogContent>
        <Box
          sx={{
            width: "100%",
            height: "1px",
            backgroundColor: "#ddd",
          }}
        />
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            label="Close"
            onClick={handleCloseWarningPopup}
            variant="contained"
            color="primary"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScanHeaderDialog;
