import { Box, Typography } from "@mui/material";
import { Table, Cell } from "../../../../components/common/table";
import CustomAccordion from "../../../../components/accordian/Accordian";
import Button from "../../../../components/common/button/Button";
import DownloadOutlinedIcon from '@mui/icons-material/FileDownload';


export type PickupItem = {
  skuName: string;
  skuCode: string;
  vinNumber: string;
  storage: string;
};

interface PickupProps {
  pickupId: string;
  performedBy: string;
  date: string;
  items: PickupItem[];
}

const Pickup = ({ pickupId, performedBy, date, items }: PickupProps) => {
  return (
    <CustomAccordion
      ariaId={`pickup-${pickupId}`}
      header={
        <Typography variant="subtitle1" fontWeight={600}>
          Item Picked Up - {pickupId}
        </Typography>
      }
      defaultExpanded
    >
      {/* Header row with performedBy, date, and export button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Performed by: {performedBy}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">{date}</Typography>
          <Button
          label="Export"
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<DownloadOutlinedIcon />}
        />
        </Box>
      </Box>

      {/* Pickup table */}
      <Table<PickupItem> data={items}>
        <Cell type="text" title="SKU Name" value="skuName" />
        <Cell type="text" title="SKU Code" value="skuCode" />
        <Cell type="text" title="VIN Number" value="vinNumber" />
        <Cell type="text" title="Storage" value="storage" />
      </Table>
    </CustomAccordion>
  );
};

export default Pickup;
