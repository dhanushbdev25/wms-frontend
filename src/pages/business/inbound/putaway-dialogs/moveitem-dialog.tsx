import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Select,
  MenuItem,
  Chip,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Button from "../../../../components/common/button/Button";
import { useGetSKuLocationListQuery } from "../../../../store/api/Inbound/inboundApi";
import {
  ItemType,
  StorageData,
  StorageLocation,
} from "../../../../store/api/inbound-validators/inbound.validator";

type MoveItemDialogProps = {
  moveItem: boolean;
  handleMoveItem: () => void;
  selectedRow?: ItemType | null;
  onMove: (storageData: StorageData) => void;
};

export const MoveItemdialog: React.FC<MoveItemDialogProps> = ({
  moveItem,
  handleMoveItem,
  selectedRow,
  onMove,
}) => {
  const [selectedStorage, setSelectedStorage] = useState("");

  const { data: skuLocationListData } = useGetSKuLocationListQuery(
    selectedRow?.packageListItemId ?? 0,
    { skip: !selectedRow },
  );

  // local state to hold storage list
  const [storageList, setStorageList] = useState<StorageLocation[]>([]);

  useEffect(() => {
    if (skuLocationListData?.data) {
      setStorageList(skuLocationListData?.data);
    } else {
      setStorageList([]);
    }
  }, [skuLocationListData]);

  if (!selectedRow) return null;

  return (
    <Dialog
      onClose={handleMoveItem}
      aria-labelledby="mui-dialog-title"
      open={moveItem}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="mui-dialog-title" sx={{ m: 0, p: 2 }}>
        <Typography sx={{ fontSize: "20px" }} color="primary">
          Change Storage Location
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleMoveItem}
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
            sx={
              selectedRow.serialized
                ? {
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                  }
                : {}
            }
          >
            {selectedRow.serialized && (
              <Grid item>
                <Chip label={`Quantity ${selectedRow ? 1 : 0}`} />
              </Grid>
            )}
            <Grid item>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                SKU
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "15px" }}>
                <b>{selectedRow.sku}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              SKU Name
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "15px" }}>
              <b>{selectedRow.skuName}</b>
            </Typography>
          </Grid>
          <Grid sx={{ marginTop: 2 }}>
            {selectedRow.serialized ? (
              <>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  VIN Number
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "15px" }}>
                  <b>{selectedRow.vin_number}</b>
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" sx={{ fontSize: "10px" }}>
                  Quantity
                </Typography>
                <TextField
                  id="Quantity-text-fld"
                  data-testid="Quantity-text-fld"
                  variant="outlined"
                  fullWidth
                  value={0}
                  size="small"
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "4px 8px",
                      fontSize: "14px",
                    },
                  }}
                />
              </>
            )}
          </Grid>
          <Grid sx={{ marginTop: 2 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              Current Storage Location
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "15px" }}>
              <b>{selectedRow.storageName}</b>
            </Typography>
          </Grid>
        </Box>

        <Typography variant="subtitle2" sx={{ fontSize: "15px" }}>
          New Storage Location
        </Typography>
        <Select
          fullWidth
          size="small"
          value={selectedStorage}
          onChange={(e) => setSelectedStorage(e.target.value)}
          id="storage-select"
          data-testid="storage-select"
        >
          {storageList
            .filter((storage) => storage.LOCATION_ID !== selectedRow.storageId)
            .map((storage, idx) => (
              <MenuItem key={idx} value={storage.LOCATION_ID}>
                {storage.LOCATION_CODE}
              </MenuItem>
            ))}
        </Select>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={() => {
            if (selectedStorage) {
              const storage = storageList?.find(
                (s) => s.LOCATION_ID === +selectedStorage,
              );

              if (storage) {
                onMove({
                  storageId: storage.LOCATION_ID,
                  storageName: storage.LOCATION_CODE,
                  skuList: [
                    {
                      id: undefined, // Need to fix
                      skuName: selectedRow.skuName,
                      sku: selectedRow.sku,
                      vin_number: selectedRow.vin_number,
                      uom: selectedRow.uom,
                      itemStatus: selectedRow.itemStatus,
                      locationStatus: selectedRow.locationStatus,
                      serialized: selectedRow.serialized,
                      packageListItemId: selectedRow.packageListItemId,
                      quantity: undefined, 
                      type:  undefined,
                    },
                  ],
                });
              }

              handleMoveItem();
            }
          }}
          startIcon={<DoneIcon />}
          variant="contained"
          label="Save"
          disabled={!selectedStorage}
        />
      </DialogActions>
    </Dialog>
  );
};
