import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PurposeSelector from "./purpose-selector";
import {
  Form,
  FormRef,
  Select,
  TextField,
} from "../../../../components/common/form";
import Header from "../../../../components/common/header";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { displayError } from "../../../../utils/helpers";
import { useLazyGetWarehouseDetailsQuery } from "../../../../store/api/warehouse-management/warehouseApi";
import { Heading } from "../../../../components/common/form/style";
import {
  useGetStorageHierarchyQuery,
  useLazyGetStorageHierarchyLocationQuery,
} from "../../../../store/api/warehouse-management/storageHierarchyApi";
import { StorageHierarchyData } from "../../../../types/storage-hierarchy";
import { useManageStorageLocationMutation } from "../../../../store/api/warehouse-management/storageLocationApi";
import { storageLocationSchema } from "../../../../store/api/warehouse-management-validators/warehouse.validator";

const defaultValues = {
  locationName: "",
  hierarchyId: "",
  locationCode: "",
  parentHierarchyName: "",
  parentLocationId: "",
  status: "",
  locationPurpose: "Store",
  condition: "",
  uom: "",
  fullSize: "",
  maxSize: "",
};
interface RouteParams extends Record<string, string | undefined> {
  warehouseId?: string;
  id?: string;
}
const ManageStorageLocation = () => {
  const { warehouseId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formRef = useRef<FormRef>(null);
  const [locationPurpose, setLocationPurpose] = useState("Store");
  const [parentStorageHierarchy, setParentStorageHierarchy] = useState<
    StorageHierarchyData[]
  >([]);

  const [getStorageLocationDetails, { isLoading }] =
    useLazyGetWarehouseDetailsQuery();

  const { data: storageHierarchyData, isLoading: isStorageHierarchyLoading } =
    useGetStorageHierarchyQuery(warehouseId);

  const [
    getStorageHierarchyLocation,
    { data: locations, isLoading: isStorageHierarchyLocationLoading },
  ] = useLazyGetStorageHierarchyLocationQuery();

  const [
    manageStorageLocation,
    { isLoading: isActionLoading, isSuccess, error, isError, data },
  ] = useManageStorageLocationMutation();

  useEffect(() => {
    if (id) {
      getStorageLocationDetails(+id).then((res) => {
        if (res.data) {
          // const {
          //   data: { warehouse },
          // } = res.data;
          // setInitialValues({
          //   warehouseName: warehouse.warehouseName,
          //   warehouseCode: warehouse.warehouseCode,
          //   status: warehouse.status,
          //   address: warehouse.address,
          //   state: warehouse.state,
          //   city: warehouse.city,
          //   pinCode: warehouse.pinCode,
          //   managerId: warehouse.managerId?.toString(),
          // });
        }
      });
    }
  }, [getStorageLocationDetails, id]);

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    } else if (isError) {
      displayError(error);
    }
  }, [isSuccess, isError, error, data, navigate, dispatch]);

  return (
    <>
      <BackdropLoader
        openStates={
          isLoading ||
          isStorageHierarchyLoading ||
          isStorageHierarchyLocationLoading ||
          isActionLoading
        }
      />
      <Grid item xs={12} container alignItems="center">
        <Grid item xs={12}>
          <Header
            onBack={() => navigate(-1)}
            title={`${id ? "Update" : "Add"} Storage Location`}
            buttons={[
              {
                label: "Discard",
                variant: "outlined",
                onClick: () => {
                  navigate(-1);
                },
                icon: <CloseIcon />,
              },
              {
                label: id ? "Save Changes" : "Create",
                color: "primary",
                variant: "contained",
                onClick: () => {
                  formRef.current?.submitForm();
                },
                icon: id ? <SaveIcon /> : <CheckIcon />,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Form
            ref={formRef}
            defaultValues={defaultValues}
            validationSchema={storageLocationSchema}
            onSubmit={(data) => {
              let params: Record<string, string | number | null> = {
                LOCATION_NAME: data.locationName,
                HIERARCHY_ID: data.hierarchyId,
                LOCATION_CODE: data.locationCode,
                PARENT_LOCATION_ID:
                  data.parentLocationId === "" || data.parentLocationId === 0
                    ? null
                    : data.parentLocationId,
                STATUS: data.status?.toUpperCase(),
                LOCATION_PURPOSE: data.locationPurpose?.toUpperCase(),
                AVAILABLE_SPACE: data.availableSpace ?? 0, // optional, if backend requires
              };

              if (data.locationPurpose === "Store") {
                params = {
                  ...params,
                  CONDITION: data.condition?.toUpperCase(),
                  UOM: data.uom?.toUpperCase(),
                  FULL_SIZE: data.fullSize,
                  MAX_SIZE: data.maxSize,
                };
              }

              if (id) {
                manageStorageLocation({ id: +id, ...params });
              } else if (warehouseId) {
                manageStorageLocation({ id: +warehouseId, ...params });
              }
            }}
          >
            <Grid item xs={12}>
              <Heading>Location Information</Heading>
            </Grid>
            <TextField label="Location Name" name="locationName" required />
            <Select
              label="Location Type"
              name="hierarchyId"
              labelKey="LEVEL_NAME"
              valueKey="HIERARCHY_ID"
              data={storageHierarchyData?.data || []}
              required
              onChange={(value) => {
                const data = storageHierarchyData?.data || [];
                const index = data.findIndex(
                  (item) => item.HIERARCHY_ID === +value,
                );
                if (index <= 0) {
                  setParentStorageHierarchy([]);
                } else {
                  setParentStorageHierarchy(data.slice(0, index));
                }
              }}
            />
            <TextField label="Location Code" name="locationCode" required />
            <Select
              label="Parent Type"
              name="parentHierarchyName"
              labelKey="LEVEL_NAME"
              valueKey="LEVEL_NAME"
              data={parentStorageHierarchy}
              onChange={(hierarchyLevel) => {
                getStorageHierarchyLocation({
                  id: warehouseId,
                  hierarchyLevel,
                });
              }}
            />
            <Select
              label="Parent Location"
              name="parentLocationId"
              labelKey="locationCode"
              valueKey="locationId"
              data={(locations?.data || []).map((loc) => ({
                locationId: loc.LOCATION_ID,
                locationCode: loc.LOCATION_CODE,
              }))}
            />

            <Select
              label="Location Status"
              name="status"
              data={["Active", "Inactive"]}
              required
            />
            <PurposeSelector
              label="Location Purpose"
              name="locationPurpose"
              required
              onChange={(value: string) => setLocationPurpose(value)}
            />
            {locationPurpose !== "Split" && (
              <>
                <Select
                  label="Location Condition"
                  name="condition"
                  data={[
                    "Ambient/Dry",
                    "Cold Storage",
                    "Frozen",
                    "Hazardous",
                    "Humidity Controlled",
                    "Secure/High Value",
                    "Outdoor/Weather Resistant",
                    "Damaged Goods",
                  ]}
                  required
                />
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <Heading>Stock Settings</Heading>
                </Grid>
                <Select
                  label="Unit of Measurement"
                  name="uom"
                  data={[
                    "Pcs",
                    "Box",
                    "Packet",
                    "Kilogram (kg)",
                    "Gram (g)",
                    "Liter (l)",
                    "Milliliter (ml)",
                    "Meter (m)",
                    "Centimeter (cm)",
                    "Roll",
                    "Set",
                    "Pallet",
                    "Carton",
                    "Bundle",
                    "NOS",
                  ]}
                  required
                />
                <TextField
                  type="number"
                  label="Storage Full Capacity"
                  name="fullSize"
                  required
                />
                <TextField
                  type="number"
                  label="Storage Max Capacity"
                  name="maxSize"
                  required
                />
              </>
            )}
          </Form>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageStorageLocation;
