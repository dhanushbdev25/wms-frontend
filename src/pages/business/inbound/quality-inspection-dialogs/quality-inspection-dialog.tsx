import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
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
  TextField,
} from "@mui/material";
import React, { useState } from "react";

import Button from "../../../../components/common/button/Button";
import { ScanDialogProps } from "../quality-inspection/types";

export const ScandialogQuality: React.FC<ScanDialogProps> = ({
  matchedItems,
  handleClose,
  openItem,
  setMainData,
  setValue,
  serialized,
  mainData,
}) => {
  const theme = useTheme();
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string >("");
  const changeLocation = (prop: string) => {
    if (!matchedItems) return; // nothing to update

    setSelectedStatus(prop);
    setIsSaveEnabled(true);
  };

  const handlesave = () => {
    setMainData((prev) =>
      prev.map((item) => {
        const isMatch = serialized
          ? item.vin_number === matchedItems?.vin_number
          : item.sku === matchedItems?.sku;

        return isMatch
          ? {
              ...item,
              locationStatus: selectedStatus,
              ...(item.quantity ? { quantity: item.quantity } : {}),
            }
          : item;
      }),
    );
    setValue("");
    handleClose();
    setSelectedStatus("");
  };

  return (
    <Dialog
      id="quality-dialog"
      data-testid="quality-dialog"
      onClose={() => {
        handleClose();
        setValue("");
      }}
      aria-labelledby="mui-dialog-title"
      open={openItem}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="mui-dialog-title" sx={{ m: 0, p: 2 }}>
        <Typography component="h4" color="primary">
          Item Verification
        </Typography>

        <IconButton
          aria-label="close"
          data-testid="dialog-close-btn"
          onClick={() => {
            handleClose();
            setValue("");
          }}
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
              <Chip
                label={`Quantity  ${matchedItems?.quantity} ${matchedItems?.uom} `}
              />
            </Grid>
            <Grid item>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                SKU
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "15px" }}>
                {" "}
                <b>{matchedItems?.sku}</b>
              </Typography>
            </Grid>
          </Grid>

          {!serialized && (
            <Grid
              container
              sx={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                marginTop: 2,
                flexWrap: "nowrap",
              }}
            >
              <Grid item>
                <VerifiedIcon sx={{ color: theme.palette.success.light }} />
                <Typography sx={{ color: theme.palette.success.light }}>
                  Verified
                </Typography>
              </Grid>

              <Grid sx={{ marginTop: 2 }}>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  SKU Name
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  <b>{matchedItems?.skuName}</b>
                </Typography>
              </Grid>
            </Grid>
          )}
          {serialized && (
            <>
              <Grid sx={{ marginTop: 2 }}>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  SKU Name
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  <b>{matchedItems?.skuName}</b>
                </Typography>
              </Grid>

              <Grid
                container
                sx={{
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  marginTop: 2,
                }}
              >
                <Grid item>
                  <VerifiedIcon sx={{ color: theme.palette.success.light }} />
                  <Typography sx={{ color: theme.palette.success.light }}>
                    Verified
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" sx={{ fontSize: "10px" }}>
                    Engine Number{" "}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "15px" }}>
                    <b>{matchedItems?.vin_number}</b>
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
          {!serialized && (
            <Grid sx={{ marginTop: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                Quantity
              </Typography>
              <TextField
                type="number"
                size="small"
                value={
                  mainData.find((item) => item.sku === matchedItems?.sku)
                    ?.quantity ?? 0
                }
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMainData((prev) =>
                    prev.map((item) =>
                      item.sku === matchedItems?.sku
                        ? { ...item, quantity: value }
                        : item,
                    ),
                  );
                }}
                inputProps={{ min: 0, max: matchedItems?.quantity }}
                sx={{ fontSize: "15px", width: "100px" }}
              />
            </Grid>
          )}

          <Grid sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              Quality Condition
            </Typography>
            <Box display="flex" justifyContent="space-around">
              <Button
                onClick={() => {
                  changeLocation("QI-Passed");
                }}
                label="Pass"
                startIcon={<DoneOutlinedIcon />}
                variant={
                  selectedStatus === "QI-Passed" ? "contained" : "outlined"
                }
                color={selectedStatus === "QI-Passed" ? "success" : "inherit"}
              />
              <Button
                onClick={() => {
                  changeLocation("Damaged");
                }}
                variant={
                  selectedStatus === "Damaged" ? "contained" : "outlined"
                }
                color={selectedStatus === "Damaged" ? "success" : "inherit"}
                label="Damaged"
                startIcon={<BrokenImageOutlinedIcon />}
              />
              <Button
                onClick={() => {
                  changeLocation("Not-Found");
                }}
                variant={
                  selectedStatus === "Not-Found" ? "contained" : "outlined"
                }
                color={selectedStatus === "Not-Found" ? "success" : "inherit"}
                label="Not Found"
                startIcon={<ErrorOutlineOutlinedIcon />}
              />
            </Box>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handlesave}
          variant="contained"
          label="Save"
          id="save-btn"
          startIcon={<DoneIcon />}
          disabled={!isSaveEnabled}
        />
      </DialogActions>
    </Dialog>
  );
};
