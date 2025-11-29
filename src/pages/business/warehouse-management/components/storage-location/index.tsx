import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Box,
  Typography,
  InputAdornment,
  InputLabel,
  Button,
  Card,
} from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDown,
  KeyboardArrowRight,
  ArrowForward,
} from "@mui/icons-material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StorageHierarchyImages from "../../../../../assets/images/storage-hierarchy";
import { StorageLocation } from "../../../../../types/storage-location";
import { useGetStorageLocationsQuery } from "../../../../../store/api/warehouse-management/storageLocationApi";
import BackdropLoader from "../../../../../components/third-party/BackdropLoader";

type Filters = {
  status?: string;
  condition?: string;
  availability?: string;
  locationPurpose?: string;
  type?: string;
};


const StorageLocations: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<StorageLocation[]>([]);

  const [status, setStatus] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");
  const [locationPurpose, setPurpose] = useState<string>("");
  const [type, setType] = useState<string>("");

  const { data: storageDetails, isLoading } = useGetStorageLocationsQuery(id);
  
  const toggleExpand = (
    items: StorageLocation[],
    id: number
  ): StorageLocation[] => {
    return items.map((item) => {
      if (item.locationId === id) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return { ...item, children: toggleExpand(item.children, id) };
      }
      return item;
    });
  };

  const handleExpandClick = useCallback(
    (locationId: number) =>
      setData((prevData) => toggleExpand(prevData, locationId)),
    [toggleExpand],
  );

  //  Filters logic
  const applyFilters = useCallback(
    (items: StorageLocation[], filters: Filters): StorageLocation[] =>
      items
        .flatMap((item) => {
          const filteredChildren = item.children
            ? applyFilters(item.children, filters)
            : [];

          const matches =
            (!filters.status ||
              filters.status === "All" ||
              item.status === filters.status) &&
            (!filters.condition ||
              filters.condition === "All" ||
              item.condition === filters.condition) &&
            (!filters.availability ||
              filters.availability === "All" ||
              item.availability === filters.availability) &&
            // (!filters.locationPurpose ||
            //   filters.locationPurpose === "All" ||
            //   item.locationPurpose === filters.locationPurpose) &&
            (!filters.type ||
              filters.type === "All" ||
              item.hierarchyLevel === filters.type);

          if (matches) {
            return {
              ...item,
              ...(filteredChildren.length
                ? { children: filteredChildren }
                : {}),
            };
          }
          return filteredChildren.length ? filteredChildren : [];
        })
        .filter(Boolean),
    [],
  );

  //  Search logic
  const searchStorage = useCallback(
    (items: StorageLocation[], term: string): StorageLocation[] => {
      if (!term) return items;

      return items
        .flatMap((item) => {
          const filteredChildren = item.children
            ? searchStorage(item.children, term)
            : [];
          const matches = item.locationCode
            .toLowerCase()
            .includes(term.toLowerCase());
          if (matches) {
            return {
              ...item,
              ...(filteredChildren.length
                ? { children: filteredChildren }
                : {}),
            };
          }
          return filteredChildren.length ? filteredChildren : [];
        })
        .filter(Boolean);
    },
    [],
  );

  useEffect(() => {
  if (storageDetails) {

    const transformData = (items: any[]): StorageLocation[] => {
      return items.map((item) => ({
        locationId: item.LOCATION_ID,
        locationName: item.LOCATION_NAME,
        locationCode: item.LOCATION_CODE,
        status: item.STATUS,
        condition: item.CONDITION,
        availability: item.AVAILABILITY,
        locationPurpose: item.LOCATION_PURPOSE,
        hierarchyLevel: item.HIERARCHY_LEVEL,
        hierarchyId : item.HIERARCHY_ID,
        availableSpace: item.AVAILABLE_SPACE,
        occupied: item.OCCUPIED,
        maxSize: item.MAX_SIZE,
        fullSize: item.FULL_SIZE,
        parentLocationId: item.PARENT_LOCATION_ID,
        children: item.CHILDREN ? transformData(item.CHILDREN) : [],
        expanded: false, 
      }));
    };

    const formattedData = transformData(storageDetails.data);

     const filterByStatus = (
    storageDetails: StorageLocation[],
    filters: Filters
  ): StorageLocation[] => {
    return storageDetails
      .map((item) => {
        const filteredChildren = item.children
          ? filterByStatus(item.children, filters)
          : [];
        const normalize = (v?: string) =>
  v?.toLowerCase().replace(/[\s\/_-]/g, "");

const matches =
  (!filters.status ||
    filters.status === "All" ||
    normalize(item.status) === normalize(filters.status)) &&

  (!filters.condition ||
    filters.condition === "All" ||
    normalize(item.condition) === normalize(filters.condition)) &&

  (!filters.availability ||
    filters.availability === "All" ||
    normalize(item.availability) === normalize(filters.availability)) &&

  // (!filters.locationPurpose ||
  //   filters.locationPurpose === "All" ||
  //   normalize(item.locationPurpose) === normalize(filters.locationPurpose)) &&

  (!filters.type ||
    filters.type === "All" ||
    normalize(item.hierarchyLevel) === normalize(filters.type));

        if (matches || filteredChildren.length > 0) {
          return {
            ...item,
            ...(filteredChildren.length > 0
              ? { children: filteredChildren }
              : {}),
          };
        }
        return null;
      })
      .filter((item): item is StorageLocation => item !== null);
  };

    const filteredData = filterByStatus(
      searchStorage(formattedData, searchTerm),
      {
        status: status || undefined,
        condition: condition || undefined,
        availability: availability || undefined,
        // locationPurpose: locationPurpose || undefined,
        type: type || undefined,
      }
    );

    setData(filteredData);
  } else {
    setData([]);
  }
}, [searchTerm, storageDetails, status, type, condition, locationPurpose, availability]);


  // const handleExpandClick = (id: number) => {
  //   setData((prevData) => toggleExpand(prevData, id));
  // };

  const moveToLocation = useCallback(
    (item: StorageLocation) => {
      navigate(
        `/${process.env.APP_NAME}/warehouse-management/${id}/storage-location/${item.locationId}`,
      );
    },
    [navigate, id],
  );

  const resetFilters = (): void => {
    setStatus("");
    setCondition("");
    setAvailability("");
    setPurpose("");
    setType("");
  };

  const renderRow = (item: StorageLocation, level = 0): JSX.Element => {
    const imgKey = item.hierarchyLevel
      .toLowerCase()
      .replace(/ /g, "-") as keyof typeof StorageHierarchyImages;


    return (
      <React.Fragment key={item.locationId}>
        <TableRow
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
            },
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <TableCell
            sx={{
              paddingLeft: `${level * 24 + 16}px`,
              py: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {item.children?.length ? (
                <IconButton
                  size="small"
                  onClick={() => handleExpandClick(item.locationId)}
                  sx={{
                    padding: "4px",
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {item.expanded ? (
                    <KeyboardArrowDown />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </IconButton>
              ) : (
                <Box sx={{ width: 32 }} />
              )}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "background.default",
                }}
              >
                <img
                  src={StorageHierarchyImages[imgKey]}
                  alt={item.locationCode}
                  style={{ width: 40, height: 40, objectFit: "cover" }}
                />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.locationCode}
              </Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Chip
              label={item.status}
              size="small"
              color={item.status === "ACTIVE" ? "success" : "default"}
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Chip
              label={item.hierarchyLevel}
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            {item.locationPurpose.toLowerCase() === "store" ? (
              <Chip
                label={item.condition}
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.75rem",
                }}
              />
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                -
              </Typography>
            )}
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Chip
              label={item.locationPurpose}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AccountTreeIcon sx={{ color: "text.secondary", fontSize: 18 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.availableSpace}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.7rem" }}
                >
                  Occ: {item.occupied} | Max: {item.maxSize} | Full:{" "}
                  {item.fullSize}
                </Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell sx={{ py: 2 }}>
            <Chip
              label={item.availability}
              size="small"
              color={item.availability === "Near Full" ? "warning" : "success"}
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          </TableCell>
          {/* <TableCell>  // commented for the demo purpose 
            <IconButton
              size="small"
              sx={{ color: "#F57C00" }}
              onClick={() => moveToLocation(item)}
            >
              <ArrowForward />
            </IconButton>
          </TableCell> */}
        </TableRow>
        {item.children &&
          item.expanded &&
          item.children.map((child) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Box sx={{ width: "100%" }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}>
            Storage Locations
          </Typography>
          
          {/* Filters */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              p: 2.5,
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <TextField
              placeholder="Search by Storage Location Code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                minWidth: { xs: "100%", sm: 300 },
                flex: { xs: "1 1 100%", sm: "0 1 300px" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            {/*  Status Filter */}
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 150 }, flex: { xs: "1 1 100%", sm: "0 1 150px" } }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                displayEmpty
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="IN-ACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
            {/*  Type Filter */}
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 150 }, flex: { xs: "1 1 100%", sm: "0 1 150px" } }}
            >
              <InputLabel>Type</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                {[
                  "All",
                  "Building",
                  "Zone",
                  "Mezzanine",
                  "Floor",
                  "Rack",
                  "Shelf",
                  "Bin",
                ].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/*  Other Filters */}
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 150 }, flex: { xs: "1 1 100%", sm: "0 1 150px" } }}
            >
              <InputLabel>Condition</InputLabel>
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Ambient/Dry">Ambient/Dry</MenuItem>
                <MenuItem value="Cold Storage">Cold Storage</MenuItem>
                <MenuItem value="Frozen">Frozen</MenuItem>
                <MenuItem value="Hazardous">Hazardous</MenuItem>
                <MenuItem value="Humidity Controlled">Humidity Controlled</MenuItem>
                <MenuItem value="Secure/High Value">Secure/High Value</MenuItem>
                <MenuItem value="Outdoor/Weather Resistant">Outdoor/Weather Resistant</MenuItem>
                <MenuItem value="Damaged Goods">Damaged Goods</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 150 }, flex: { xs: "1 1 100%", sm: "0 1 150px" } }}
            >
              <InputLabel>Availability</InputLabel>
              <Select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <MenuItem value="All">All Availability</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Near Full">Near Full</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={resetFilters}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 500,
                minWidth: { xs: "100%", sm: "auto" },
                flex: { xs: "1 1 100%", sm: "0 0 auto" },
              }}
            >
              Reset Filters
            </Button>
          </Box>
        </Box>

        {/*  Table */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 600,
              overflow: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "background.default",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "divider",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "text.secondary",
                },
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Location",
                    "Status",
                    "Type",
                    "Condition",
                    "Purpose",
                    "Available",
                    "Availability",
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        backgroundColor: "background.default",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.5,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      No storage locations found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => renderRow(item))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </>
  );
};

export default StorageLocations;
