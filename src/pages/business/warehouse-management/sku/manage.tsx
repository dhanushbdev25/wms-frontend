import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Form,
  FormRef,
  Select,
  TextField,
} from "../../../../components/common/form";
import { Heading } from "../../../../components/common/form/style";
import Header from "../../../../components/common/header";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import {
  useGetAllSkuQuery,
  useLazyGetSkuLocationDetailQuery,
  useManageSkuMutation,
} from "../../../../store/api/warehouse-management/skuApi";
import { SkuDetail, StorageLocationMapping } from "../../../../types/sku";

import StorageLocationDialog from "./storage-location-dialog";
import StorageLocations from "./storage-locations";
import { skuSchema } from "../../../../store/api/warehouse-management-validators/warehouse.validator";
import { displayError } from "../../../../utils/helpers";
import { DEFAULT_VALUES } from "../../../../types/material";

// Constants

const STATUS_OPTIONS = ["Active", "Inactive"] as const;

const BUTTON_CONFIG = {
  padding: "8px 24px",
  height: "40px",
} as const;

const TYPOGRAPHY_CONFIG = {
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "16px",
} as const;

interface RouteParams extends Record<string, string | undefined> {
  warehouseId?: string;
  id?: string;
}

interface SelectedSku {
  ID: number;
  VARIANT_CODE: string;
  MATERIAL_ID: number | string;
  Material: {
    MATERIAL_TYPE: string;
  };
}

