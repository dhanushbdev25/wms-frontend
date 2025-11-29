import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
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
  useTheme,
} from "@mui/material";
import React, { useEffect, useCallback } from "react";

import Button from "../../../../components/common/button/Button";
import { PutAwaySkuDetails } from "../../../../store/api/inbound-validators/inbound.validator";
// import { usePatchBinningMutation } from "../../../../store/api/Inbound/inboundApi";
// import { displayError } from "../../../../utils/helpers";
import passImage from "../../../../assets/images/common/itemverification-pass.png";
interface ScandialogProps {
  matchedItems: PutAwaySkuDetails | undefined;
  handleClose: () => void;
  openItem: boolean;
  setvalue: React.Dispatch<React.SetStateAction<string>>;
  updateItems: (updatedItems: PutAwaySkuDetails[]) => void;
  serialized: boolean;
  setMatchedItems: Function;
}

const AUTO_SAVE_DELAY = 1000; // 1 second

export const Scandialog: React.FC<ScandialogProps> = ({
  matchedItems,
  handleClose,
  openItem,
  setvalue,
  updateItems,
  serialized,
  setMatchedItems,
}) => {
  // const [patchBinning] = usePatchBinningMutation();
  const theme = useTheme();

  // const handleSave = useCallback(async () => {
  //   if (!matchedItems) return;

  //   try {
  //     const ITEM_ID = matchedItems.packageListItemId;
  //     await patchBinning(ITEM_ID).unwrap();

  //     if (!matchedItems.vin_number && !matchedItems.sku) {
  //       console.warn("Cannot update item without VIN or SKU");
  //       return;
  //     }

  //     const updated = [{ ...matchedItems, locationStatus: "Placed" }];
  //     updateItems(updated);

  //     handleClose();
  //     setvalue("");
  //   } catch (err) {
  //     displayError(err);
  //   }
  // }, [matchedItems, patchBinning, handleClose, setvalue, updateItems]);

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
      onClose={() => {
        handleClose();
        setvalue("");
      }}
      aria-labelledby="mui-dialog-title"
      open={openItem}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="mui-dialog-title"
        sx={{
          m: 0,
          p: 2,
          position: "relative",
          height:80
        }}
      >
        <Typography sx={{ fontSize: "20px" }} color="primary">
          Item Verification
        </Typography>
        <img
          src={passImage}
          alt="Verification"
          style={{
            position: "absolute",
            right: 0,
            top: -20,
            width: 132,
            height: 112,
            opacity: 1,
            pointerEvents: "none",
            zIndex:0
          }}
        />

        {/* X Button */}
        {/* <IconButton
          aria-label="close"
          onClick={() => {
            handleClose();
            setvalue("");
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton> */}
      </DialogTitle>

      <DialogContent dividers sx={{zIndex:1 , backgroundColor:theme.palette.background.paper}}>
        {/* <Grid container flexDirection="column" alignItems="center">
          <VerifiedIcon
            sx={{ color: theme.palette.success.main, fontSize: 40 }}
          />
          <Typography sx={{ color: theme.palette.success.main, mt: 1 }}>
            Verified
          </Typography>
        </Grid> */}

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
              <Chip
                label={`Quantity ${matchedItems?.quantity || 1} ${
                  serialized ? "carton" : "box"
                }`}
              />
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
            <Grid sx={{ marginTop: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                VIN
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "15px" }}>
                <b>{matchedItems?.vin_number}</b>
              </Typography>
            </Grid>
          ) : (
            <Grid sx={{ marginTop: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                Quantity
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "15px" }}>
                <b>{matchedItems?.quantity}</b>
              </Typography>
            </Grid>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setvalue("");
          }}
          variant="contained"
          label="Close"
        />
      </DialogActions>
    </Dialog>
  );
};
