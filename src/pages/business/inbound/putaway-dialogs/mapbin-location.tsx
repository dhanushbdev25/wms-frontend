import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Chip,
  FormHelperText,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  useGetAllStorageLocationsByWarehouseIdQuery,
  useManageSkuMutation,
} from "../../../../store/api/warehouse-management/skuApi";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";

type MapStorageLocationDialogProps = {
  open: boolean;
  onClose: () => void;
  data: any;
  message: any;
  onSuccess: () => void;
};

const MapBinLocation = ({
  open,
  onClose,
  data,
  message,
  onSuccess,
}: MapStorageLocationDialogProps) => {
  const { data: storageLocations, isLoading } =
    useGetAllStorageLocationsByWarehouseIdQuery(data.warehouseId, {
      refetchOnMountOrArgChange: true,
      skip: !data.warehouseId,
    });
  const theme = useTheme();
  const [manageSku, { isLoading: postLoading }] = useManageSkuMutation();
  const initialValues = {
    warehouseId: +data.warehouseId,
    warehouseLocationId: "",
    location: "",
    type: "",
    condition: "",
    assignedCapacity: 1000,
    maximumCapacity: 1000,
    receivingStatus: "Open",
  };
  const [formValues, setFormValues] = useState(initialValues);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormValues(initialValues);
  }, [data, open]);

  const receivingStatusOptions = [
    {
      value: "Open",
      label: <Chip label="Open" color="success" size="small" />,
    },
    {
      value: "Paused",
      label: <Chip label="Paused" color="warning" size="small" />,
    },
    {
      value: "Closed",
      label: <Chip label="Closed" color="error" size="small" />,
    },
  ];

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formValues.warehouseLocationId) {
      newErrors.warehouseLocationId = "Please select a storage location.";
    }
    if (!formValues.type) {
      newErrors.type = "Please enter type.";
    }
    if (!formValues.condition) {
      newErrors.condition = "Please enter condition.";
    }
    // if (!formValues.assignedCapacity || +formValues.assignedCapacity <= 0) {
    //   newErrors.assignedCapacity = "Assigned Capacity must be greater than 0.";
    // }
    // if (!formValues.maximumCapacity || +formValues.maximumCapacity <= 0) {
    //   newErrors.maximumCapacity = "Maximum Capacity must be greater than 0.";
    // }
    // if (
    //   formValues.assignedCapacity &&
    //   formValues.maximumCapacity &&
    //   formValues.assignedCapacity > formValues.maximumCapacity
    // ) {
    //   newErrors.assignedCapacity =
    //     "Assigned Capacity cannot exceed Maximum Capacity.";
    // }
    // if (!formValues.receivingStatus) {
    //   newErrors.receivingStatus = "Please select a receiving status.";
    // }

    return newErrors;
  };

  const handleFormSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const receivingStatusApi = formValues.receivingStatus.trim().toUpperCase();

    const payload = {
      VARIANT_ID: Number(data?.VariantId),
      VARIANT_CODE: String(data?.VariantCode ?? ""),
      MATERIAL_ID: Number(data?.materialId),
      MATERIAL_TYPE: String(data?.materialType ?? ""),
      STATUS: String(data?.status ?? "ACTIVE"),
      LOW_STOCK_ALERT: Number(data?.lowStock ?? 100),
      HIGH_STOCK_ALERT: Number(data?.highStock ?? 110),
      DESCRIPTION: data?.description ?? "",
      STORAGE_LOCATIONS: [
        {
          LOCATION: String(formValues.location),
          WAREHOUSE_ID: Number(formValues.warehouseId),
          WAREHOUSE_LOCATION_ID: Number(formValues.warehouseLocationId),
          RECEIVING_STATUS: receivingStatusApi,
          TYPE: String(formValues.type),
          CONDITION: String(formValues.condition),
          ASSIGNED_CAPACITY: Number(formValues.assignedCapacity),
          MAXIMUM_CAPACITY: Number(formValues.maximumCapacity),
        },
      ],
    };

    console.log("payload", payload);
    const res = await manageSku(payload).unwrap();
    if (res) {
      setFormValues(initialValues);
      onClose();
      onSuccess();
    }
  };

  return (
    <>
      <BackdropLoader openStates={isLoading || postLoading} />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontWeight: "bold",
            color: theme.palette.primary.main,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>{message?.error?.message}</Typography>

            <Typography
              sx={{ fontSize: "14px", mt: 1, color: theme.palette.grey[500] }}
            >
              {message?.error?.unmapped_skus[0].VARIANT_CODE}
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Select Storage Location
              </Typography>
              <Select
                value={formValues.warehouseLocationId}
                onChange={(e) => {
                  const id = +e.target.value;
                  handleChange("warehouseLocationId", id);

                  const location = (storageLocations?.data || []).find(
                    (item) => item.LOCATION_ID === id,
                  );

                  if (location) {
                    handleChange("location", location.LOCATION_CODE);
                    handleChange("type", location.HIERARCHY_LEVEL ?? "");
                    handleChange("condition", location.CONDITION ?? "");
                  } else {
                    handleChange("location", "");
                    handleChange("type", "");
                    handleChange("condition", "");
                  }
                }}
                fullWidth
                error={!!errors.warehouseLocationId}
              >
                {(storageLocations?.data || []).map((item) => (
                  <MenuItem value={item.LOCATION_ID} key={item.LOCATION_ID}>
                    {item.LOCATION_CODE}
                  </MenuItem>
                ))}
              </Select>
              {errors.warehouseLocationId && (
                <FormHelperText error>
                  {errors.warehouseLocationId}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Type
              </Typography>
              <TextField
                value={formValues.type}
                fullWidth
                disabled
                error={!!errors.type}
                helperText={errors.type}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Condition
              </Typography>
              <TextField
                value={formValues.condition}
                fullWidth
                disabled
                error={!!errors.condition}
                helperText={errors.condition}
              />
            </Grid>

            {/* <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Assigned Capacity
              </Typography>
              <TextField
                type="number"
                value={formValues.assignedCapacity}
                onChange={(e) =>
                  handleChange("assignedCapacity", +e.target.value)
                }
                fullWidth
                error={!!errors.assignedCapacity}
                helperText={errors.assignedCapacity}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Maximum Capacity
              </Typography>
              <TextField
                type="number"
                value={formValues.maximumCapacity}
                onChange={(e) =>
                  handleChange("maximumCapacity", +e.target.value)
                }
                fullWidth
                error={!!errors.maximumCapacity}
                helperText={errors.maximumCapacity}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Receiving Status
              </Typography>
              <Select
                value={formValues.receivingStatus}
                onChange={(e) =>
                  handleChange("receivingStatus", e.target.value)
                }
                fullWidth
              >
                {receivingStatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.receivingStatus && (
                <FormHelperText error>{errors.receivingStatus}</FormHelperText>
              )}
            </Grid> */}
          </Grid>
        </DialogContent>

        <Box display="flex" justifyContent="center" p={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFormSubmit}
            sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
          >
            {" ✓ Map Location"}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default MapBinLocation;
