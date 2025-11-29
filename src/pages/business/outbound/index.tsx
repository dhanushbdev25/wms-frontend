import {
  Box,
  Stack,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  Chip,
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
import { useGetOutboundOrdersQuery } from "../../../store/api/outbound/api";
import {
  getOutboundStatusColorMap,
  OrderFilter,
  OrderFilterSchema,
  OrderFilterWithAll,
  OrderResponse,
} from "../../../store/api/outbound-validators/outbound.validator";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import useIsMobile from "../../../themes/useIsMobile";
import MobileCardList from "../../../components/common/mobile-components/mobile-cardlist";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { usePostShortCloseMutation } from "../../../store/api/warehouse-management/skuApi";
import Swal from "sweetalert2";

const OutboundIndex: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<OrderFilterWithAll>("New");

  const {
    data: outBoundOrderData,
    isFetching: outboundloading,
    refetch,
  } = useGetOutboundOrdersQuery(
    {
      statuses:
        selectedFilter === "All Orders"
          ? ""
          : selectedFilter === "New"
            ? "NEW"
            : selectedFilter === "In Progress"
              ? "INPROGRESS"
              : selectedFilter === "Completed"
                ? "COMPLETED"
                : selectedFilter === "Short Closed"
                  ? "SHORTCLOSED"
                  : selectedFilter || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const [postShortClose, { isLoading: postLoading }] =
    usePostShortCloseMutation();

  const navigate = useNavigate();
  const theme = useTheme();

  const open = Boolean(anchorEl);

  const orders = [...(outBoundOrderData?.data ?? [])]
    .sort((a, b) => (b.OrderId ?? 0) - (a.OrderId ?? 0))
    .map((item: any) => ({
      ...item,
      Status:
        item.Status === "NEW"
          ? "New"
          : item.Status === "COMPLETED"
            ? "Completed"
            : item.Status === "SHORTCLOSED"
              ? "Short Closed"
              : item.Status === "INPROGRESS"
              ? "In Progress" : item.Status,
    }));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = (value: OrderFilter) => {
    if (OrderFilterSchema.safeParse(value).success) setSelectedFilter(value);
    setAnchorEl(null);
  };

  const rawOptions = (OrderFilterSchema.options as OrderFilter[]).filter(
    (s) => s !== "All Orders",
  );

  const statusOptions: OrderFilterWithAll[] = [
    "All Orders", // always first
    ...rawOptions.filter((s) => s === "New"), // NEW second
    ...rawOptions.filter((s) => s === "In Progress"),
    ...rawOptions.filter((s) => s === "Completed"),
    ...rawOptions.filter((s) => s === "Short Closed"),
    ...rawOptions.filter( (s) => ![ "New", "In Progress", "Completed", "Short Closed", "Short Closed", ].includes(s),
    ), // rest
  ];

  const isMobile = useIsMobile();

  const handleShortClose = async (data : any) => {
    const payload = { ORDERNO: data.OrderNo };

    try {
      const res = await postShortClose(payload).unwrap();
      Swal.fire({
        title: "Short Close Success",
        text: "The order has been short closed successfully.",
        icon: "success",
      });
      refetch();
    } catch (err) {
      Swal.fire({
        title: "Short Close Failed",
        text:
          err?.data?.message ||
          err?.data?.error?.message ||
          "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <BackdropLoader openStates={outboundloading || postLoading} />
      <Header title="Outbound" buttons={[]} />

      <Box sx={{ px: 2, py: 1 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body1" fontWeight={500}>
              {selectedFilter}
            </Typography>
            <Button
              id="Outbound-status-filter"
              data-testid="Outbound-status-filter"
              label={<ExpandMoreIcon />}
              variant="text"
              color="inherit"
              onClick={handleClick}
              sx={{ minWidth: "auto", padding: 0, lineHeight: 1 }}
            />
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} onClick={() => handleClose(status)}>
                {status}
              </MenuItem>
            ))}
          </Menu>

          <Typography
            variant="body2"
            sx={{
              px: 1,
              py: 0.5,
              border: "1px solid",
              borderColor: theme.palette.grey[400],
              borderRadius: "4px",
              fontWeight: "bold",
              minWidth: 36,
              textAlign: "center",
            }}
          >
            {orders.length.toString().padStart(2, "0")}
          </Typography>
        </Stack>

        {isMobile ? (
          <MobileCardList<OrderResponse>
            data={orders}
            search={{
              enable: true,
              placeholder: "Search Order...",
              basedOn: ["OrderNo", "Type"],
            }}
            headers={[
              {
                titleKey: { name: "Order ID", value: "OrderNo" },
                datakey: [{ name: "Type", value: "Type" }],
                statusKey: "Status",
                renderStatus: (status, item) => {
                  const lower = (status ?? "").toString().toLowerCase();

                  const isNew = lower === "new";
                  const isYetToReceive = lower === "short closed";

                  return (
                    <Chip
                      label={status}
                      size="small"
                      sx={{
                        backgroundColor: isNew
                          ? theme.palette.success.light
                          : isYetToReceive
                            ? theme.palette.warning.dark
                            : theme.palette.grey[500],
                        color: theme.palette.common.white,
                        fontSize: "11px",
                        height: 22,
                      }}
                    />
                  );
                },
              },
            ]}
            columns={[
              { title: "Requested", value: "RequestedItems" },
              { title: "Allocated", value: "AllocatedItems" },
              { title: "Dispatched", value: "DispatchedItems" },
            ]}
            actions={[
              {
                label: "ShortClose",
                color: "primary",
                onClick: (item) => handleShortClose(item),
                disabled: (item) =>
                  item.Status?.toLowerCase() === "Short Closed",
              },
              // {
              //   label: "Summary",
              //   color: "primary",
              //   onClick: (item) =>
              //     navigate("summary", { state: { order: item } }),
              // },
              {
                label: "View",
                variant: "outlined",
                endIcon: <ArrowForwardIcon />,
                onClick: (item) =>
                  navigate("dispatch", {
                    state: {
                      orderId: item.OrderId,
                      serialized: item.Serialized,
                    },
                  }),
              },
            ]}
          />
        ) : (
          <Table<OrderResponse> data={orders} globalFilter>
            <Cell type="text" title="Order ID" value="OrderNo" />
            <Cell type="text" title="Type" value="Type" />

            <Cell
              type="custom"
              title="Status"
              render={(cell) => {
                const { Status } = cell.row.original;
                const statusText = (Status ?? "").toString().toLowerCase();

                const isNew = statusText === "new";
                const isYetToReceive = statusText === "short closed";

                return (
                  <Chip
                    label={Status}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: isNew
                        ? theme.palette.success.light
                        : isYetToReceive
                          ? theme.palette.warning.dark
                          : theme.palette.grey[500],
                      color: theme.palette.common.white,
                      fontSize: "12px",
                      height: "24px",
                    }}
                  />
                );
              }}
            />

            <Cell type="text" title="Requested Items" value="RequestedItems" />
            <Cell type="text" title="Allocated Items" value="AllocatedItems" />
            <Cell
              type="text"
              title="Dispatched Items"
              value="DispatchedItems"
            />
            <Cell
              type="custom"
              title="Short Close"
              render={(cell) => {
                const { Status } = cell.row.original;
                const statusText = (Status ?? "").toString().toLowerCase();
                return (
                  <Button
                    id="shortClose"
                    label="Short close"
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      handleShortClose(cell.row.original);
                    }}
                    disabled={statusText === "short closed"}
                  />
                );
              }}
            />

            <ActionCell pinned="right">
              {/* <Button
                id="summary"
                label="Summary"
                variant="contained"
                color="primary"
                size="small"
                onClick={(cell: { row: { original: OrderResponse } }) => {
                  navigate("summary", { state: { order: cell.row.original } });
                }}
              /> */}
              <Action
                id="view-nav-btn"
                type="view"
                onClick={(cell) => {
                  const { OrderId, Serialized, Type, Status } =
                    cell.row.original;

                  if (Status?.toLowerCase() === "short closed") {
                    Swal.fire({
                      icon: "warning",
                      title: "Action Not Allowed",
                      text: "This order is short closed.",
                      confirmButtonText: "OK",
                    });
                    return;
                  }

                  navigate("dispatch", {
                    state: {
                      orderId: OrderId,
                      serialized: Serialized,
                      type: Type,
                    },
                  });
                }}
              />
            </ActionCell>
          </Table>
        )}
      </Box>
    </>
  );
};

export default OutboundIndex;
