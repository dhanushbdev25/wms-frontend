import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import Button from "../../../../components/common/button/Button";
import { OnHoldItemDetail } from "../../../../store/api/onhold-items-validators/onhold.validator";
import {
  usePatchPutAwayOnHoldItemsMutation,
  usePatchScrapOnHoldItemsMutation,
} from "../../../../store/api/onhold-items/onhold-api";

interface ScrapDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flag: string;
  serialized: boolean | undefined;
  scrapItem: OnHoldItemDetail | OnHoldItemDetail[] | null;
}

const ScrapDialog: React.FC<ScrapDialogProps> = ({
  open,
  onClose,
  onConfirm,
  scrapItem,
  flag,
  serialized,
}) => {
  const isMultiple = Array.isArray(scrapItem) && scrapItem.length > 1;

  const [quantity, setQuantity] = useState<number>(
    !isMultiple && scrapItem && !Array.isArray(scrapItem)
      ? scrapItem.quantity || 0
      : 0,
  );

  const [patchPutAway, { isLoading: isPutawayLoading }] =
    usePatchPutAwayOnHoldItemsMutation();
  const [patchScrap, { isLoading: isScrapLoading }] =
    usePatchScrapOnHoldItemsMutation();

  const getIdsArray = (): number[] => {
    if (!scrapItem) return [];
    return Array.isArray(scrapItem)
      ? scrapItem.map((item) => Number(item.id))
      : [Number(scrapItem.id)];
  };

  const handleConfirm = async () => {
    try {
      const ids = getIdsArray();
      if (ids.length === 0) {
        console.error("No valid item IDs to process");
        return;
      }

      const payload = { ids };

      let response;
      if (flag === "putaway") {
        response = await patchPutAway(payload).unwrap();
      } else {
        response = await patchScrap(payload).unwrap();
      }

      onConfirm(); // trigger parent refresh if needed
      onClose();
    } catch (error) {
      console.error(" Operation failed:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {flag === "putaway" ? "Send to Putaway" : "Send to Scrap"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {Array.isArray(scrapItem) && scrapItem.length > 0 ? (
          scrapItem.length === 1 ? (
            // Single item display
            <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                {scrapItem[0].skuCode}
              </Typography>

              <Typography variant="subtitle1" fontWeight={700}>
                {scrapItem[0].skuName}
              </Typography>

              {serialized ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    VIN Number
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {scrapItem[0].vin_number}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Quantity
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              )}
            </Stack>
          ) : (
            // Multiple items display
            <Stack spacing={1.5}>
              <Typography variant="body1" fontWeight={600}>
                {flag === "putaway"
                  ? "You've selected multiple items. All selected items will be moved to Put-Away."
                  : "You've selected multiple items. All selected items will be moved to Scrap."}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontStyle: "italic" }}
              >
                This action cannot be undone.
              </Typography>

              <Box sx={{ mt: 1 }}>
                {scrapItem.map((item, idx) => (
                  <Typography key={idx} variant="body2">
                    • {item.skuName} ({item.vin_number || "N/A"})
                  </Typography>
                ))}
              </Box>
            </Stack>
          )
        ) : null}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          startIcon={<CloseIcon />}
          label="Cancel"
          disabled={isPutawayLoading || isScrapLoading}
        />

        <Button
          onClick={handleConfirm}
          variant="contained"
          color={flag === "putaway" ? "primary" : "error"}
          label={
            isPutawayLoading || isScrapLoading
              ? "Processing..."
              : flag === "putaway"
                ? "Putaway"
                : "Scrap"
          }
          disabled={isPutawayLoading || isScrapLoading}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ScrapDialog;
