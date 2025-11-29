import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../../components/common/header";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../components/common/table";
import Button from "../../../components/common/button/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetSKUbyWarehouseIdQuery,
  usePostCreateAssemblyOrderMutation,
} from "../../../store/api/assembly/assembly-api";
import { useGetAllStorageLocationsByWarehouseIdQuery } from "../../../store/api/warehouse-management/skuApi";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useGetAllWarehousesQuery } from "../../../store/api/warehouse-management/warehouseApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

type ItemRow = {
  skuId: number | "";
  code: string;
  description: string;
  quantity: number;
  uom: string;
};

const NewAssemblyorders = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [date, setDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [warehouse, setWarehouse] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  const [rows, setRows] = useState<ItemRow[]>([
    { skuId: "", code: "", description: "", quantity: 0, uom: "" },
  ]);

  const [formErrors, setFormErrors] = useState({
    date: "",
    warehouse: "",
    rows: "",
  });

  const selectWareHouse = useSelector(
    (state: any) => state.user.selectWareHouse,
  );

  const { data: storageLocations, isLoading: warehouseLoading } = useGetAllWarehousesQuery();
  const { data: skuData, isLoading: skuLoading } =
    useGetSKUbyWarehouseIdQuery(selectWareHouse);

  const [postCreateAssemblyOrder, { isLoading: postLoading }] =
    usePostCreateAssemblyOrderMutation();
  const handleCodeChange = (index: number, value: number) => {
    const selected = skuData?.data?.find((item: any) => item.id === value);
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              skuId: selected?.id || "",
              code: selected?.variantName || "",
              description: selected?.variantName || "",
              uom: selected?.uom || "",
            }
          : row,
      ),
    );
  };

  const handleQuantityChange = (index: number, value: number) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, quantity: value } : row)),
    );
  };

  const handleDelete = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    let errors = { date: "", warehouse: "", rows: "" };
    let isValid = true;

    if (!date) {
      errors.date = "Please select a date.";
      isValid = false;
    }

    if (!warehouse) {
      errors.warehouse = "Please select a warehouse.";
      isValid = false;
    }

    const validRows = rows.filter((r) => r.skuId && r.quantity > 0);
    if (validRows.length === 0) {
      errors.rows =
        "Please add at least one SKU with quantity greater than 0.";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    const skuPayload = rows
      .filter((r) => r.skuId && r.quantity > 0)
      .map((r) => ({
        skuId: r.skuId,
        quantity: r.quantity,
      }));

    const body = {
      orderDate: date?.format("YYYY-MM-DD"),
      warehouseId: Number(warehouse),
      sku: skuPayload,
      comment: comments,
    };

    try {
      const response = await postCreateAssemblyOrder(body).unwrap();
      console.log("Assembly Order Created:", response);
      Swal.fire({
        icon: "success",
        title: "Assembly Order Created",
        confirmButtonColor: "#3085d6",
      });
      navigate(-1);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to create order",
        text: error?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <>
      <BackdropLoader openStates={skuLoading || postLoading || warehouseLoading} />
      <Header
        onBack={() => navigate(-1)}
        title="Assembly"
        buttons={[
          {
            label: "Discard",
            variant: "outlined",
            onClick: () => navigate(-1),
          },
          {
            label: "Create",
            variant: "contained",
            onClick: handleCreate,
          },
        ]}
      />

      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          m: 1,
          p: 2,
          borderRadius: 2,
        }}
      >
        {/* Date & Warehouse Section */}
        <Grid container spacing={2} flexDirection="column" sx={{ mb: 2 }}>
          {/* Date */}
          <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={6}>
            <Typography variant="subtitle2" sx={{ minWidth: 140 }}>
              Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue: any) => setDate(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    error: Boolean(formErrors.date),
                    helperText: formErrors.date,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Warehouse */}
          <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={6}>
            <Typography variant="subtitle2" sx={{ minWidth: 140 }}>
              Warehouse
            </Typography>
            <Box>
              <Select
                size="small"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                error={Boolean(formErrors.warehouse)}
                sx={{ minWidth: 200 }}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Warehouse</em>
                </MenuItem>
                {storageLocations?.data?.map((loc: any) => (
                  <MenuItem key={loc.WAREHOUSE_CODE} value={loc.WAREHOUSE_ID}>
                    {loc.WAREHOUSE_CODE}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.warehouse && (
                <Typography color="error" fontSize={12} mt={0.5}>
                  {formErrors.warehouse}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* SKU Table */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          SKU List
        </Typography>
        {formErrors.rows && (
          <Typography color="error" fontSize={12} sx={{ mb: 1 }}>
            {formErrors.rows}
          </Typography>
        )}

        <Table data={rows} globalFilter={false}>
          <Cell
            type="custom"
            title="Item Code"
            value="code"
            render={(cell) => {
              const rowIndex = cell.row.index;
              return (
                <Select
                  size="small"
                  value={rows[rowIndex].skuId || ""}
                  onChange={(e) =>
                    handleCodeChange(rowIndex, Number(e.target.value))
                  }
                  sx={{ minWidth: 120 }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select SKU</em>
                  </MenuItem>
                  {skuData?.data?.map((item: any) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.variantName}
                    </MenuItem>
                  ))}
                </Select>
              );
            }}
          />

          <Cell
            type="custom"
            title="Description"
            value="description"
            render={(cell) => <span>{cell.getValue<string>()}</span>}
          />

          <Cell
            type="custom"
            title="Quantity"
            value="quantity"
            render={(cell) => {
              const rowIndex = cell.row.index;
              return (
                <TextField
  type="number"
  size="small"
  value={cell.getValue<number>() || ""}
  onKeyDown={(e) => {
    if (e.key === "-" || e.key === "e") e.preventDefault();
  }}
  onChange={(e) => {
    const value = Math.max(0, Number(e.target.value)); 
    handleQuantityChange(rowIndex, value);
  }}
  sx={{ width: 80 }}
  inputProps={{ min: 0 }}
/>

              );
            }}
          />

          <Cell
            type="custom"
            title="UOM"
            value="uom"
            render={(cell) => <span>{cell.getValue<string>()}</span>}
          />

          <ActionCell>
            <Action
              type="delete"
              id="delete"
              onClick={(cell) => handleDelete(cell.row.index)}
            />
          </ActionCell>
        </Table>

        <Button
          label="Add SKU"
          variant="contained"
          sx={{ marginTop: 2 }}
          onClick={() =>
            setRows((prev) => [
              ...prev,
              { skuId: "", code: "", description: "", quantity: 0, uom: "" },
            ])
          }
        />

        {/* Comments Section */}
        <Grid container spacing={2} sx={{ mt: 3 }} flexDirection="column">
          <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2" sx={{ minWidth: 140 }}>
              Comments
            </Typography>
            <TextField
              id="outlined-basic"
              label="Comments"
              variant="outlined"
              size="small"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  height: 40,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default NewAssemblyorders;
