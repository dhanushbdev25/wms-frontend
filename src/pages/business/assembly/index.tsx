import {
  Box,
  Stack,
  Menu,
  MenuItem,
  Typography,
  Chip,
  useTheme,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/common/button/Button";
import Header from "../../../components/common/header";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../components/common/table";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { z } from "zod";
import { useGetAssemblyApiQuery } from "../../../store/api/assembly/assembly-api";
import BackdropLoader from "../../../components/third-party/BackdropLoader";


export const OrderFilterSchema = z.enum([
  "YET_TO_RECEIVE",
  "UNDER_APPROVAL",
  "QI_PASSED",
  "ALL_ORDERS",
  "QI_FAILED"
] as const);

export type OrderFilter = z.infer<typeof OrderFilterSchema>;

const FILTER_LABELS: Record<OrderFilter, string> = {
  YET_TO_RECEIVE: "Yet To Receive",
  UNDER_APPROVAL: "Under Approval",
  QI_PASSED: "QI Passed",
  ALL_ORDERS: "All Orders",
  QI_FAILED : "QI Failed"
};

const Assembly = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<OrderFilter>("YET_TO_RECEIVE");
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const { data: assemblyData, isLoading } = useGetAssemblyApiQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value: OrderFilter) => {
    setSelectedFilter(value);
    setAnchorEl(null);
  };


  const allOrders = useMemo(() => {
    if (!assemblyData?.data) return [];

    return [...assemblyData.data]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .map((item) => ({
        id: item.id,
        assemblyOrderId: item.orderNo,
        status:
          item.status === "Yet to Start"
            ? "yet to receive"
            : item.status.toLowerCase() === "finished_goods_under_approval"
            ? "under approval"
            : item.status.toLowerCase() === "qi_passed" ? "QI Passed" :
             item.status.toLowerCase() === "qi_failed" ? "QI Failed" :item.status ,
        requestedItems: item.requestedItems,
        allocatedItems: item.allocatedItems,
        receivedItems: item.receivedItems,
        finishedGoods: item.finishedGoods,
      }))
      // .reverse();
  }, [assemblyData]);

  
  const filteredOrders = useMemo(() => {
    switch (selectedFilter) {
      case "YET_TO_RECEIVE":
        return allOrders.filter(
          (item) => item.status === "yet to receive"
        );

      case "UNDER_APPROVAL":
        return allOrders.filter(
          (item) => item.status === "under approval"
        );

      case "QI_PASSED":
        return allOrders.filter(
          (item) => item.status === "QI Passed"
        );
      case "QI_FAILED":
        return allOrders.filter(
          (item) => item.status === "QI Failed"
        );

      default:
        return allOrders;
    }
  }, [selectedFilter, allOrders]);

  return (
    <>
      <BackdropLoader openStates={isLoading} />

      <Header
        title="Assembly"
        buttons={[
          {
            label: "Create Assembly Order",
            variant: "contained",
            onClick: () => navigate("create-order"),
          },
        ]}
      />

      <Box>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body1" fontWeight={500}>
              {FILTER_LABELS[selectedFilter]}
            </Typography>

            <Button
              label={<ExpandMoreIcon />}
              data-testid="filter-dropdown-btn"
              variant="text"
              color="inherit"
              onClick={handleClick}
              sx={{
                minWidth: "auto",
                padding: 0,
                lineHeight: 1,
              }}
            />
          </Stack>

          {/* Filter Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            slotProps={{ paper: { sx: { mt: 0.5 } } }}
          >

            <MenuItem onClick={() => handleClose("ALL_ORDERS")}>
              All Orders
            </MenuItem>
            <MenuItem onClick={() => handleClose("YET_TO_RECEIVE")}>
              Yet to Receive
            </MenuItem>
            <MenuItem onClick={() => handleClose("UNDER_APPROVAL")}>
              Under Approval
            </MenuItem>
            <MenuItem onClick={() => handleClose("QI_PASSED")}>
              QI Passed
            </MenuItem>
            <MenuItem onClick={() => handleClose("QI_FAILED")}>
              QI Failed            
            </MenuItem>
           
          </Menu>

          {/* Chip with count */}
          <Chip label={filteredOrders.length} />
        </Stack>

       
        <Table data={filteredOrders}>
          <Cell type="text" title="Assembly Order ID" value="assemblyOrderId" />

          <Cell
            type="custom"
            title="Status"
            render={(cell) => {
              const { status } = cell.row.original;
              const normalized = status.toLowerCase();

              console.log("normalized",normalized);
              
              let bgColor;

              if (normalized === "yet to receive") bgColor = theme.palette.grey[500];
              else if (normalized === "in progress") bgColor = theme.palette.primary.light;
              else if (normalized === "completed") bgColor = theme.palette.success.light;
              else if (normalized === "under approval") bgColor = theme.palette.warning.light;
              else if (normalized === "qi passed") bgColor = theme.palette.success.light;
              else if (normalized === "qi failed") bgColor = theme.palette.error.light;
              else bgColor = theme.palette.grey[400];

              return (
                <Chip
                  label={status}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: bgColor,
                    color: theme.palette.common.white,
                    fontSize: "12px",
                    height: "24px",
                    textTransform: "capitalize",
                  }}
                />
              );
            }}
          />

          <Cell type="text" title="Requested Items" value="requestedItems" />
          <Cell type="text" title="Allocated Items" value="allocatedItems" />
          <Cell type="text" title="Finished Goods" value="finishedGoods" />

          <ActionCell>
            <Action
              id="view-action-btn"
              type="view"
              onClick={(cell) => {
                const rowId = cell?.row?.original?.id;
                navigate("items", {
                  state: {
                    assemblyOrderId: cell?.row?.original?.assemblyOrderId,
                    id: rowId,
                  },
                });
              }}
            />
          </ActionCell>
        </Table>
      </Box>
    </>
  );
};

export default Assembly;
