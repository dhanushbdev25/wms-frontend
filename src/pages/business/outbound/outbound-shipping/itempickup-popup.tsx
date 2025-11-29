import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import Button from "../../../../components/common/button/Button";
import { MatchedItem } from "../../inbound/quality-inspection/types";

type ScanDialogProps = {
  matchedItems: MatchedItem | undefined;
  handleClose: () => void;
  openItem: boolean;
  orderId: number;
  serialized: boolean;
  orderItems: any;
  setMatchedItems: Function;
};

const AUTO_SAVE_DELAY = 1000;

export const ScanDialogPickup: React.FC<ScanDialogProps> = ({
  matchedItems,
  handleClose,
  openItem,
  orderId,
  serialized,
  orderItems,
  setMatchedItems,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openItem && matchedItems) {
      timer = setTimeout(() => {
        handleClose();
        setMatchedItems(undefined);
      }, AUTO_SAVE_DELAY);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [openItem, matchedItems]);

  return (
    <Dialog
      id="pickup-dialog"
      onClose={handleClose}
      open={openItem}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography component="h4" color="primary">
          Item Pickup
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
          <Grid
            container
            sx={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Grid item>
              <Chip label={`Quantity ${orderItems?.allocatedQty || 1}`} />
            </Grid>
            <Grid item>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                SKU
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "15px" }}>
                <b>{matchedItems?.sku}</b>
              </Typography>
            </Grid>
          </Grid>

          <Grid sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              SKU Name
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "15px" }}>
              <b>{matchedItems?.skuName}</b>
            </Typography>
          </Grid>

          {serialized ? (
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginTop: 2 }}
            >
              <Grid item>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  VIN Number
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  <b>{matchedItems?.vin_number}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Chip label="Verified" color="success" />
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ marginTop: 2 }}
            >
              <Grid item xs={8}>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  Quantity
                </Typography>
                {/* <TextField
                  fullWidth
                  value={orderItems?.allocatedQty}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                  size="small"
                /> */}
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  <b>{orderItems?.allocatedQty}</b>
                </Typography>
              </Grid>
              <Grid item>
                <Chip label="Verified" color="success" />
              </Grid>
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {/* {!serialized && (
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            label="Save"
            id="pickup-save-btn"
          />
        )} */}
        <Button
          onClick={handleClose}
          variant="outlined"
          label="Close"
          id="pickup-close-btn"
          startIcon={<CloseIcon />}
        />
      </DialogActions>
    </Dialog>
  );
};
