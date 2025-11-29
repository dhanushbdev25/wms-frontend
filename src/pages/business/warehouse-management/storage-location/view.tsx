import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import Tabs from "../components/tabs";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import Header from "../../../../components/common/header";
import SubLocationDetails from "../components/subLocationDetails";
import SkuDetails from "../components/skuDetails";
import LocationOverviewDetails from "../components/location-overview";
import { useGetLocationOverviewQuery } from "../../../../store/api/warehouse-management/storageLocationApi";
import { LocationOverview } from "../../../../types/storage-location";

const options = [
  {
    key: "locationOverview",
    label: "Location Overview",
    icon: <WarehouseOutlinedIcon />,
  },
  { key: "skuDetails", label: "SKU Details", icon: <ListIcon /> },
  {
    key: "subLocationDetails",
    label: "Sub Location Details",
    icon: <StorageOutlinedIcon />,
  },
];

const ViewStorageLocation = () => {
  const { warehouseId, id } = useParams();
  const navigate = useNavigate();
  const [locationOverviewData, setLocationOverviewData] =
    useState<LocationOverview | null>(null);
  const [selected, setSelected] = useState<string>("locationOverview");
  const { data, isLoading, isSuccess } = useGetLocationOverviewQuery(id, 
  //   { //   refetchOnMountOrArgChange: true, // }
);

 useEffect(() => {
  if (isSuccess && data?.data) {
    // const raw = data.data;
    const raw: any = data.data;
    const transformed: LocationOverview = {
      locationId: raw?.LOCATION_ID,
      locationName: raw?.LOCATION_NAME,
      locationCode: raw.LOCATION_CODE,
      status: raw.STATUS,
      condition: raw.CONDITION,
      availability: raw.AVAILABILITY,
      locationPurpose: raw.LOCATION_PURPOSE,
      hierarchyLevel: raw.HIERARCHY_LEVEL,
      hierarchyId: raw.HIERARCHY_ID,
      hierarchyCounts: raw.HIERARCHY_COUNTS,
      parentLocationId: raw.PARENT_LOCATION_ID,
      parentLocationCode: raw.PARENT_LOCATION_CODE,
      parentLocationHierarchyLevel: raw.PARENT_LOCATION_HIERARCHY_LEVEL,
      availableSpace: raw.AVAILABLE_SPACE,
      occupied: raw.OCCUPIED,
      maxSize: raw.MAX_SIZE,
      fullSize: raw.FULL_SIZE,
      numberOfMaterialVariants: raw.NUMBER_OF_MATERIAL_VARIANTS,
      numberOfSublocations: raw.NUMBER_OF_SUBLOCATIONS,
      uom: raw.UOM,
    };

    setLocationOverviewData(transformed);
  }
}, [isSuccess, data]);

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      {locationOverviewData && (
        <>
          <Header
            onBack={() => {
              navigate(-1);
            }}
            title={locationOverviewData.locationCode}
            buttons={[
              {
                label: "Recent Activities",
                variant: "outlined",
                onClick: () => {},
              },
              {
                label: "Edit Storage",
                variant: "outlined",
                icon: <EditIcon />,
                onClick: () => {
                  navigate(
                    `/${process.env.APP_NAME}/warehouse-management/${warehouseId}/sku/${id}/edit`,
                  );
                },
              },
            ]}
          />
          <Container
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginTop: "20px",
              paddingLeft: { xs: 0, md: 0 },
              paddingRight: { xs: 0 },
              width: "100%",
            }}
          >
            <Tabs
              options={options}
              selected={selected}
              setSelected={setSelected}
            />
            {selected === "locationOverview" && (
              <LocationOverviewDetails data={locationOverviewData} />
            )}
            {selected === "skuDetails" && <SkuDetails />}
            {selected === "subLocationDetails" && <SubLocationDetails />}
          </Container>
        </>
      )}
    </>
  );
};

export default ViewStorageLocation;
