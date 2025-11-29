import {
  Box,
  Card,
  Typography,
  Grid,
  Divider,
  Stack,
  Paper,
  useTheme,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetAllWarrantyByIdQuery,
  useLazyGetSpareStocksQuery,
  usePostAddSkuMutation,
  usePostUpdateWarrantyMutation,
} from "../../../store/api/warranty/warranty-api";
import { useListAttachmentsQuery } from "../../../store/api/blob-attachements/attachements.api";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import Header from "../../../components/common/header";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../../../components/common/button/Button";
import { useSelector } from "react-redux";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadIcon from "@mui/icons-material/Download";

const ViewWarranty = () => {
  const location = useLocation();
  const id = location.state?.id;
  const theme = useTheme();
  const navigate = useNavigate();
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [comment, setComment] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [openAddDetail, setOpenAddDetail] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedParts, setSelectedParts] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelectedParts((prev) =>
      prev.includes(id)
        ? prev.filter((partId) => partId !== id)
        : [...prev, id],
    );
  };

  const handlePreviewOpen = (fileUrl: string) => {
    setSelectedFile(fileUrl);
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
    setSelectedFile(null);
  };

  const handleDownload = async (filename: string, originalName: string) => {
    try {
      const downloadUrl = `${process.env.API_BASE_URL}/api/attachments/download/${filename}?directory=warranty`;
      
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          OUID: defaultOU,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const userId = useSelector(
    (state: any) => state.user.userInfo.userInfo.USERID,
  );
  const userToken = useSelector((state: any) => state.user.userInfo.token);
  const defaultOU = useSelector((state: any) => state.user.defaultOU);

  const { data: warrantyData, isLoading: warrantyDataLoading } =
    useGetAllWarrantyByIdQuery(id, { refetchOnMountOrArgChange: true });
  const [postUpdateWarranty] = usePostUpdateWarrantyMutation();
  const [postAddSku] = usePostAddSkuMutation();
  const [fetchdata, { data: spareStockData, isLoading }] =
    useLazyGetSpareStocksQuery();

  const warranty = warrantyData?.data?.data?.warranty;
  const jobCard = warrantyData?.data?.data?.jobCard;
  const jobItems = warrantyData?.data?.data?.jobItems;

  // Fetch attachments
  const refId = jobCard?.JOBCARDNUMBER || jobCard?.ID;
  
  const { data: invoiceAttachments, isLoading: invoiceLoading } =
    useListAttachmentsQuery(
      { refId: refId || "", pageSection: "invoicefile" },
      { skip: !refId }
    );

  const { data: damageAttachments, isLoading: damageLoading } =
    useListAttachmentsQuery(
      { refId: refId || "", pageSection: "defectfile" },
      { skip: !refId }
    );

  const invoiceFiles = invoiceAttachments?.data || [];
  const damageFiles = damageAttachments?.data || [];

  const DetailRow = ({ label, value }:any) => (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || "-"}
      </Typography>
    </Stack>
  );

  const handleSubmit = async () => {
    const payload = {
      WARRANTYNO: warranty?.WARRANTYNO,
      STATUS: "APPROVED",
      DATE: new Date().toISOString(),
      COMMENTS: comment,
      USER: userId,
      jobItemIDs: selectedParts,
    };

    try {
      const res = await postUpdateWarranty(payload).unwrap();
      setOpenComment(false);
      setComment("");
      navigate(-1);
    } catch (error) {
      console.error("Error updating warranty:", error);
    }
  };

  const handleReject = async () => {
    const payload = {
      WARRANTYNO: warranty?.WARRANTYNO,
      STATUS: "DENIED",
      DATE: new Date().toISOString(),
      COMMENTS: "",
      USER: userId,
    };

    try {
      const res = await postUpdateWarranty(payload).unwrap();
      navigate(-1);
    } catch (error) {
      console.error("Error rejecting warranty:", error);
    }
  };

  const initialData = {
    VARIANT_CODE: "",
    RATE: "",
    MANUFACTURINGCODE: "",
    VENDORCODE: "",
    QUANTITY: "",
    REASONFORREPLACEMENT: "",
    REMARKS: "",
  }
  const [formData, setFormData] = useState(initialData);

  const [errors, setErrors] = useState({
    VARIANT_CODE: "",
    MANUFACTURINGCODE: "",
    VENDORCODE: "",
    QUANTITY: "",
    RATE: "",
    REASONFORREPLACEMENT: "",
    REMARKS: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    const newErrors: any = {};

    if (!formData.VARIANT_CODE) newErrors.VARIANT_CODE = "Variant Code is required";
    if (!formData.MANUFACTURINGCODE) newErrors.MANUFACTURINGCODE = "Manufacturing Code is required";
    if (!formData.VENDORCODE) newErrors.VENDORCODE = "Vendor Code is required";
    if (!formData.QUANTITY) newErrors.QUANTITY = "Quantity is required";
    if (!formData.RATE) newErrors.RATE = "Rate is required";
    if (!formData.REASONFORREPLACEMENT) newErrors.REASONFORREPLACEMENT = "Reason is required";
    if (!formData.REMARKS) newErrors.REMARKS = "remarks is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      JOBCARDNO: jobCard?.ID,
      ITEMS: [
        {
          VARIANT_CODE: formData.VARIANT_CODE,
          RATE: parseFloat(formData.RATE),
          MANUFACTURINGCODE: formData.MANUFACTURINGCODE,
          VENDORCODE: formData.VENDORCODE,
          QUANTITY: parseInt(formData.QUANTITY, 10),
          REASONFORREPLACEMENT: formData.REASONFORREPLACEMENT,
          REMARKS: formData.REMARKS,
        },
      ],
    };

    console.log("Final Payload:", payload);
    setOpenAddDetail(false);
    const res = await postAddSku(payload).unwrap();
    setFormData(initialData);
    console.log("added new prt details", res);
  };

  return (
    <>
      <BackdropLoader openStates={warrantyDataLoading || invoiceLoading || damageLoading} />
      <Header
        title={warranty?.WARRANTYNO}
        onBack={() => navigate(-1)}
        buttons={[
          {
            label: "Reject",
            variant: "outlined",
            onClick: handleReject,
            disabled: warranty?.STATUS.toLowerCase() === "approved",
          },
          {
            label: "Approve",
            variant: "contained",
            onClick: () => {
              setOpenComment(true);
            },
            disabled: selectedParts.length == 0,
          },
        ]}
      />
      <Box sx={{ p: 3, backgroundColor: theme.palette.background.default }}>
        <Card sx={{ mb: 3, p: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Warranty Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Warranty No
              </Typography>
              <Typography variant="subtitle1">
                {warranty?.WARRANTYNO}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Claim Type
              </Typography>
              <Typography variant="subtitle1">{warranty?.CLAIMTYPE}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color:
                    warranty?.STATUS === "NEW"
                      ? theme.palette.warning.main
                      : theme.palette.success.main,
                  fontWeight: 600,
                }}
              >
                {warranty?.STATUS}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Engine Number
              </Typography>
              <Typography variant="subtitle1">{jobCard?.ENGINENO}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                VIN Number
              </Typography>
              <Typography variant="subtitle1">{jobCard?.VIN}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                SKU
              </Typography>
              <Typography variant="subtitle1">{jobCard?.SKU}</Typography>
            </Grid>
          </Grid>
          <Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                SKU Description
              </Typography>
              <Typography variant="subtitle1">{jobCard?.SKUDESC}</Typography>
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: "100%" }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Vehicle Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                <DetailRow label="Job Card Number" value={jobCard?.JOBCARDNUMBER} />
                <DetailRow label="Job Activity" value={jobCard?.JOBACTIVITY} />
                <DetailRow label="Dealer Code" value={warranty?.DEALERCODE} />
                <DetailRow label="Invoice No" value={warranty?.INVOICENO} />
                <DetailRow label="Invoice Date" value={new Date(warranty?.INVOICEDATE).toLocaleDateString()} />
                <DetailRow label="Malfunction (KMs)" value={warranty?.MALFUNCTIONKMS} />
                <DetailRow label="Repair (KMs)" value={warranty?.REPAIRKMS} />
                <DetailRow label="Oil Make" value={warranty?.OILMAKE} />
                <DetailRow label="Oil Grade" value={warranty?.OILGRADE} />
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, height: "100%" }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Uploaded Files
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Invoice Photos:
              </Typography>
              {invoiceFiles.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  No invoice photos uploaded
                </Typography>
              ) : (
                invoiceFiles.map((file: any) => (
                  <Box
                    key={file.ID}
                    sx={{
                      ml: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {file.ORIGINAL_NAME}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewOpen(file.BLOBURL)}
                      title="Preview"
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(file.FILENAME, file.ORIGINAL_NAME)}
                      title="Download"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}

              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Damage Photos:
              </Typography>
              {damageFiles.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  No damage photos uploaded
                </Typography>
              ) : (
                damageFiles.map((file: any) => (
                  <Box
                    key={file.ID}
                    sx={{
                      ml: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {file.ORIGINAL_NAME}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handlePreviewOpen(file.BLOBURL)}
                      title="Preview"
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(file.FILENAME, file.ORIGINAL_NAME)}
                      title="Download"
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 3, p: 2 }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Part Details
            </Typography>
            <Button
              label="Add Part Details"
              onClick={() => {
                setOpenAddDetail(true);
                fetchdata(null);
              }}
              disabled={warranty?.STATUS.toLowerCase() === "approved"}
            />
          </Grid>

          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {jobItems?.map((item: any) => (
              <Grid item xs={12} md={6} key={item.ID}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.grey[50],
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color:
                          item?.STATUS === "USED"
                            ? theme.palette.warning.main
                            : theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    >
                      {item.STATUS}
                    </Typography>
                    <Checkbox
                      checked={selectedParts.includes(item.ID)}
                      onChange={() => handleSelect(item.ID)}
                      color="primary"
                      disabled={warranty?.STATUS.toLowerCase() === "approved"}
                    />
                  </Box>

                  <DetailRow label="Part Code" value={item.SKU} />
                  <DetailRow label="Part Description" value={item.SKUDESC} />
                  <DetailRow label="Manufacturing Code" value={item.MANUFACTURINGCODE} />
                  <DetailRow label="Vendor Code" value={item.VENDORCODE} />
                  <DetailRow label="Quantity" value={item.QUANTITY} />
                  <DetailRow label="Rate" value={item.RATE} />
                  <DetailRow label="Reason" value={item.REASONFORREPLACEMENT} />
                  <DetailRow label="Remarks" value={item.REMARKS} />
                  <DetailRow label="Available Quantity" value={item.AVAILABLE_QTY} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Box>

      {/* ============================approve and comment dialog============================= */}
      <Dialog
        open={openComment}
        onClose={() => {
          setOpenComment(false);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 0,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {warranty?.WARRANTYNO}
          </Typography>
          <IconButton
            onClick={() => {
              setOpenComment(false);
              setComment("");
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: 4,
            borderRadius: 2,
            maxHeight: "75vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.grey[600],
              borderRadius: 4,
            },
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Comments
            </Typography>
            <TextField
              label="Comments"
              fullWidth
              required
              multiline
              minRows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Selected Part Details
            </Typography>

            {selectedParts.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", textAlign: "center", mt: 6 }}
              >
                No parts selected
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {jobItems
                  ?.filter((items: any) => selectedParts.includes(items.ID))
                  .map((item: any) => (
                    <Grid item xs={12} sm={6} key={item.ID}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mb: 2,
                            color: "primary.main",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {item.SKU}
                        </Typography>

                        <DetailRow label="Part Description" value={item.SKUDESC} />
                        <DetailRow label="Manufacturing Code" value={item.MANUFACTURINGCODE} />
                        <DetailRow label="Vendor Code" value={item.VENDORCODE} />
                        <DetailRow label="Quantity" value={item.QUANTITY} />
                        <DetailRow label="Rate" value={item.RATE} />
                        <DetailRow label="Reason" value={item.REASONFORREPLACEMENT} />
                        <DetailRow label="Remarks" value={item.REMARKS} />
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            label="Close"
            variant="outlined"
            onClick={() => {
              setOpenComment(false);
              setComment("");
            }}
          />
          <Button
            label="Submit"
            variant="contained"
            onClick={handleSubmit}
            disabled={!comment.trim()}
          />
        </DialogActions>
      </Dialog>

      {/* ============================ image preview dialog============================= */}
      <Dialog
        open={openPreview}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Preview
          <IconButton onClick={handlePreviewClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 3,
            minHeight: 400,
          }}
        >
          {selectedFile ? (
            <Box
              component="img"
              crossOrigin='anonymous'
              src={selectedFile}
              alt="Preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          ) : (
            <Typography variant="body1" color="text.secondary">
              No file selected
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================add part detail dialog============================= */}
      <Dialog
        open={openAddDetail}
        onClose={() => setOpenAddDetail(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add Part Details
          <IconButton onClick={() => setOpenAddDetail(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Variant Code *"
                name="VARIANT_CODE"
                fullWidth
                value={formData.VARIANT_CODE}
                onChange={handleChange}
                helperText="Select a variant from stock"
                error={!!errors.VARIANT_CODE}
              >
                {spareStockData?.data?.data?.map((variant: any) => (
                  <MenuItem
                    key={variant.VARIANT_CODE}
                    value={variant.VARIANT_CODE}
                  >
                    {variant.VARIANT_CODE}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Manufacturing Code *"
                name="MANUFACTURINGCODE"
                fullWidth
                value={formData.MANUFACTURINGCODE}
                onChange={handleChange}
                error={!!errors.MANUFACTURINGCODE}
                helperText={errors.MANUFACTURINGCODE}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vendor Code *"
                name="VENDORCODE"
                fullWidth
                value={formData.VENDORCODE}
                onChange={handleChange}
                error={!!errors.VENDORCODE}
                helperText={errors.VENDORCODE}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity *"
                name="QUANTITY"
                fullWidth
                type="number"
                value={formData.QUANTITY}
                onChange={handleChange}
                error={!!errors.QUANTITY}
                helperText={errors.QUANTITY}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rate *"
                name="RATE"
                fullWidth
                type="number"
                value={formData.RATE}
                onChange={handleChange}
                error={!!errors.RATE}
                helperText={errors.RATE}
                inputProps={{ min: 0 }} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reason for Replacement *"
                name="REASONFORREPLACEMENT"
                fullWidth
                value={formData.REASONFORREPLACEMENT}
                onChange={handleChange}
                error={!!errors.REASONFORREPLACEMENT}
                helperText={errors.REASONFORREPLACEMENT}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remarks *"
                name="REMARKS"
                fullWidth
                multiline
                rows={2}
                value={formData.REMARKS}
                onChange={handleChange}
                error={!!errors.REMARKS}
                helperText={errors.REMARKS}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => setOpenAddDetail(false)}
          />
          <Button label="Save" variant="contained" onClick={handleSave} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewWarranty;