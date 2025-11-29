import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../../components/common/button/Button";
import { Cell, Table } from "../../../components/common/table";

const FinishedGoodsDialog = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: any[];
}) => {
  const [rowSelection, setRowSelection] = useState({});
console.log("assemblyItems",data);
  const finishedGoods = useMemo(() => {
    return (
      data
        ?.filter((item) => item.status === "FINISHED_GOODS")
        .map((i) => ({
          sku: i.sku,
          skuName: i.skuName,
          vinNumber: i.vinNumber,
        })) || []
    );
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 0,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Finished Goods - Assembly Order ID:{" "}
          <Typography component="span" color="primary">
            A001
          </Typography>
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box mt={2}>
          <Table
            data={finishedGoods}
            // enableRowSelection
            state={{ rowSelection }}
            onRowSelectionChange={setRowSelection}
          >
            <Cell type="text" title="SKU" value="sku" />
            <Cell type="text" title="SKU Name" value="skuName" />
            <Cell type="text" title="VIN Number" value="vinNumber" />
          </Table>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button label="Close" variant="contained" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default FinishedGoodsDialog;
