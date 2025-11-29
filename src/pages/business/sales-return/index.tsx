import {
  Box,
  Stack,
  Typography,
  useTheme,
  Menu,
  MenuItem,
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
import TextFieldBase from "../../../components/textfeild/TextFieldBase";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetFetchAllReturnQuery } from "../../../store/api/sales-return/salesReturnApi";
import {
  SalesReturnItem,
  SalesReturnItemSchema,
} from "../../../store/api/sales-return-validators/sales-return.validator";
import useIsMobile from "../../../themes/useIsMobile";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MobileCardList from "../../../components/common/mobile-components/mobile-cardlist";

type SalesReturnFilter = "All Returns" | "Return Approval Pending" | "Approved";

const SalesReturnIndex = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useIsMobile();
  // Fetch data from API
  const { data, isLoading } = useGetFetchAllReturnQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  // Menu & filter state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<SalesReturnFilter>("Return Approval Pending");
  const open = Boolean(anchorEl);

  // Map API response to table rows
  const mappedReturns: SalesReturnItem[] = useMemo(() => {
    if (!data?.data) return [];

    const mapped = data.data.map((item: any) =>
      SalesReturnItemSchema.parse({
        id: item.ORDER_ITEM_ID.toString(),
        returnId: item.SRN_NO,
        sourceOrderId: item.ORDER_NO || null,
        quantity: item.RETURNED_QTY,
        putAwayStatus:
          item.SRN_STATUS === "RETURN_APPROVAL_PENDING"
            ? "Return Approval Pending"
            : item.SRN_STATUS === "APPROVED"
              ? "Approved"
              : item.SRN_STATUS || "Yet to Start",
      }),
    );

    return mapped.slice().reverse(); 
  }, [data]);

  // Filter data
  const filteredReturns = useMemo(() => {
    if (selectedFilter === "All Returns") return mappedReturns;
    return mappedReturns.filter(
      (item) => item.putAwayStatus === selectedFilter,
    );
  }, [mappedReturns, selectedFilter]);

  // Handlers
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value: SalesReturnFilter) => {
    setSelectedFilter(value);
    setAnchorEl(null);
  };

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Header
        title="Sales Return"
        buttons={[
          {
            label: "Create Return",
            variant: "contained",
            onClick: () => navigate("create-Return"),
          },
        ]}
      />

      <Box sx={{ px: 2, py: 1 }}>
        {/* Top Bar */}
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
              label={<ExpandMoreIcon />}
              // startIcon={<ExpandMoreIcon />}
              id="filter-dropdown-btn"
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
            slotProps={{ paper: { sx: { mt: 0.5 } } }}
          >
            {["All Returns", "Return Approval Pending", "Approved"].map(
              (status) => (
                <MenuItem
                  key={status}
                  onClick={() => handleClose(status as SalesReturnFilter)}
                >
                  {status}
                </MenuItem>
              ),
            )}
          </Menu>

          <TextFieldBase
            value={filteredReturns.length.toString().padStart(2, "0")}
            size="small"
            id="salesreturn-count-input"
            aria-label="Filtered sales return count"
            inputProps={{
              readOnly: true,
              sx: {
                width: 36,
                textAlign: "center",
                fontWeight: "bold",
                padding: "2px 4px",
              },
            }}
          />
        </Stack>

        {/* Table */}
        {isMobile ? (
          <MobileCardList<SalesReturnItem>
            data={filteredReturns}
            search={{
              enable: true,
              placeholder: "Search Return ID or Source Order ID",
              basedOn: ["returnId", "sourceOrderId"],
            }}
            headers={[
              {
                titleKey: { name: "Return ID", value: "returnId" },
                datakey: [{ name: "Source Order", value: "sourceOrderId" }],
              },
            ]}
            columns={[
              { title: "Quantity", value: "quantity" },
              {
                title: "Put-Away Status",
                value: "putAwayStatus",
                render: (item) => {
                  const status = (item.putAwayStatus ?? "").toLowerCase();
                  const isApproved = status === "approved";
                  const isPending = status === "return approval pending";

                  return (
                    <Chip
                      label={item.putAwayStatus}
                      size="small"
                      sx={{
                        backgroundColor: isApproved
                          ? theme.palette.success.light
                          : isPending
                            ? theme.palette.grey[500]
                            : theme.palette.warning.main,
                        color: "#fff",
                        fontSize: "11px",
                        height: 22,
                      }}
                    />
                  );
                },
              },
            ]}
            actions={[
              {
                label: "View",
                color: "primary",
                variant: "outlined",
                endIcon: <ArrowForwardIcon />,
                onClick: (item) =>
                  navigate("view", { state: { returnId: item.returnId } }),
              },
            ]}
          />
        ) : (
          <Table<SalesReturnItem>
            data={filteredReturns}
            globalFilter
            // filters={[
            //   {
            //     type: "select",
            //     title: "Put-Away Status",
            //     value: "putAwayStatus",
            //   },
            // ]}
            initialState={{ columnPinning: { right: ["actions"] } }}
            sx={{
              borderCollapse: "collapse",
              "& .MuiTableCell-root": {
                padding: "6px 8px",
                fontSize: "0.85rem",
              },
              "& .MuiTableHead-root": {
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiTableHead-root .MuiTableCell-root": {
                fontWeight: 600,
                color: theme.palette.grey[700],
                fontSize: "0.85rem",
              },
              "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            <Cell type="text" title="Return ID" value="returnId" />
            <Cell
              type="text"
              title="Source Sales Order"
              value="sourceOrderId"
            />
            <Cell type="text" title="Quantity" value="quantity" />
            <Cell
              type="custom"
              title="Put-Away Status"
              render={(cell) => {
                const { putAwayStatus } = cell.row.original;

                const status = (putAwayStatus ?? "").toString().toLowerCase();
                const isApproved = status === "approved";
                const isPending = status === "return approval pending";

                return (
                  <Chip
                    label={putAwayStatus}
                    size="small"
                    variant="outlined"
                    sx={{
                      backgroundColor: isApproved
                        ? theme.palette.success.light
                        : isPending
                          ? theme.palette.grey[500] // RETURN_APPROVAL_PENDING → grey tone
                          : theme.palette.warning.main, // fallback color
                      color: theme.palette.common.white,
                      fontSize: "12px",
                      height: "24px",
                    }}
                  />
                );
              }}
            />

            <ActionCell>
              <Action
                id="view-return-action"
                type="view"
                onClick={(cell: { row: { original: SalesReturnItem } }) => {
                  navigate("view", {
                    state: { returnId: cell.row.original.returnId },
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

export default SalesReturnIndex;
