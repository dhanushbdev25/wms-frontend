import { useParams } from "react-router-dom";
import { Box, Chip, Typography } from "@mui/material";
import { Cell, Table } from "../../../../../components/common/table";
import BackdropLoader from "../../../../../components/third-party/BackdropLoader";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";
import { useGetSubLocationsQuery } from "../../../../../store/api/warehouse-management/storageLocationApi";
import { SubLocations } from "../../../../../types/storage-location";
import { useMemo } from "react";

const SubLocationDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetSubLocationsQuery(id, 
    { refetchOnMountOrArgChange: true, }
);

   const formattedData: SubLocations[] = useMemo(() => {
    return (
      data?.data?.map((item: any) => ({
        locationId: item.LOCATION_ID,
        locationCode: item.LOCATION_CODE,
        levelName: item.LEVEL_NAME ?? "Unknown",
        status: item.STATUS?.toLowerCase() === "active" ? "active" : "inactive",
        condition: item.CONDITION ?? "",
        locationPurpose: item.LOCATION_PURPOSE ?? "",
        maxSize: item.MAX_SIZE ?? 0,
        fullSize: item.FULL_SIZE ?? 0,
        occupied: item.OCCUPIED ?? 0,
        availability: item.AVAILABILITY ?? "",
        availableSpace: item.AVAILABLE_SPACE ?? 0,
      })) || []
    );
  }, [data]);

  return (
    <>
      <BackdropLoader openStates={isLoading} />

      <Table<SubLocations> data={formattedData}>
        <Cell
          type="custom"
          title="Location"
          render={(cell) => {
            const { levelName, locationCode } = cell.row.original;
            const img = levelName.toLowerCase().replace(/ /g, "-");

            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  width: "250px",
                }}
              >
                <img
                  src={
                    StorageHierarchyImages[
                      img as keyof typeof StorageHierarchyImages
                    ]
                  }
                  alt={locationCode}
                  style={{ width: 40, height: 40, borderRadius: 4 }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {locationCode}
                </Typography>
              </Box>
            );
          }}
        />

        <Cell
          type="status"
          title="Status"
          value="status"
          colors={{ active: "green", inactive: "red" }}
        />

        <Cell
          type="custom"
          title="Type"
          render={(cell) => {
            const levelName = cell.row.original.levelName;
            return (
              <Chip
                label={levelName}
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor: "#546e7a",
                  color: "white",
                  fontSize: "12px",
                  height: "24px",
                  width: "74px",
                }}
              />
            );
          }}
        />

        <Cell type="text" title="Condition" value="condition" />
        <Cell type="text" title="Purpose" value="locationPurpose" />

        <Cell
          type="custom"
          title="Available"
          render={(cell) => {
            const { availableSpace, occupied, maxSize, fullSize } =
              cell.row.original;
            return (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {availableSpace}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#757575", fontSize: "11px" }}
                >
                  Occ: {occupied} | Max: {maxSize} | Full: {fullSize}
                </Typography>
              </Box>
            );
          }}
        />

        <Cell
          type="custom"
          title="Availability"
          render={(cell) => {
            const availability = cell.row.original.availability;
            return (
              <Chip
                label={availability}
                size="small"
                variant="outlined"
                sx={{
                  backgroundColor:
                    availability === "Near Full" ? "#f6ddb7ff" : "#cbfdcdff",
                  color: availability === "Near Full" ? "#A54800" : "#027700",
                  fontSize: "12px",
                  height: "24px",
                }}
              />
            );
          }}
        />
      </Table>
    </>
  );
};

export default SubLocationDetails;
