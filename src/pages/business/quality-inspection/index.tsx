import { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Badge,
  Select,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
// import Table from "../../../components/common/table";

export default function PendingOrders() {
  const data = [
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
    {
      containerId: "HASU4133970",
      orderId: "POLICK2024050001",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 0,
      onHoldItems: 0,
    },
    {
      containerId: "HASU4133934",
      orderId: "POLICK2024050034",
      type: "PO",
      receivingStatus: "Yet to Receive",
      expectedItems: 150,
      receivedItems: 150,
      onHoldItems: 150,
    },
    {
      containerId: "HASU4139763",
      orderId: "POLICK2024050086",
      type: "MR",
      receivingStatus: "In Progress",
      expectedItems: 10000,
      receivedItems: 10000,
      onHoldItems: 10000,
    },
  ];
  
  const columns = useMemo(
    () => [
      {
        accessorKey: "containerId",
        header: "Container ID",
      },
      {
        accessorKey: "orderId",
        header: "Order ID",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "receivingStatus",
        header: "Receiving Status",
        Cell: ({ cell }: any) => {
          const status = cell.getValue();
          return (
            <Chip
              label={status}
              size="small"
              sx={{
                backgroundColor:
                  status === "Yet to Receive" ? "#E8ECF7" : "#FDECE6",
                color: status === "Yet to Receive" ? "#334878" : "#B75B27",
                fontWeight: 500,
              }}
            />
          );
        },
      },
      {
        accessorKey: "expectedItems",
        header: "Expected Items",
      },
      {
        accessorKey: "receivedItems",
        header: "Received Items",
      },
      {
        accessorKey: "onHoldItems",
        header: "On-Hold Items",
      },
      {
        accessorKey: "action",
        header: "Action",
        enableSorting: false,
        Cell: () => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <Button variant="outlined" size="small">
              Summary
            </Button> */}
            <IconButton size="small">
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 2, backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Pending Orders
        </Typography>
        <Badge
          badgeContent={data.length}
          color="primary"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#334878",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            },
          }}
        />
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          placeholder="Search by Container ID or Order ID"
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#9CA3AF" }} />,
          }}
          sx={{ flex: 1 }}
        />
        <Select size="small" value="All Types" sx={{ minWidth: 140 }}>
          <MenuItem value="All Types">All Types</MenuItem>
          <MenuItem value="PO">PO</MenuItem>
          <MenuItem value="MR">MR</MenuItem>
        </Select>
        <Select size="small" value="All Status" sx={{ minWidth: 140 }}>
          <MenuItem value="All Status">All Status</MenuItem>
          <MenuItem value="Yet to Receive">Yet to Receive</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      {/* <Table columns={columns} data={data} /> */}
    </Box>
  );
}
