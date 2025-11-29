import StorageHierarchyImages from "../../../assets/images/storage-hierarchy";
import Button from "../../../components/common/button/Button";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { displayError } from "../../../utils/helpers";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  DialogTitle,
} from "@mui/material";
import React from "react";

type OpenQrProps = {
  qrScanner: boolean;
  handleCloseQrScanner: () => void;
  scandata: any;
  onOpenChange: (open: boolean) => void;
};

export const SalesreturnDialog: React.FC<OpenQrProps> = ({
  qrScanner,
  handleCloseQrScanner,
  scandata,
  onOpenChange,
}) => {
  const handlePostPutaway = async (locationId: number | null) => {
    if (!locationId) return;

    try {
      //  await postPutAwayItems(locationId).unwrap();
      handleCloseQrScanner();
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <>
      {/* <BackdropLoader openStates={isLoading} /> */}
      <Dialog
        onClose={handleCloseQrScanner}
        aria-labelledby="mui-dialog-title"
        open={qrScanner}
        fullWidth
        maxWidth="xs"
      >
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <DialogTitle>PutAway</DialogTitle>
        </DialogActions>
        <DialogContent dividers>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            bgcolor="#FFF8DC"
            borderRadius={1}
            p={1.5}
            mb={2}
          >
            <Box flex="0 0 70%" display="flex" flexDirection="column" gap={0.5}>
              <Typography fontWeight={600} variant="subtitle1">
                {scandata?.Storagename || "Unknown Location"}
              </Typography>
              <Chip
                label={scandata?.level || "Bin"}
                color="primary"
                sx={{ mt: 0.5, width: "30%" }}
              />
            </Box>

            <Box
              flex="0 0 30%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                component="img"
                src={StorageHierarchyImages.bin}
                alt="Storage hierarchy"
                sx={{
                  width: "100%",
                  maxWidth: 60,
                  height: "auto",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>

          <Box mb={1}>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              gutterBottom
            >
              {scandata?.serialized ? "VIN Number" : "Quantity"}
            </Typography>
            <Typography fontWeight={600} variant="body1">
              {scandata?.serialized ? scandata?.VIN_NUMBER : scandata?.Quantity}
            </Typography>
          </Box>

          <Box mb={1}>
            <Typography
              variant="caption"
              color="textSecondary"
              display="block"
              gutterBottom
            >
              SKU
            </Typography>
            <Typography fontWeight={600} variant="body1">
              {scandata?.SKU_VALUE}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-around" }}>
          <Button
            onClick={handleCloseQrScanner}
            variant="outlined"
            label="Cancel"
          />
          <Button
            variant="outlined"
            label="Rescan"
            onClick={() => {
              onOpenChange(true);
              handleCloseQrScanner();
            }}
          />
          <Button
            variant="contained"
            label="Place Items"
            //   disabled={!locationId || isLoading}
            // onClick={() => handlePostPutaway(locationId)}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
