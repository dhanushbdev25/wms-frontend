import {
  Box,
  Stack,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../components/common/button/Button";
import Header from "../../../components/common/header";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../components/common/table";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { useGetInboundOrdersQuery } from "../../../store/api/Inbound/inboundApi";
import {
  InboundOrder,
  InboundOrderRow,
  OrderFilter,
} from "../../../store/api/inbound-validators/inbound.validator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MobileCardList from "../../../components/common/mobile-components/mobile-cardlist";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useIsMobile from "../../../themes/useIsMobile";
import { useSelector } from "react-redux";

const Index = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("New");
  const theme = useTheme();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value: OrderFilter) => {
    setSelectedFilter(value);
    setAnchorEl(null);
  };

  const {
    data: inboundData,
    isLoading: isInboundLoading,
    refetch,
  } = useGetInboundOrdersQuery(
    {
      statuses:
        selectedFilter === "All Orders"
          ? ""
          : selectedFilter === "GRN Under Approval"
            ? "GRNUNDERAPPROVAL"
            : selectedFilter === "LTI Under Approval"
              ? "LTIUNDERAPPROVAL"
              : selectedFilter === "Approved"
                ? "APPROVED"
                : selectedFilter === "New"
                  ? "New"
                  : selectedFilter || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );
  const selectWareHouse = useSelector(
    (state: any) => state.user.selectWareHouse,
  );
  useEffect(() => {
    refetch();
  }, [selectWareHouse]);
  const [orders, setOrders] = useState<InboundOrder[]>([]);

  useEffect(() => {
    if (inboundData?.data) {
      const orders = [...(inboundData?.data ?? [])].sort(
        (a, b) => (b.ID ?? 0) - (a.ID ?? 0),
      );
      setOrders(orders);
    }
  }, [inboundData]);

  const filteredOrders = useMemo(() => {
    const allOrders: InboundOrderRow[] =
      orders.map((item: InboundOrder) => ({
        id: item.ID,
        containerId: item.CONTAINER_NO,
        orderId: item.ORDER_NO,
        orderType: item.TYPE,
        status:
          item.STATUS === "GRNUNDERAPPROVAL"
            ? "GRN Under Approval"
            : item.STATUS === "LTIUNDERAPPROVAL"
              ? "LTI Under Approval"
              : item.STATUS === "APPROVED"
                ? "Approved"
                : item.STATUS === "NEW"
                  ? "New"
                  : item.STATUS,
        expectedItems: item.EXPECTED_ITEMS,
        receivedItems: item.RECEIVED_ITEMS,
        onHoldItems: item.ON_HOLD_ITEMS,
      })) || [];
    return allOrders;
  }, [selectedFilter, orders]);

  const isMobile = useIsMobile();

  // Helper to map status -> SAP Fiori colors
  const getStatusColor = (status?: string) => {
    const lowered = (status ?? "").toString().toLowerCase().trim();

    if (lowered === "qi-passed") return "#107E3E"; // SAP Fiori Success
    if (lowered === "approved") return "#107E3E"; // SAP Fiori Success
    if (lowered === "new") return "#FFB300"; // SAP Fiori Warning
    if (lowered === "grn under approval") return "#F57C00"; // Professional Yellow/Orange Info
    if (lowered === "lti under approval") return "#F57C00"; // Professional Yellow/Orange Info
    // fallback
    return "#E9730C"; // SAP Fiori Error
  };

  const getStatusTextColor = (status?: string) => {
    const lowered = (status ?? "").toString().toLowerCase().trim();
    if (lowered === "new") return "#32363A"; // Dark text for yellow background
    return "#FFFFFF"; // White text for other backgrounds
  };

  return (
    <>
      <BackdropLoader openStates={isInboundLoading} />
      <Header title="Inbound" buttons={[]} />

      <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
        {/* Filter Section - SAP Fiori Card Style */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            padding: 2,
            marginBottom: 2,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
            border: "1px solid #D9D9D9",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: 2 }}
          >
            {/* Filter Dropdown */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: "#6A6D70",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                Filter:
              </Typography>
              <Button
                label={
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ minWidth: 0 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#32363A",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    >
                      {selectedFilter}
                    </Typography>
                    <ExpandMoreIcon
                      sx={{
                        fontSize: "1rem",
                        color: "#6A6D70",
                      }}
                    />
                  </Stack>
                }
                id="filter-dropdown-btn"
                variant="outlined"
                color="inherit"
                onClick={handleClick}
                sx={{
                  minWidth: "auto",
                  padding: "6px 12px",
                  borderColor: "#D9D9D9",
                  borderRadius: "4px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#F57C00",
                    backgroundColor: "#FFF3E0",
                  },
                }}
              />
            </Stack>

            {/* Orders Count Badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#6A6D70",
                  fontSize: "0.875rem",
                }}
              >
                Total Orders:
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#FFF3E0",
                  color: "#F57C00",
                  borderRadius: "12px",
                  padding: "4px 12px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  minWidth: 40,
                  textAlign: "center",
                }}
              >
                {filteredOrders?.length.toString().padStart(2, "0")}
              </Box>
            </Box>
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: "8px",
                  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
                  border: "1px solid #D9D9D9",
                  minWidth: 200,
                },
              },
            }}
          >
            <MenuItem
              onClick={() => handleClose("All Orders")}
              sx={{
                fontSize: "0.875rem",
                padding: "10px 16px",
                "&:hover": {
                  backgroundColor: "#F5F6FA",
                },
              }}
            >
              All Orders
            </MenuItem>
            <MenuItem
              onClick={() => handleClose("New")}
              sx={{
                fontSize: "0.875rem",
                padding: "10px 16px",
                "&:hover": {
                  backgroundColor: "#F5F6FA",
                },
              }}
            >
              New
            </MenuItem>
            <MenuItem
              onClick={() => handleClose("Approved")}
              sx={{
                fontSize: "0.875rem",
                padding: "10px 16px",
                "&:hover": {
                  backgroundColor: "#F5F6FA",
                },
              }}
            >
              Approved
            </MenuItem>
            <MenuItem
              onClick={() => handleClose("GRN Under Approval")}
              sx={{
                fontSize: "0.875rem",
                padding: "10px 16px",
                "&:hover": {
                  backgroundColor: "#F5F6FA",
                },
              }}
            >
              GRN Under Approval
            </MenuItem>
            <MenuItem
              onClick={() => handleClose("LTI Under Approval")}
              sx={{
                fontSize: "0.875rem",
                padding: "10px 16px",
                "&:hover": {
                  backgroundColor: "#F5F6FA",
                },
              }}
            >
              LTI Under Approval
            </MenuItem>
          </Menu>
        </Box>

        {/* Orders Table/Card List */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
            border: "1px solid #D9D9D9",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            <Box sx={{ p: 2 }}>
              <MobileCardList<InboundOrderRow>
                data={filteredOrders}
                search={{
                  enable: true,
                  placeholder: "Search Order ID or Container No",
                  basedOn: ["orderId", "containerId"],
                }}
                headers={[
                  {
                    titleKey: { name: "Container no", value: "containerId" },
                    datakey: [{ name: "Order Id", value: "orderId" }],
                    statusKey: "status",
                    renderStatus: (status) => {
                      const bgColor = getStatusColor(status);
                      const textColor = getStatusTextColor(status);
                      return (
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            backgroundColor: bgColor,
                            color: textColor,
                            fontSize: "0.75rem",
                            height: 24,
                            fontWeight: 500,
                            borderRadius: "4px",
                            border: "none",
                          }}
                        />
                      );
                    },
                  },
                ]}
                columns={[
                  { title: "Order Type", value: "orderType" },
                  { title: "Received Items", value: "receivedItems" },
                ]}
                actions={[
                  {
                    label: "View",
                    color: "primary",
                    variant: "outlined",
                    endIcon: <ArrowForwardIcon />,
                    onClick: (item) =>
                      navigate("putaway", { state: { packageId: item.id } }),
                  },
                ]}
              />
            </Box>
          ) : (
            <Table<InboundOrderRow>
              data={filteredOrders}
              globalFilter
              initialState={{
                columnPinning: { right: ["actions"] },
              }}
              sx={{
                padding: 0,
                boxShadow: "none",
                border: "none",
              }}
            >
            <Cell type="text" title="Container ID" value="containerId" />
            <Cell type="text" title="Order ID" value="orderId" />
            <Cell type="text" title="Type" value="orderType" />

            <Cell
              type="custom"
              title="Receiving Status"
              value="status"
              render={(cell) => {
                const { status } = cell.row.original;
                const bgColor = getStatusColor(status);
                const textColor = getStatusTextColor(status);

                return (
                  <Chip
                    label={status as string}
                    size="small"
                    sx={{
                      backgroundColor: bgColor,
                      color: textColor,
                      fontSize: "0.75rem",
                      height: 24,
                      fontWeight: 500,
                      borderRadius: "4px",
                      border: "none",
                    }}
                  />
                );
              }}
            />

            <Cell type="text" title="Expected Items" value="expectedItems" />
            <Cell type="text" title="Received Items" value="receivedItems" />

            <ActionCell>
              {/* <Button
                label="Summary"
                variant="contained"
                color="primary"
                size="small"
                onClick={(cell: { row: { original: InboundOrderRow } }) => {
                  navigate("summary", {
                    state: { packageId: cell.row.original.id },
                  });
                }}
              /> */}
              <Action
                id="view-action-btn"
                type="view"
                onClick={(cell: { row: { original: InboundOrderRow } }) => {
                  navigate("putaway", {
                    state: { packageId: cell.row.original.id },
                  });
                }}
              />
            </ActionCell>
          </Table>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Index;
