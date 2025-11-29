import DownloadOutlinedIcon from "@mui/icons-material/FileDownload";
import { Box, Typography } from "@mui/material";

import CustomAccordion from "../../../../components/accordian/Accordian";
import Button from "../../../../components/common/button/Button";
import { Table, Cell } from "../../../../components/common/table";

export type AllocationItem = {
  skuName: string;
  skuCode: string;
  quantity: number;
  uom: string;
};

interface AllocationProps {
  allocationId: string;
  performedBy: string;
  date: string;
  items: AllocationItem[];
}

const Allocation = ({
  allocationId,
  performedBy,
  date,
  items,
}: AllocationProps) => {
  return (
    <CustomAccordion
      ariaId={`allocation-${allocationId}`}
      header={
        <Typography variant="subtitle1" fontWeight={600}>
          Allocation Created - {allocationId}
        </Typography>
      }
      defaultExpanded
    >
      {/* Header row with performedBy, date, and export button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Performed by: {performedBy}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">{date}</Typography>
          <Button
            id="download-icon-outbound"
            data-testid="download-icon-outbound"
            label="Export"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<DownloadOutlinedIcon />}
          />
        </Box>
      </Box>

      {/* Allocation table */}
      <Table<AllocationItem> data={items}>
        <Cell type="text" title="SKU Name" value="skuName" />
        <Cell type="text" title="SKU Code" value="skuCode" />
        <Cell type="text" title="Quantity" value="quantity" />
        <Cell type="text" title="UOM" value="uom" />
      </Table>
    </CustomAccordion>
  );
};

export default Allocation;
