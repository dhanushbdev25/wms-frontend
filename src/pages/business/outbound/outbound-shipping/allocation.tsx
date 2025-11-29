import { Box, TextField, Snackbar, Alert, Typography, useTheme } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useEffect, useState } from "react";
import Button from "../../../../components/common/button/Button";
import { Table, Cell } from "../../../../components/common/table";
import { OrderItemRow } from "../../../../store/api/outbound-validators/outbound-types";
import {
  useGetAllOrderItemsQuery,
  usePatchManageOrderAllocationMutation,
} from "../../../../store/api/outbound/api";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useIsMobile from "../../../../themes/useIsMobile";
import MobileCardList from "../../../../components/common/mobile-components/mobile-cardlist";

type AllocationProps = {
  setEnablePickupItem: React.Dispatch<React.SetStateAction<boolean>>;
};

const Allocation: React.FC<AllocationProps> = ({ setEnablePickupItem }) => {
  const locationid = useLocation();
  const { orderId } = locationid.state || {};
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { data: responseData, isLoading: allOrderLoading } =
    useGetAllOrderItemsQuery(orderId, { refetchOnMountOrArgChange: true });

  const [postManageOrderAllocation, { isLoading: isPosting }] =
    usePatchManageOrderAllocationMutation();

  const [newRows, setNewRows] = useState<OrderItemRow[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const allOrderData = responseData?.data;

  useEffect(() => {
    if (allOrderData) {
      const mapped = allOrderData.map((item) => {
        const remainingQty =
          Number(item.REQUESTED_QTY) - Number(item.ALLOCATED_QTY ?? 0);
        const autoAllocation = Math.min(
          remainingQty,
          Number(item.AVAILABLE_QTY ?? 0),
        );
        return {
          id: item.ID,
          sku: item.VARIANT_CODE,
          skuName: item.VARIANT_NAME,
          requestedQty: item.REQUESTED_QTY,
          allocatedQty: item.ALLOCATED_QTY ?? 0,
          availableQty: item.AVAILABLE_QTY,
          newAllocation: autoAllocation,
          stockId: item.STOCK_ID,
          varientId: item.VARIANT_ID,
          orderItemId: item.ORDER_ITEM_ID,
        };
      });
      setNewRows(mapped);
    }
  }, [allOrderData]);

  useEffect(() => {
    if (allOrderData) {
      const hasAllocated = allOrderData.some(
        (item) => (item.ALLOCATED_QTY ?? 0) > 0,
      );
      setEnablePickupItem(hasAllocated);
    }
  }, [allOrderData, setEnablePickupItem]);

  const validateAllocation = (
    value: number,
    row: OrderItemRow,
  ): { valid: boolean; message?: string } => {
    if (value < 0)
      return { valid: false, message: "Allocation cannot be less than 0." };
    if (value > Number(row.requestedQty))
      return {
        valid: false,
        message: "Cannot allocate more than requested quantity.",
      };
    if (value > Number(row.availableQty))
      return {
        valid: false,
        message: "Allocation cannot exceed available quantity.",
      };
    if (value > Number(row.requestedQty) - Number(row.allocatedQty))
      return {
        valid: false,
        message: "Allocation cannot exceed remaining requested quantity.",
      };
    return { valid: true };
  };

  const handleUpdateAllocation = async (row: OrderItemRow) => {
    const payload = [
      {
        orderItemId: row.orderItemId,
        variantId: row.varientId,
        allocatedQty: row.newAllocation,
      },
    ];

    try {
      const res = await postManageOrderAllocation(payload).unwrap();
      if (res) {
        Swal.fire({
          title: "Updated",
          text: "Allocation Updated Successfully",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update allocation",
        icon: "error",
      });
    }
  };

  return (
    <Box>
      <BackdropLoader openStates={allOrderLoading || isPosting} />
      
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
          pb: 2,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: 1.5,
            backgroundColor: theme.palette.primary.main,
            color: "white",
          }}
        >
          <CheckCircleOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Allocation
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
            }}
          >
            Allocate items for the order. Review requested quantities and update allocations as needed.
          </Typography>
        </Box>
      </Box>

      {isMobile ? (
        <MobileCardList<OrderItemRow>
          data={newRows}
          search={{
            enable: true,
            placeholder: "Search SKU / Name",
            basedOn: ["sku", "skuName"],
          }}
          headers={[
            {
              titleKey: { name: "SKU", value: "sku" },
              datakey: [{ name: "SKU Name", value: "skuName" }],
            },
          ]}
          columns={[
            { title: "Requested", value: "requestedQty" },
            { title: "Allocated", value: "allocatedQty" },
            { title: "Available", value: "availableQty" },
            {
              title: "New Allocation",
              value: "newAllocation",
              render: (item: any, idx: any) => (
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  value={item.newAllocation}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const { valid, message } = validateAllocation(value, item);

                    if (!valid && message) {
                      setWarning(message);
                      return;
                    }

                    const updated = [...newRows];
                    updated[idx] = {
                      ...updated[idx],
                      newAllocation: value,
                    };
                    setNewRows(updated);
                  }}
                  sx={{ width: "100%" }}
                  inputProps={{ min: 0 }}
                />
              ),
            },
          ]}
          actions={[
            {
              label: "Update",
              variant: "outlined",
              color: "primary",
              onClick: (item) => handleUpdateAllocation(item),
              disabled: (item) =>
                item.allocatedQty === item.requestedQty ||
                item.requestedQty === item.availableQty,
            },
          ]}
        />
      ) : (
        <Box sx={{ mt: 2 }}>
          <Table<OrderItemRow> data={newRows}>
          <Cell type="text" title="SKU" value="sku" />
          <Cell type="text" title="SKU Name" value="skuName" />
          <Cell type="text" title="Requested Qty" value="requestedQty" />
          <Cell type="text" title="Allocated Qty" value="allocatedQty" />
          <Cell type="text" title="Available Qty" value="availableQty" />

          <Cell
            title="New Allocation"
            value="newAllocation"
            type="custom"
            render={(cell) => {
              const row = cell.row.original;
              const index = cell.row.index;

              return (
                <TextField
                  type="number"
                  size="small"
                  variant="outlined"
                  value={row.newAllocation}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const { valid, message } = validateAllocation(value, row);
                    if (!valid && message) {
                      setWarning(message);
                      return;
                    }
                    const updated = [...newRows];
                    updated[index] = {
                      ...updated[index],
                      newAllocation: value,
                    };
                    setNewRows(updated);
                  }}
                  sx={{ width: 100 }}
                  inputProps={{ min: 0 }}
                />
              );
            }}
          />

          <Cell
            title="Submit"
            type="custom"
            render={(cell) => {
              const row = cell.row.original;
              return (
                <Button
                  id={`create-allocation-${row.id}`}
                  variant="outlined"
                  label="Update"
                  onClick={() => handleUpdateAllocation(row)}
                  disabled={
                    row.allocatedQty === row.requestedQty ||
                    row.availableQty < row.requestedQty
                  }
                />
              );
            }}
          />
        </Table>
        </Box>
      )}

      <Snackbar
        open={Boolean(warning)}
        autoHideDuration={3000}
        onClose={() => setWarning(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" onClose={() => setWarning(null)}>
          {warning}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Allocation;
