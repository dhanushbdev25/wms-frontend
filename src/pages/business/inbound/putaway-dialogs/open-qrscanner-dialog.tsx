import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  DialogTitle,
  Chip,
  useTheme,
} from "@mui/material";
import React from "react";

import StorageHierarchyImages from "../../../../assets/images/storage-hierarchy";
import Button from "../../../../components/common/button/Button";
import { usePostPutAwayItemsMutation } from "../../../../store/api/Inbound/inboundApi";
import { displayError } from "../../../../utils/helpers";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { ResponseData } from "../../../../store/api/inbound-validators/inbound.validator";
import scanLocation from "../../../../assets/images/common/scanLocation.png";

type OpenQrProps = {
  qrScanner: boolean;
  handleCloseQrScanner: () => void;
  qrStorageName: string;
  onOpenChange: (open: boolean) => void;
  locationId: number | null;
  setResponseData: (val: ResponseData) => void;
  setOpenResponse: (open: boolean) => void;
};

export const OpenQrScanner: React.FC<OpenQrProps> = ({
  qrScanner,
  handleCloseQrScanner,
  qrStorageName,
  onOpenChange,
  locationId,
  setResponseData,
  setOpenResponse,
}) => {
  const theme = useTheme()
  const [postPutAwayItems, { isLoading }] = usePostPutAwayItemsMutation();

  const handlePostPutaway = async (locationId: number | null) => {
    if (!locationId) return;

    try {
      const res = await postPutAwayItems(locationId).unwrap();
      setResponseData({ type: "Place Items", message: res.message });
      handleCloseQrScanner();
      setOpenResponse(true);
    } catch (err) {
      displayError(err);
    }
  };

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Dialog
        onClose={handleCloseQrScanner}
        aria-labelledby="mui-dialog-title"
        open={qrScanner}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            position: "relative",
            height: 80,
          }}
          alignContent="center"
        >
          <Typography
            variant="h4"
            // align="center"
            sx={{ fontWeight: 500, color: "text.secondary" }}
          >
            Put Away
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
              zIndex: 0,
            }}
          />
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid theme.palette.gray[400]",
              backgroundColor: theme.palette.warning.lighter,
            }}
          >
            <Box
              sx={{
                flex: 7,
                p:2
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{qrStorageName}</Typography>
              <Chip label="Bin"  size="small" sx={{ mt: 1 }} />
            </Box>
            <Box
              sx={{
                flex: 3,
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
                // padding: 1,
              }}
            >
              <Box
                component="img"
                src={StorageHierarchyImages.bin}
                alt="Storage hierarchy"
                sx={{
                  width: "70%",
                  height: "auto",
                }}
              />
            </Box>
          </Box>
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            The selected items will be stored in the above specified location
          </Typography>
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
            disabled={!locationId || isLoading}
            onClick={() => handlePostPutaway(locationId)}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
