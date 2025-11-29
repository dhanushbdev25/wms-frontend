import DownloadOutlinedIcon from "@mui/icons-material/FileDownload";
import { Box, Typography } from "@mui/material";

import CustomAccordion from "../../../../components/accordian/Accordian";
import Button from "../../../../components/common/button/Button";
import { Cell, Table } from "../../../../components/common/table";

type WaybillItem = {
  skuName: string;
  skuCode: string;
  vinNumber: string;
};

interface WaybillProps {
  performedBy: string;
  date: string;
  items: WaybillItem[];
}

const Waybill = ({ performedBy, date, items }: WaybillProps) => {
  return (
    <CustomAccordion
      ariaId="waybill-created"
      header={
        <Typography variant="subtitle1" fontWeight={600}>
          Waybill Created
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
            id="way-bill-export"
            data-testid="way-bill-export"
            label="Export"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<DownloadOutlinedIcon />}
          />
        </Box>
      </Box>

      {/* Waybill table */}
      <Table<WaybillItem> data={items}>
        <Cell type="text" title="SKU Name" value="skuName" />
        <Cell type="text" title="SKU Code" value="skuCode" />
        <Cell type="text" title="VIN Number" value="vinNumber" />
      </Table>
    </CustomAccordion>
  );
};

export default Waybill;
