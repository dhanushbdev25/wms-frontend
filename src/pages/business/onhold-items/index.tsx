import {
  Box,
  Stack,
  Typography,
  useTheme,
  Menu,
  MenuItem,
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
import { z } from "zod";
import { useGetAllOnHoldItemsQuery } from "../../../store/api/onhold-items/onhold-api";

export const OnHoldItemSchema = z.object({
  id: z.string(),
  containerId: z.string(),
  orderId: z.string(),
  type: z.string(),
  serialize: z.boolean(),
  quantity: z.number(),
  // status: z.enum(["Cleared", "Not Cleared"]),
});

export type OnHoldItem = z.infer<typeof OnHoldItemSchema>;

type OnHoldFilter = "All Items" | "Cleared" | "Not Cleared";

const OnHoldIndex = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<OnHoldFilter>("All Items");

  const open = Boolean(anchorEl);

  const { data: onHoldData, isLoading } = useGetAllOnHoldItemsQuery();

  console.log("onHoldData", onHoldData);

  // Map backend fields to frontend fields
  // Map backend fields to frontend fields
  const apiData: OnHoldItem[] =
    onHoldData?.data?.map((item, index) => ({
      id: item.ID.toString(),
      containerId: item.CONTAINER_NO,
      orderId: item.PO_NO,
      type: item.TYPE,
      quantity: item.DAMAGED_ITEM_COUNT ?? 0,
      status: item.STATUS === "QI-PASSED" ? "Cleared" : "Not Cleared",
      serialize: item.SERIALIZED,
    })) ?? [];

  // Filtering logic (currently no status)
  const filteredOrders = useMemo(() => apiData, [apiData]);

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Header title="On-Hold Items" buttons={[]} />

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
              label={<ExpandMoreIcon />}
              // startIcon={<ExpandMoreIcon />}
              id="filter-dropdown-btn"
              variant="text"
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ minWidth: "auto", padding: 0, lineHeight: 1 }}
            />
          </Stack>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            slotProps={{ paper: { sx: { mt: 0.5 } } }}
          >
            <MenuItem onClick={() => setSelectedFilter("Cleared")}>
              Cleared
            </MenuItem>
            <MenuItem onClick={() => setSelectedFilter("Not Cleared")}>
              Not Cleared
            </MenuItem>
            <MenuItem onClick={() => setSelectedFilter("All Items")}>
              All Items
            </MenuItem>
          </Menu>

          <TextFieldBase
            value={filteredOrders.length.toString().padStart(2, "0")}
            size="small"
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

        <Table<OnHoldItem>
          data={filteredOrders}
          globalFilter
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
          }}
        >
          <Cell type="text" title="Container ID" value="containerId" />
          <Cell type="text" title="Order ID" value="orderId" />
          <Cell type="text" title="Type" value="type" />
          <Cell type="text" title="Item Quantity" value="quantity" />
          <Cell
            type="status"
            title="Status"
            value="status"
            colors={{
              Cleared: theme.palette.success.light,
              "Not Cleared": theme.palette.error.light,
            }}
          />

          <ActionCell>
            <Action
              id="view-action-btn"
              type="view"
              onClick={(cell: { row: { original: OnHoldItem } }) => {
                console.log("cell.row.original", cell.row.original);

                navigate("view", {
                  state: {
                    itemId: cell.row.original.id,
                    serialized: cell.row.original.serialize,
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

export default OnHoldIndex;
