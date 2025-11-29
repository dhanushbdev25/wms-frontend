import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Avatar,
  Grid,
  Chip,
  Link,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { WarehouseDetails } from "../../../../types/warehouse";

type Props = WarehouseDetails & { id: number };

const Overview = (data: Props) => {
  const navigate = useNavigate();

  const InfoRow = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", minWidth: 160, mr: 2 }}>
        {icon && (
          <Box sx={{ mr: 1, color: "text.secondary", display: "flex" }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        {typeof value === "string" ? (
          <Typography variant="body1" sx={{ fontWeight: 400, color: "text.primary" }}>
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  backgroundColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <WarehouseOutlinedIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.5 }}
                >
                  {data.WAREHOUSE_CODE}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {data.WAREHOUSE_NAME}
                </Typography>
                <Chip
                  label={data.STATUS}
                  size="small"
                  color={data.STATUS === "Active" ? "success" : "default"}
                  sx={{
                    borderRadius: 1,
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() =>
                navigate(
                  `/${process.env.APP_NAME}/warehouse-management/${data.id}/edit`,
                )
              }
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Edit Warehouse
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Details Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
              >
                Warehouse Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <InfoRow
                  label="Warehouse Type"
                  value={`${data.WAREHOUSE_TYPE} Warehouse`}
                />
                <InfoRow
                  label="Status"
                  value={
                    <Chip
                      label={data.STATUS}
                      size="small"
                      color={data.STATUS === "Active" ? "success" : "default"}
                      sx={{
                        borderRadius: 1,
                        fontWeight: 500,
                        fontSize: "0.75rem",
                      }}
                    />
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
              >
                Location Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <InfoRow
                  label="Address"
                  value={data.ADDRESS}
                  icon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />}
                />
                <InfoRow label="City" value={data.CITY} />
                <InfoRow label="State" value={data.STATE} />
                <InfoRow label="Pincode" value={data.PIN_CODE} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
              >
                Manager Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "primary.main",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                  }}
                >
                  {data.Manager.USERNAME.toString()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {data.Manager.USERNAME}
                  </Typography>
                  <Link
                    href={`mailto:${data.Manager.EMAIL}`}
                    underline="hover"
                    color="primary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.875rem",
                    }}
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 16 }} />
                    {data.Manager.EMAIL}
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
