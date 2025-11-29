import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Header from "../../../components/common/header";
import { useNavigate } from "react-router-dom";
import { SalesreturnDialog } from "./salesreturn-dialog";
import SalesScanHeaderDialog from "./sales-scan-dialog";
import { usePostCreateSalesReturnMutation } from "../../../store/api/sales-return/salesReturnApi";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import useIsMobile from "../../../themes/useIsMobile";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const CreateReturnOrder: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [scanInput, setScanInput] = useState("");
  const [scanInputval, setScanInputval] = useState("");
  const [dispatchedItems, setDispatchedItems] = useState<any[]>([]);
  const [returnedItems, setReturnedItems] = useState<any[]>([]);
  const [scannedData, setScannedData] = useState<any>(null);
  const [openItem, setOpenItem] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
const [salesOrderKeys, setSalesOrderKeys] =  useState<any[]>([]);
  const [postCreateSalesReturn, { isLoading }] =
    usePostCreateSalesReturnMutation();
  const [formValues, setFormValues] = useState({
    salesOrder: "",
    returnReason: "",
    comments: "",
  });

  console.log("returnedItems",returnedItems);
  
  
  // Helper to map items for dispatchedItems state
  const mapDispatchedItems = (items: any[]) =>
    items.map((item, index) => ({
      id: index + 1,
      sku: item.VARIANT_CODE,
      variant_name: item.VARIANT_NAME,
      order_item_id: item.ORDER_ITEM_ID,
      dispatched_qty: item.DISPATCHED_QTY ?? 0,
      returned_qty: item.RETURNED_QTY ?? 0,
      stock_id: item.STOCK_ID ?? null,
      vin: scanInputval,
    }));

  useEffect(() => {
    if (
    !scannedData ||
    !scannedData.data ||
    (Array.isArray(scannedData.data) && scannedData.data.length === 0)
  )
      return;
           
    if (scannedData?.data?.SERIALIZED) {
      setFormValues((prev) => ({
        ...prev,
        salesOrder: scannedData?.message,
      }));
      setDispatchedItems(mapDispatchedItems(scannedData?.data?.formattedData));
    } else {
      const keys = Object.keys(scannedData?.data[0]);
      const firstKey = keys[0];
      setFormValues((prev) => ({
        ...prev,
        salesOrder: firstKey,
      }));

      const firstItems = scannedData?.data[0][firstKey] || [];
      setDispatchedItems(mapDispatchedItems(firstItems));
      setSalesOrderKeys(scannedData?.data?.flatMap((obj :any) => Object.keys(obj)) || [])
    }
  }, [scannedData]);

  const moveToReturned = (item: any) => {
    setDispatchedItems((prev) => prev.filter((i) => i.id !== item.id));
    setReturnedItems((prev) => [...prev, item]);
  };

  const moveToDispatched = (item: any) => {
    setReturnedItems((prev) => prev.filter((i) => i.id !== item.id));
    setDispatchedItems((prev) => [...prev, item]);
  };
    
  const onSubmit = async (values: any) => {
    

    if (returnedItems.length === 0) {
      setSnackbar({
        open: true,
        message: " Please return at least one item!",
      });
      return;
    }

    if (!values.returnReason) {
    setSnackbar({
      open: true,
      message: "Return reason is mandatory!",
    });
    return;
  }

    const body = {
      RETURN_REASON: values.returnReason || "Damaged packaging",
      RETURN_COMMENTS: values.comments || "No additional comments",
      items: returnedItems.map((item) => ({
        VARIANT_CODE: item.sku,
        VARIANT_NAME: item.variant_name,
        VIN: item.vin,
        RETURN_QTY: item.returned_qty,
        STOCK_ID: item.stock_id,
        ORDER_ITEM_ID: item.order_item_id,
      })),
    };

    try {
      await postCreateSalesReturn(body).unwrap();
      setScanInputval("");
      setSnackbar({
        open: true,
        message: " Sales return created successfully!",
      });
      navigate(-1); // go back after success
    } catch (err) {
      console.error(" API Error:", err);
      setSnackbar({ open: true, message: "Failed to create sales return." });
    }
  };
  console.log("dispatchedItemsdispatchedItems",dispatchedItems);
  

  return (
    <>
    <BackdropLoader openStates={isLoading} />
      <Header
        onBack={() => navigate(-1)}
        title="New Return Order"
        buttons={[
       
          {
            label: "Discard",
            color: "secondary",
            variant: "outlined",
            icon:<CloseIcon/>,
            onClick: () => navigate(-1),
          },
             {
            label: isLoading ? "Creating..." : "Create",
            color: "primary",
            variant: "contained",
            icon:<CheckIcon/>,
            onClick: () => onSubmit(formValues),
          },
        ]}
      />

  <Box
    sx={{
      p: { xs: 1.5, md: 3 },
    }}
  >
    <Paper
      elevation={2}
      sx={{
        backgroundColor: "#fff",
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 1.5, md: 2 },
      }}
    >
      {isMobile ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}> Sales Order </Typography>
            {scannedData?.data?.SERIALIZED ? (
              <TextField
                value={formValues.salesOrder}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    salesOrder: e.target.value,
                  }))
                }
                fullWidth
                size="small"
              />
            ) : (
              <TextField
                select
                value={formValues.salesOrder}
                onChange={(e) => {
                  const selectedKey = e.target.value;
                  setFormValues((prev) => ({ ...prev, salesOrder: selectedKey, }));
                  const selectedItems = scannedData?.data?.data[0][selectedKey] || [];
                  setDispatchedItems(mapDispatchedItems(selectedItems));
                }}
                fullWidth
                size="small"
              >
                {Object.keys(scannedData?.data?.[0] || {}).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Return Reason
            </Typography>

            <TextField
              select
              fullWidth
              size="small"
              value={formValues.returnReason}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, returnReason: e.target.value, }))
              }
            >
              <MenuItem value="Damaged packaging">Damaged packaging</MenuItem>
              <MenuItem value="Wrong Item">Wrong Item</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Comments
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={formValues.comments}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  comments: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <SalesScanHeaderDialog
              value={scanInput}
              setValue={setScanInput}
              setScannedData={setScannedData}
              setScanInputval={setScanInputval}
            />
          </Grid>

          {/* Dispatched Items */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600}>
              Dispatched Items
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {dispatchedItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No dispatched items yet.
              </Typography>
            ) : (
              dispatchedItems.map((item) => (
                <Paper
                  key={item.id}
                  sx={{ p: 2, mb: 1, borderRadius: 2, position: "relative", }}
                >
                  <IconButton
                    onClick={() => moveToReturned(item)}
                    sx={{ position: "absolute", top: 8, right: 8, border: "1px solid #d0d0d0",}}
                    color="primary"
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body2">SKU: {item.sku}</Typography>
                  <Typography variant="body2"> Name: {item.variant_name} </Typography>
                  <Typography variant="body2"> Dispatched Qty: {item.dispatched_qty} </Typography>
                  <Typography variant="body2"> Returned Qty: {item.returned_qty} </Typography>
                </Paper>
              ))
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600}>
              Returned Items
            </Typography>
            <Divider sx={{ mb: 1 }} />

            {returnedItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No items returned yet.
              </Typography>
            ) : (
              returnedItems.map((item) => (
                <Paper
                  key={item.id}
                  sx={{ p: 2, mb: 1, borderRadius: 2, position: "relative" }}
                >
                  <IconButton
                    onClick={() => moveToDispatched(item)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    color="error"
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography variant="body2">SKU: {item.sku}</Typography>
                  <Typography variant="body2">
                    Name: {item.variant_name}
                  </Typography>
                  <Typography variant="body2">Return Qty: 1</Typography>
                </Paper>
              ))
            )}
          </Grid>
        </Grid>
      ) : (
        <Box
        sx={{
          minHeight: "100vh",
          p: 2,
        }}
      >
        <Paper
          elevation={2}
          sx={{ backgroundColor: "#fff", maxWidth: 1200, mx: "auto", p: 2 }}
        >
          <Grid container spacing={2}>
            {/* Sales Order */}
            <Grid item xs={4} md={3}>
              <Typography variant="body2">Sales Order</Typography>
            </Grid>
            <Grid item xs={8} md={9}>
              {scannedData?.data?.SERIALIZED ? (
                <TextField
                  value={formValues.salesOrder}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      salesOrder: e.target.value,
                    }))
                  }
                  fullWidth
                  InputProps={{ sx: { width: { xs: "100%", sm: "50%" } } }}
                />
              ) : (
                <TextField
  select
  value={formValues.salesOrder}
  onChange={(e) => {
    const selectedKey = e.target.value;

    setFormValues((prev) => ({
      ...prev,
      salesOrder: selectedKey,
    }));

    const selectedObj = scannedData?.data?.find((item) => item[selectedKey]);
    const selectedItems = selectedObj?.[selectedKey] || [];

    setDispatchedItems(mapDispatchedItems(selectedItems));
  }}
  fullWidth
  InputProps={{ sx: { width: { xs: "100%", sm: "50%" } } }}
>
  {salesOrderKeys.map((key) => (
    <MenuItem key={key} value={key}>
      {key}
    </MenuItem>
  ))}
</TextField>

              )}
            </Grid>

            {/* Return Reason */}
            <Grid item xs={4} md={3}>
              <Typography variant="body2">Return Reason*</Typography>
            </Grid>
            <Grid item xs={8} md={9}>
              <TextField
                select
                value={formValues.returnReason}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    returnReason: e.target.value,
                  }))
                }
                fullWidth
                InputProps={{ sx: { width: { xs: "100%", sm: "50%" } } }}
              >
                <MenuItem value="Damaged packaging">Damaged packaging</MenuItem>
                <MenuItem value="Wrong Item">Wrong Item</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </TextField>
            </Grid>

            {/* Comments */}
            <Grid item xs={4} md={3}>
              <Typography variant="body2">Comments</Typography>
            </Grid>
            <Grid item xs={8} md={9}>
              <TextField
                value={formValues.comments}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    comments: e.target.value,
                  }))
                }
                fullWidth
              />
            </Grid>

            {/* Scan Section */}
                       <Typography variant="h6" sx={{ ml:2.5 , fontWeight:500  }}>
              Scan or Enter Item
            </Typography>
            <Grid item xs={12}>
              <SalesScanHeaderDialog
                value={scanInput}
                setValue={setScanInput}
                setScannedData={setScannedData}
                setScanInputval={setScanInputval}
              />
            </Grid>

            {/* Dispatched Items */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Dispatched Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {dispatchedItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No dispatched items yet.
                </Typography>
              ) : (
                dispatchedItems.map((item) => (
                  <Paper
                    key={item.id}
                    sx={{ p: 2, mb: 1, position: "relative" }}
                  >
                    <IconButton
                      onClick={() => moveToReturned(item)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      color="primary"
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">SKU: {item.sku}</Typography>
                    <Typography variant="body2">
                      Name: {item.variant_name}
                    </Typography>
                    <Typography variant="body2">
                      Dispatched Qty: {item.dispatched_qty}
                    </Typography>
                    <Typography variant="body2">
                      Returned Qty: {item.returned_qty}
                    </Typography>
                  </Paper>
                ))
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Returned Items
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {returnedItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No items returned yet.
                </Typography>
              ) : (
                returnedItems.map((item) => (
                  <Paper
                    key={item.id}
                    sx={{ p: 2, mb: 1, position: "relative" }}
                  >
                    <IconButton
                      onClick={() => moveToDispatched(item)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      color="error"
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">SKU: {item.sku}</Typography>
                    <Typography variant="body2">
                      Name: {item.variant_name}
                    </Typography>
                    <Typography variant="body2">Return Qty: 1</Typography>
                  </Paper>
                ))
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
      )}
    </Paper>
  </Box>

      {/* Popup Dialog */}
      <SalesreturnDialog
        qrScanner={openItem}
        handleCloseQrScanner={() => setOpenItem(false)}
        onOpenChange={setOpenItem}
        scandata={scannedData?.data}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </>
  );
};

export default CreateReturnOrder;
