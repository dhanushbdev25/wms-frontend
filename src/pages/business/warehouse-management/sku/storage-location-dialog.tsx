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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGetAllStorageLocationsByWarehouseIdQuery } from "../../../../store/api/warehouse-management/skuApi";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { StorageLocationMapping } from "../../../../types/sku";

type MapStorageLocationDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any ,index? :number) => void;
  data: StorageLocationMapping;
  isEditing : boolean;
  setIsEditing: Function;
  storageData:StorageLocationMapping[],
  editIndex: number;
};

const StorageLocationDialog = ({
  open,
  onClose,
  onSubmit,
  data,
  isEditing,
  setIsEditing,
  storageData,
  editIndex,
}: MapStorageLocationDialogProps) => {
  const { data: storageLocations, isLoading } =
    useGetAllStorageLocationsByWarehouseIdQuery(data.warehouseId, {refetchOnMountOrArgChange: true ,
       skip : isEditing },);
// console.log({ storageLocations });
  const [formValues, setFormValues] = useState({
    warehouseId: +data.warehouseId,
    warehouseLocationId: "",
    location: "",
    type: "",
    condition: "",
    assignedCapacity: "",
    maximumCapacity: "",
    receivingStatus: "Open",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && data) {
      setFormValues({
        warehouseId: +data.warehouseId,
        warehouseLocationId: data.warehouseLocationId || "",
        location: data.location || "",
        type: data.type || "",
        condition: data.condition || "",
        assignedCapacity: data.assignedCapacity || "",
        maximumCapacity: data.maximumCapacity || "",
        receivingStatus: data.receivingStatus || "Open",
      });
    } else if (!isEditing) {
      setFormValues({
        warehouseId: +data.warehouseId,
        warehouseLocationId: "",
        location: "",
        type: "",
        condition: "",
        Capacity: "",
        maximumCapacity: "",
        receivingStatus: "Open",
      });
    }
  }, [isEditing, data, open]);

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

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formValues);

    // Reset form
    setFormValues({
      warehouseId: +data.warehouseId,
      warehouseLocationId: "",
      location: "",
      type: "",
      condition: "",
      assignedCapacity: "",
      maximumCapacity: "",
      receivingStatus: "Open",
    });
    setIsEditing(false);
  };

  const handlesave = () => {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // Pass form values and the edit index
  onSubmit(formValues, editIndex);

  // Reset form
  setFormValues({
    warehouseId: +data.warehouseId,
    warehouseLocationId: "",
    location: "",
    type: "",
    condition: "",
    assignedCapacity: "",
    maximumCapacity: "",
    receivingStatus: "Open",
  });
  setIsEditing(false);
};
  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            color: "#F57C00",
          }}
        >
          Map Storage Location
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
            onClick={ isEditing ? handlesave : handleSubmit}
            sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
          >
           {isEditing ? "Update Location" :" ✓ Map Location"}
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default StorageLocationDialog;