const ManageSku: React.FC = () => {
  const { warehouseId, id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const formRef = useRef<FormRef>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [storageLocations, setStorageLocations] = useState<
    StorageLocationMapping[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRow, setSelectedRow] = useState<StorageLocationMapping>();
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [getSkuLocationDetail, { isLoading: isDetailLoading }] =
    useLazyGetSkuLocationDetailQuery();
  const { data: skuList, isLoading: isSkuLoading } = useGetAllSkuQuery();
  const [manageSku, { isLoading: isActionLoading, isSuccess, isError, error }] =
    useManageSkuMutation();

  const isEditMode = Boolean(id);
  const isLoading = isDetailLoading || isSkuLoading || isActionLoading;
  const skuData = useMemo(() => skuList?.data ?? [], [skuList?.data]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleSubmitForm = () => {
    formRef.current?.submitForm();
  };

  // const handleSubmitForm = useCallback(() => {}, []);

  const handleOpenDialog = useCallback(() => setOpenDialog(true), []);
  const handleCloseDialog = useCallback(() => {
    (setOpenDialog(false), setIsEditing(false));
  }, []);

  const updateFormFields = useCallback(
    (selectedSku: SelectedSku | undefined) => {
      if (!formRef.current) return;

      if (selectedSku) {
        formRef.current.setValue("VariantCode", selectedSku.VARIANT_CODE);
        formRef.current.setValue(
          "MaterialType",
          selectedSku.Material.MATERIAL_TYPE,
        );
        formRef.current.setValue("MaterialId", selectedSku.MATERIAL_ID);
      } else {
        formRef.current.setValue("VariantCode", "");
        formRef.current.setValue("MaterialType", "");
        formRef.current.setValue("MaterialId", "");
      }
    },
    [],
  );

  const handleSkuChange = useCallback(
    (value: string) => {
      const selectedSku = skuData.find(
        (sku: SelectedSku) => sku.ID.toString() === value,
      );
      updateFormFields(selectedSku);
    },
    [skuData, updateFormFields],
  );

  const handleStorageLocationSubmit = (
    values: StorageLocationMapping,
    index?: number,
  ) => {
    setStorageLocations((prev) => {
      let updated: StorageLocationMapping[];

      if (index !== undefined && index !== null) {
        // Update existing row
        updated = [...prev];
        updated[index] = values;
      } else {
        updated = [...prev, values];
      }
      if (formRef.current) {
        formRef.current.setValue("storageLocations", updated);
      }
      return updated;
    });

    setOpenDialog(false);
  };

  const loadSkuDetails = useCallback(async () => {
    if (!id || !warehouseId) return;

    try {
      const result = await getSkuLocationDetail({ warehouseId, id }).unwrap();
      const skuDetailData = result?.data ?? result;

      if (skuDetailData && formRef.current) {
        // Convert numeric fields to string to match StorageLocationMapping
        const storageLocations = (skuDetailData.STORAGE_LOCATIONS ?? []).map(
          (loc) => ({
            location: loc.LOCATION,
            warehouseId: loc.WAREHOUSE_ID,
            warehouseLocationId: loc.WAREHOUSE_LOCATION_ID.toString(),
            stockQuality: loc.STOCK_QUALITY,
            receivingStatus: loc.RECEIVING_STATUS,
            type: loc.TYPE,
            condition: loc.CONDITION,
            assignedCapacity: (loc.ASSIGNED_CAPACITY ?? "").toString(),
            maximumCapacity: (loc.MAXIMUM_CAPACITY ?? "").toString(),
          }),
        );

        formRef.current.setFormValues({
          VariantId: skuDetailData.VARIANT_ID,
          VariantName: skuDetailData.VARIANT_NAME,
          VariantCode: skuDetailData.VARIANT_CODE,
          MaterialId: skuDetailData.MATERIAL_ID,
          MaterialType: skuDetailData.MATERIAL_TYPE,
          status: skuDetailData.STATUS,
          lowStockAlert: skuDetailData.LOW_STOCK_ALERT,
          highStockAlert: skuDetailData.HIGH_STOCK_ALERT,
          description: skuDetailData.DESCRIPTION || "Test",
          storageLocations,
        });

        setStorageLocations(storageLocations);
      } else {
        console.log("else Called");
      }
    } catch (err) {
      displayError((err as Error)?.message || "Failed to load SKU details");
    }
  }, [id, warehouseId, getSkuLocationDetail]);

  const handleFormSubmit = async (values: SkuDetail) => {
    const payload = {
      VARIANT_ID: Number(values.VariantId),
      VARIANT_CODE: values.VariantCode,
      MATERIAL_ID: Number(values.MaterialId),
      MATERIAL_TYPE: values.MaterialType,
      STATUS: values.status,
      LOW_STOCK_ALERT: Number(values.lowStockAlert),
      HIGH_STOCK_ALERT: Number(values.highStockAlert),
      DESCRIPTION: values.description,
      STORAGE_LOCATIONS: storageLocations.map((loc) => ({
        LOCATION: loc.location,
        WAREHOUSE_ID: Number(loc.warehouseId),
        WAREHOUSE_LOCATION_ID: Number(loc.warehouseLocationId),
        RECEIVING_STATUS: loc.receivingStatus,
        TYPE: loc.type,
        CONDITION: loc.condition,
        ASSIGNED_CAPACITY: Number(loc.assignedCapacity),
        MAXIMUM_CAPACITY: Number(loc.maximumCapacity),
        // DESCRIPTION: loc?.description ?? "",
      })),
    };

    if (isEditMode) {
      await manageSku({ id: Number(id), ...payload }).unwrap();
    } else {
      await manageSku(payload).unwrap();
    }
  };

  useEffect(() => {
    if (isEditMode) loadSkuDetails().catch(() => undefined);
  }, [isEditMode, loadSkuDetails]);

  useEffect(() => {
    if (isSuccess) handleGoBack();
    else if (isError && error) displayError(error);
  }, [isSuccess, isError, error, handleGoBack]);

  const headerButtons = [
    {
      label: "Discard",
      variant: "outlined" as const,
      onClick: handleGoBack,
      icon: <CloseIcon />,
    },
    {
      label: isEditMode ? "Save Changes" : "Create",
      color: "primary" as const,
      variant: "contained" as const,
      onClick: handleSubmitForm,
      icon: isEditMode ? <SaveIcon /> : <CheckIcon />,
    },
  ];

  const dialogData: StorageLocationMapping = {
    warehouseId: Number(warehouseId),
    warehouseLocationId: "",
    location: "",
    type: "",
    condition: "",
    assignedCapacity: "",
    maximumCapacity: "",
    receivingStatus: "Open",
  };

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Grid item xs={12} container alignItems="center">
        <Grid item xs={12}>
          <Header
            onBack={handleGoBack}
            title={isEditMode ? "Update SKU" : "Add SKU"}
            buttons={headerButtons}
          />
        </Grid>

        <Grid item xs={12}>
          <Form
            ref={formRef}
            defaultValues={DEFAULT_VALUES}
            validationSchema={skuSchema}
            onSubmit={handleFormSubmit}
          >
            <Grid item xs={12}>
              <Heading>SKU Information</Heading>
            </Grid>

            <Select
              label="SKU"
              name="VariantId"
              labelKey="VARIANT_NAME"
              valueKey="ID"
              data={skuData}
              required
              onChange={handleSkuChange}
            />

            <TextField label="SKU Code" name="VariantCode" required disabled />
            <TextField label="SKU Type" name="MaterialType" required disabled />

            <Select
              label="Status"
              name="status"
              data={[...STATUS_OPTIONS]}
              required
            />

            <Grid item xs={12}>
              <Heading>Stock Alerts</Heading>
            </Grid>

            <TextField
              type="number"
              label="Low Stock Alert"
              name="lowStockAlert"
              required
            />
            <TextField
              type="number"
              label="High Stock Alert"
              name="highStockAlert"
              required
            />

            <Grid item xs={12} sx={{ mb: 2 }}>
              <Heading>Storage Location Mapping </Heading>
            </Grid>

            <StorageLocations
              storageLocations={storageLocations}
              setStorageLocations={setStorageLocations}
              setOpenDialog={setOpenDialog}
              setIsEditing={setIsEditing}
              setSelectedRow={setSelectedRow}
              setEditIndex={setEditIndex}
            />

            <Button
              color="secondary"
              variant="outlined"
              startIcon={<AddIcon />}
              sx={BUTTON_CONFIG}
              onClick={handleOpenDialog}
            >
              <Typography sx={TYPOGRAPHY_CONFIG}>Map New Location</Typography>
            </Button>

            <StorageLocationDialog
              data={
                isEditing ? (selectedRow as StorageLocationMapping) : dialogData
              }
              open={openDialog}
              onClose={handleCloseDialog}
              onSubmit={handleStorageLocationSubmit}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              storageData={storageLocations}
              editIndex={editIndex as number}
            />
          </Form>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageSku;
