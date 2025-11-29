import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  IconButton,
  Typography,
  Radio,
  ListItemText,
  TextField,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { StorageHierarchy } from "../../../../../types/storage-hierarchy";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";

type ChildProps = {
  index: number;
  storage: StorageHierarchy[];
  setStorage: React.Dispatch<React.SetStateAction<StorageHierarchy[]>>;
};

const steps = [
  "Building",
  "Floor",
  "Zone",
  "Mezzanine",
  "Rack",
  "Shelf",
  "Bin",
  "Others",
];

const EditStorageAddModel: React.FC<ChildProps> = ({
  index,
  storage,
  setStorage,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");
  const [selectedStep, setSelectedStep] = useState<string>("");

  const handleChange = (event: SelectChangeEvent<string>): void => {
    setValue(event.target.value);
    const step = steps.find((s) => s === event.target.value);
    if (step) setSelectedStep(step);
  };

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setValue("");
    setNewLabel("");
    setSelectedStep("");
  };

  //  Non-mutating array update
  const handleAddStorage = () => {
    const labelToUse = newLabel || selectedStep;
    if (!labelToUse) return;

    const newItem: StorageHierarchy = {
      hierarchyId: 0,
      levelName: labelToUse,
      levelOrder: storage.length,
    };

    const newStorage = [
      ...storage.slice(0, index + 1),
      newItem,
      ...storage.slice(index + 1),
    ];

    setStorage(newStorage);
  };

  return (
    <>
      <AddOutlinedIcon
        onClick={handleClickOpen}
        sx={{ color: "#555", fontSize: "16px", cursor: "pointer" }}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Select Location Type
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "#888" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth size="small">
            <Typography>Location Type</Typography>
            <Select
              labelId="select-label"
              value={value}
              onChange={handleChange}
              renderValue={(selected) => selected}
            >
              {steps.map((step, index) => {
                const isDisabled = storage.some(
                  (s: StorageHierarchy) => s.levelName === step
                );

                const img = step.toLowerCase().replace(/ /g, "-");

                return (
                  <MenuItem key={index} value={step} disabled={isDisabled}>
                    <Radio checked={value === step} disabled={isDisabled} />
                    <img
                      src={
                        StorageHierarchyImages[
                          img as keyof typeof StorageHierarchyImages
                        ]
                      }
                      alt={step}
                      style={{
                        height: "18px",
                        borderRadius: "4px",
                        opacity: isDisabled ? 0.4 : 1,
                      }}
                    />
                    <ListItemText
                      primary={step}
                      sx={{ ml: 1, color: isDisabled ? "gray" : "inherit" }}
                    />
                  </MenuItem>
                );
              })}
            </Select>
            {value === "Others" && (
              <TextField
                id="outlined-basic"
                label="Others"
                variant="outlined"
                sx={{ mt: 1 }}
                onChange={(e) => {
                  setNewLabel(e.target.value);
                }}
              />
            )}
          </FormControl>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => {
              handleAddStorage();
              handleClose();
            }}
            variant="contained"
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditStorageAddModel;
