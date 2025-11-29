import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

import Button from "../../../../components/common/button/Button";
import dummy_qr_image from "../../../../assets/images/common/dummy_qr_image.png";
import scanLocation from "../../../../assets/images/common/scanLocation.png"
type ScanLocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQrScannerChange: (value: boolean) => void;
  qrStorageName: string;
};

export const ScanLocationDialog: React.FC<ScanLocationDialogProps> = ({
  open,
  onOpenChange,
  onQrScannerChange,
  qrStorageName,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleCheck = () => {
    if (
      inputValue.trim().toLowerCase() === qrStorageName.trim().toLowerCase()
    ) {
      setError("");
      onQrScannerChange(true);
      onOpenChange(false);
    } else {
      setError("Incorrect location. Please rescan.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
       sx={{
          m: 0,
          p: 2,
          position: "relative",
          height:80
        }}
        alignContent="center"
        >
        <Typography
          variant="h4"
          // align="center"
          sx={{ fontWeight: 500, color: "text.secondary" }}
        >
          Scan Location
        </Typography>
        <img
          src={scanLocation}
          alt="Verification"
          style={{
            position: "absolute",
            right: 0,
            top: -10,
            width: 132,
            height: 90,
            opacity: 1,
            pointerEvents: "none",
            zIndex:0
          }}
        />
      </DialogTitle>

      <DialogContent  dividers>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          py={3}
        >
          <Box
            border="2px solid"
            borderColor="grey.300"
            borderRadius={3}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Grid
              item
              // onClick={() => {
              //   onQrScannerChange(true);
              //   onOpenChange(false);
              // }}
              sx={{ cursor: "pointer", display: "inline-block" }}
            >
              <Box
                component="img"
                id="scan-qr-img"
                data-testid="scan-qr-img"
                src={dummy_qr_image}
                alt="QR Code for location scanning"
                sx={{ width: 128, height: 128, objectFit: "contain" }}
              />
            </Grid>
          </Box>

          <TextField
            label="Enter Location Name"
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            error={!!error}
            helperText={error}
          />

          <Box display="flex" justifyContent="flex-end" gap={2} width="100%">
            <Button label="Check" onClick={handleCheck} />
            <Button label="Close" onClick={() => onOpenChange(false)} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
