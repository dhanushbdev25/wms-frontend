import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import Button from "../../../../components/common/button/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type GRNData = {
  ID: string;
  GRN_NO: string;
  GRN_STATUS: string;
  refDocNo:string;
};

type PlaceItemsData = string;

type ResponseData =
  | { type: "GRN"; data: GRNData }
  | { type: "LTI"; data: GRNData }
  | { type: "WB"; data: GRNData }
  | { type: "LTO"; data: GRNData }
  | { type: "Place Items"; data: PlaceItemsData };

type ResponseDialogProps = {
  open: boolean;
  setOpenResponse: (open: boolean) => void;
  data: ResponseData | null;
};

export const ResponseDialog: React.FC<ResponseDialogProps> = ({
  open,
  setOpenResponse,
  data,
}) => {
  const navigate = useNavigate();
  const [heading, setHeading] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  
  useEffect(() => {
    if (!data) {
      setHeading("");
      setMessage("");
      return;
    }

    if (data.type === "GRN") {
      const grn = data.data as GRNData;
      setHeading("GRN Created");
      setMessage(`GRN No: ${grn.GRN_NO}\n Status: ${grn.GRN_STATUS}`);
    } else if (data.type === "LTI") {
      const grn = data.data as GRNData;
      setHeading("LTI Created");
      setMessage(`LTI No: ${grn.GRN_NO}\n Status: ${grn.GRN_STATUS}`);
    } else if (data.type === "WB") {
      const grn = data.data as GRNData;
      setHeading("Way Bill Created");
      setMessage(`Way Bill No: ${grn.refDocNo}\n Status: Under Approval`);
    } else if (data.type === "LTO") {
      const grn = data.data as GRNData;
      setHeading("LTO Created");
      setMessage(`LTO No: ${grn.refDocNo}\n Status: Under Approval`);
    } else if (data.type === "Place Items") {
      setHeading("Item Placed");
      setMessage(data.data);
    }
  }, [data]);

  const handleClose = () => {
    setOpenResponse(false);
    if (data?.type !== "Place Items") {
      navigate(-1);
    }
  };

  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1.5 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {heading || "Action Successful"}
        </Typography>
      </DialogTitle>

      <Divider sx={{ mb: 2 }} />

      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={2}
        >
          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ whiteSpace: "pre-line" }}
          >
            {message || "Items Placed Successfully"}
          </Typography>

          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              px: 4,
              fontWeight: 500,
            }}
            label="Close"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
