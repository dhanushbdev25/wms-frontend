import React from "react";
import { Box, Typography, Chip, Divider } from "@mui/material";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";
import { LocationOverview } from "../../../../../types/storage-location";

type Props = {
  data: LocationOverview;
};

const DetailItem = ({
  label,
  value,
  subValue,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  subValue?: string | null;
  icon?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
    {icon && (
      <img
        src={icon}
        alt={label}
        style={{ width: 24, height: 24, marginRight: 8 }}
      />
    )}
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="text.secondary">
          {subValue}
        </Typography>
      )}
    </Box>
  </Box>
);

const renderParentData = (
  parentLocationCode: string,
  parentLocationHierarchyLevel: string
) => {
  const img = parentLocationHierarchyLevel.toLowerCase().replace(/ /g, "-");

  return (
    <>
      <Divider orientation="vertical" flexItem />
      <DetailItem
        label="Parent Location"
        value={parentLocationCode}
        subValue={parentLocationHierarchyLevel}
        icon={
          StorageHierarchyImages[img as keyof typeof StorageHierarchyImages]
        }
      />
    </>
  );
};

const StorageLocationDetails = ({ data }: Props) => {
  const img = data.hierarchyLevel.toLowerCase().replace(/ /g, "-");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        flex: 1,
      }}
    >
      {/* Left icon & title */}
      <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
        <img
          src={
            StorageHierarchyImages[img as keyof typeof StorageHierarchyImages]
          }
          alt={data.hierarchyLevel}
          style={{ width: 50, height: 50, marginRight: 12 }}
        />

        <Typography variant="h6" fontWeight={600} color="primary.dark">
          {data.locationCode}
        </Typography>
      </Box>

      {/* Details grid */}
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        {/* Detail item */}
        <DetailItem
          label="Location Type"
          value={data.hierarchyLevel}
          icon={
            StorageHierarchyImages[img as keyof typeof StorageHierarchyImages]
          }
        />
        <Divider orientation="vertical" flexItem />
        <DetailItem label="Purpose" value={data.locationPurpose} />
        {data.locationPurpose === "Store" && (
          <>
            <Divider orientation="vertical" flexItem />
            <DetailItem label="Condition Type" value={data.condition} />
            <Divider orientation="vertical" flexItem />
            <DetailItem label="UoM" value={data.uom} />
          </>
        )}
        {data.parentLocationCode && data.parentLocationHierarchyLevel && (
          <>
            {renderParentData(
              data.parentLocationCode,
              data.parentLocationHierarchyLevel
            )}
          </>
        )}

        <Divider orientation="vertical" flexItem />
        <DetailItem
          label={data.status}
          value={<Chip label={data.status} color="primary" size="small" />}
        />
        <Divider orientation="vertical" flexItem />
        <DetailItem
          label="Availability Status"
          value={
            <Chip label={data.availability} color="success" size="small" />
          }
        />
      </Box>
    </Box>
  );
};

export default StorageLocationDetails;
