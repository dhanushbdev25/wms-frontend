import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import EditStorageHierarchy from "./edit";
import ViewStorageHierarchy from "./view";
import {
  useGetStorageHierarchyQuery,
  useManageStorageHierarchyMutation,
} from "../../../../../store/api/warehouse-management/storageHierarchyApi";
import BackdropLoader from "../../../../../components/third-party/BackdropLoader";
import { type StorageHierarchy } from "../../../../../types/storage-hierarchy";
import { displayError } from "../../../../../utils/helpers";

const DEFAULT_HIERARCHY: StorageHierarchy = {
  hierarchyId: 0,
  levelOrder: 0,
  levelName: "Warehouse",
};

const EDIT_ICON_SIZE = 20;

const StorageHierarchyComponent = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  const [storage, setStorage] = useState<StorageHierarchy[]>([]);
  const [openEdit, setOpenEdit] = useState(false);

  const { data, isLoading } = useGetStorageHierarchyQuery(
    id,
    // { refetchOnMountOrArgChange: true, }
  );

  const [
    manageStorageHierarchy,
    { isLoading: isActionLoading, error, isError },
  ] = useManageStorageHierarchyMutation();

  useEffect(() => {
    if (isError) {
      displayError(error);
    }
  }, [isError, error]);

  const setData = useCallback((): void => {
    const hierarchyList: StorageHierarchy[] = [
      DEFAULT_HIERARCHY,
      ...(data?.data ?? []).map((item) => ({
        hierarchyId: item.HIERARCHY_ID,
        levelOrder: item.LEVEL_ORDER,
        levelName: item.LEVEL_NAME,
      })),
    ];
    setStorage(hierarchyList);
  }, [data]);

  useEffect(() => {
    if (id && data) {
      setData();
    }
  }, [data, id, setData]);

  const toggleEdit = (): void => setOpenEdit((prev) => !prev);

  const handleExit = (): void => {
    setData();
    toggleEdit();
  };

  const handleApplyChanges = (): void => {
    const filteredHierarchies = storage.filter(
      (item) => item.levelName.toUpperCase() !== "WAREHOUSE",
    );

    const isUpdate = (data?.data?.length ?? 0) > 0;

    const HIERARCHIES = filteredHierarchies.map((item) => ({
      HIERARCHY_ID: item.hierarchyId ?? 0,
      LEVEL_ORDER: item.levelOrder,
      LEVEL_NAME: item.levelName,
    }));

    if (HIERARCHIES.length === 0) {
      Swal.fire({
        text: "At least one Storage Location is required",
        icon: "error",
        title: "Error",
      });
    } else {
      manageStorageHierarchy({
        action: isUpdate ? "update" : "create",
        id: Number(id) || 0,
        HIERARCHIES,
      });

      toggleEdit();
    }
  };

  const renderActionButtons = (): JSX.Element => {
    if (openEdit) {
      return (
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={handleExit}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<ModeEditOutlineOutlinedIcon sx={{ fontSize: EDIT_ICON_SIZE }} />}
            onClick={() => handleApplyChanges()}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Apply Changes
          </Button>
        </Box>
      );
    }
    return (
      <Button
        variant="outlined"
        startIcon={<ModeEditOutlineOutlinedIcon sx={{ fontSize: EDIT_ICON_SIZE }} />}
        onClick={toggleEdit}
        sx={{
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        Edit Hierarchy
      </Button>
    );
  };

  return (
    <>
      <BackdropLoader openStates={isLoading || isActionLoading} />
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            Storage Hierarchy
          </Typography>
          {renderActionButtons()}
        </Box>

        {openEdit ? (
          <EditStorageHierarchy storage={storage} setStorage={setStorage} />
        ) : (
          <ViewStorageHierarchy storage={storage} />
        )}
      </Box>
    </>
  );
};

export default StorageHierarchyComponent;
