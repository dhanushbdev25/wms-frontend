import { Box } from "@mui/material";
import Button from "../../../../components/common/button/Button";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { Table, Cell } from "../../../../components/common/table"; 
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

type ItemDetail = {
  VARIANT_NAME: string;
  VARIANT_CODE: string;
  QTY: number;
  UOM: string;
  STATUS: string;
};

const InspectionSummaryTable = ({ items }: { items: ItemDetail[] }) => {
  return (
    <>
      <BackdropLoader openStates={false} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Button
          label="Export"
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<DownloadOutlinedIcon />}
        />
      </Box>

      <Table<ItemDetail>
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
        <Cell type="text" title="SKU Name" value="VARIANT_NAME" />
        <Cell type="text" title="SKU Code" value="VARIANT_CODE" />
        <Cell type="text" title="Quantity" value="QTY" />
        <Cell type="text" title="UoM" value="UOM" />
        <Cell
          type="status"
          title="Status"
          value="STATUS"
          colors={{
            "QI-PASSED": "#1D367A",
            "DAMAGED": "#A13D07",
            "NOT-FOUND": "#B91C1C",
          }}
        />
      </Table>
    </>
  );
};

export default InspectionSummaryTable;
