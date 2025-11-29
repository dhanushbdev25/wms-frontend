import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  Grid,
  Typography,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import Header from "../../../components/common/header";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../components/common/table";
import { WarehouseImage } from "../../../assets/images/warehouse-management";
import { useGetAllWarehousesQuery } from "../../../store/api/warehouse-management/warehouseApi";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { WarehouseData } from "../../../types/warehouse";
import { useState, useMemo } from "react";

interface WarehouseProps {
  name: string;
  code: string;
}

const Warehouse: React.FC<WarehouseProps> = ({ name, code }) => {
  return (
    <Box display="flex" alignItems="center" gap={1.5} py={1}>
      <img src={WarehouseImage} alt="Warehouse" />
      <Box>
        <Typography variant="body1" fontWeight={600}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {code}
        </Typography>
      </Box>
    </Box>
  );
};
const TableFilters: FilterType[] = [
  {
    type: "text",
    title: "Warehouse Name",
    value: "WAREHOUSE_NAME",
    placeholder: "Search by name",
  },
  {
    type: "text",
    title: "Warehouse Code",
    value: "WAREHOUSE_CODE",
    placeholder: "Search by code",
  },
  {
    type : "select",
     title: "Status",
    value: "STATUS",
  }
];
const ListWarehouseManagement = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data, isLoading } = useGetAllWarehousesQuery();

  // FE ONLY filtering
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredData = useMemo(() => {
    const rows = data?.data || [];

    if (statusFilter === "ALL") return rows;

    return rows.filter(
      (r: any) =>
        (r.STATUS || "").toString().toLowerCase() ===
        statusFilter.toLowerCase()
    );
  }, [data, statusFilter]);

  return (
    <>
      <BackdropLoader openStates={isLoading} />

      <Header
        title="Warehouse Management"
        buttons={[
          {
            label: "Create Warehouse",
            variant: "contained",
            onClick: () => {
              navigate(`/${process.env.APP_NAME}/warehouse-management/new`);
            },
          },
        ]}
      />

      <Grid sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }} > 
        <Typography fontWeight={700}>Warehouse</Typography>
        <Chip
          label={filteredData.length}
          sx={{
            backgroundColor: theme.palette.common.white,
            fontSize: "11px",
            fontWeight: 700,
            border: `1px solid ${theme.palette.grey[400]}`,
            height: "24px",
          }}
        />
        {/* <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ ml: 2, minWidth: 120 }}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select> */}
      </Grid>

      {/* TABLE */}
      <Table<WarehouseData>
        data={[...filteredData].reverse()}
         filters={TableFilters}// No table internal filters now
         initialState={{
              columnPinning: { right: ["actions"] },
            }}
      >

        <Cell
          type="custom"
          title="Warehouse"
          render={(cell) => (
            <Warehouse
              name={cell.row.original.WAREHOUSE_NAME}
              code={cell.row.original.WAREHOUSE_CODE}
            />
          )}
        />

        <Cell type="person" title="Manager" value="MANAGER_USERNAME" />

        <Cell
          type="custom"
          title="Address"
          render={(cell) => (
            <Typography variant="body2">
              {cell.row.original.ADDRESS}, {cell.row.original.CITY},{" "}
              {cell.row.original.STATE}, {cell.row.original.PIN_CODE}
            </Typography>
          )}
        />

        <Cell type="text" title="SKU Handling" value="SKU_COUNT" />

        <Cell
          type="status"
          title="Status"
          value="STATUS"
          colors={{ active: theme.palette.primary.light, inactive: "red" }}
        />
         <Cell type="text" title="Warehouse Name" value="WAREHOUSE_NAME"  enableHiding={true} />
         <Cell type="text" title="Warehouse Code" value="WAREHOUSE_CODE" enableHiding={true} />
        <ActionCell>
          <Action
            type="view"
            onClick={(cell) => {
              navigate(
                `/${process.env.APP_NAME}/warehouse-management/${cell.row.original.WAREHOUSE_ID}`
              );
            }}
          />
        </ActionCell>
      </Table>
    </>
  );
};

export default ListWarehouseManagement;
