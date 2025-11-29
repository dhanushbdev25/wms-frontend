import { Box } from "@mui/material";
import Button from "../../../../components/common/button/Button";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { Table, Cell } from "../../../../components/common/table";
import { PutAwayItem } from "./summary";



const PutAwayOperationTable = ({ items }: { items: PutAwayItem[] }) => (
  <Box sx={{ mt: 4 }}>
    {/* Export button above table */}
    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
      <Button
        label="Export"
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<DownloadOutlinedIcon />}
      />
    </Box>

    <Table<PutAwayItem>
      data={items}
      globalFilter={false}
      sx={{
        borderCollapse: "collapse",
        "& .MuiTableCell-root": {
          padding: "6px 8px",
          fontSize: "0.85rem",
        },
        "& .MuiTableHead-root": {
          backgroundColor: "#F9FAFB",
        },
        "& .MuiTableHead-root .MuiTableCell-root": {
          fontWeight: 600,
          color: "#374151",
          fontSize: "0.85rem",
        },
        "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)": {
          backgroundColor: "#FAFAFA",
        },
      }}
    >
      <Cell type="text" title="SKU Name" value="skuName" />
      <Cell type="text" title="SKU Code" value="skuCode" />
      <Cell type="text" title="VIN Number" value="vinNumber" />
      <Cell type="text" title="UoM" value="uom" />
      <Cell type="status" title="Status" value="status" colors={{
        "RECEIVED": "#1D367A",
        "QI-PASSED": "#16A34A",
        "NOT-PLACED": "#B91C1C",
      }}/>
      <Cell type="text" title="Location" value="location" />
    </Table>
  </Box>
);

export default PutAwayOperationTable;
