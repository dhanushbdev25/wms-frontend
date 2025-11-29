import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import React from "react";
import Button from "../../../../components/common/button/Button";
import { ScanDialogProps } from "../../inbound/quality-inspection/types";
import {
  usePatchPutAwayOnHoldItemsMutation,
  usePatchScrapOnHoldItemsMutation,
} from "../../../../store/api/onhold-items/onhold-api";

export const ScanDialogPickup: React.FC<ScanDialogProps> = ({
  matchedItems,
  handleClose,
  openItem,
  setMainData,
}) => {
  const [patchPutAway, { isLoading: isPutawayLoading }] =
    usePatchPutAwayOnHoldItemsMutation();
  const [patchScrap, { isLoading: isScrapLoading }] =
    usePatchScrapOnHoldItemsMutation();

  const handleSendToPutaway = async () => {
    try {
      if (!matchedItems?.id) {
        console.error("Missing item ID");
        return;
      }

      const payload = { ids: [matchedItems.id] };
      const response = await patchPutAway(payload).unwrap();

      setMainData(response);
      handleClose();
    } catch (err) {
      console.error(" Putaway Failed:", err);
    }
  };

  const handleSendToScrap = async () => {
    try {
      if (!matchedItems?.id) {
        console.error("Missing item ID");
        return;
      }

      const payload = { ids: [matchedItems.id] };
      const response = await patchScrap(payload).unwrap();

      // Optionally update parent data or show success message
      setMainData(response);
      handleClose();
    } catch (err) {
      console.error("Scrap Failed:", err);
    }
  };

  return (
    <Dialog
      id="pickup-dialog"
      onClose={handleClose}
      open={openItem}
      fullWidth
      maxWidth="xs"
    >
      {/* Heading */}
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography component="h4" color="primary">
          Hold Item
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={2}>
          {/* SKU */}
          <Grid sx={{ marginTop: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "text.secondary" }}
            >
              SKU
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {matchedItems?.skuName || "-"}
            </Typography>
          </Grid>

          {/* VIN Number */}
          <Grid sx={{ marginTop: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "12px", color: "text.secondary" }}
            >
              VIN Number
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {matchedItems?.vin_number || "-"}
            </Typography>
          </Grid>
        </Box>
      </DialogContent>

      {/* Footer buttons */}
      <DialogActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
        <Button
          onClick={handleSendToPutaway}
          variant="contained"
          label={isPutawayLoading ? "Sending..." : "Send to Put Away"}
          fullWidth
          disabled={isPutawayLoading || isScrapLoading}
        />
        <Button
          onClick={handleSendToScrap}
          variant="contained"
          color="error"
          label={isScrapLoading ? "Sending..." : "Send to Scrap"}
          fullWidth
          disabled={isPutawayLoading || isScrapLoading}
        />
        <Button
          onClick={handleClose}
          variant="outlined"
          label="Cancel"
          fullWidth
          disabled={isPutawayLoading || isScrapLoading}
        />
      </DialogActions>
    </Dialog>
  );
};
