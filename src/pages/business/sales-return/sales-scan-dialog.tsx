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
import { useState, useRef, useEffect } from "react";
import SwitchButton from "../../../components/common/button/ToggleButton";
import Button from "../../../components/common/button/Button";
import { useLazyGetFetchScanerQuery } from "../../../store/api/sales-return/salesReturnApi";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import useIsMobile from "../../../themes/useIsMobile";
import { displayError } from "../../../utils/helpers";

interface SalesScanHeaderDialogProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setScannedData: React.Dispatch<React.SetStateAction<any[]>>;
  setScanInputval: Function;
  //   handleClickOpen:() => void;
}

const SalesScanHeaderDialog: React.FC<SalesScanHeaderDialogProps> = ({
  value,
  setValue,
  setScannedData,
  setScanInputval,
  //   handleClickOpen,
}) => {
  const [isScanMode, setIsScanMode] = useState(true);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  // Dialogs
  const [openTypeModePopup, setOpenTypeModePopup] = useState(false);

  // RTK Query lazy API call
  const [fetchScaner, { isFetching }] = useLazyGetFetchScanerQuery();

  const handleCloseTypeModePopup = () => setOpenTypeModePopup(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isScanMode]);

  const handleScan = async (inputValue: string) => {
    try {
      if (!inputValue) return;

      const response = await fetchScaner(inputValue).unwrap();

      setScannedData(response || []);

      setValue("");
      //   handleClickOpen();
      setTimeout(() => inputRef.current?.focus(), 0);
    } catch (error: any) {
      displayError(error);
      console.error("Scan API error:", error);
    }
  };

  const handleEnter = () => {
    const inputValue = value.trim();
    if (!inputValue) return;
    handleScan(inputValue);
  };
  let lastKeyTime = 0;
  let scanTimer: NodeJS.Timeout | null = null;

  return (
    <>
      <BackdropLoader openStates={isFetching} />
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
            {/* Scan Mode */}
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

            {/* Toggle */}
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

            {/* Type Mode */}
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

            {/* Input Field */}
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

            {/* Enter Button (Type Mode only) */}
            {!isScanMode && (
              <Grid item>
                <Button
                  label={isFetching ? "Loading..." : "Enter"}
                  onClick={handleEnter}
                  disabled={isFetching}
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

      {/* Popup for Wrong Mode */}
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
    </>
  );
};

export default SalesScanHeaderDialog;
