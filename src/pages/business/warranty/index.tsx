import { useGetAllWarrantyQuery } from "../../../store/api/warranty/warranty-api";
import Header from "../../../components/common/header";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../components/common/table";
import { useNavigate } from "react-router-dom";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import {
  Chip,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";
import TextFieldBase from "../../../components/textfeild/TextFieldBase";
import Button from "../../../components/common/button/Button";

const Index = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("All Warranty");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: WarrantyData, isLoading: WarrantyLoading } =
    useGetAllWarrantyQuery(null);

const warrantyList =
  WarrantyData?.data?.warrantyList.map((item: any) => ({
    ...item,
    STATUS: item.STATUS === "NEW" ? "New" : item.STATUS === "APPROVED" ? "Approved" : item.STATUS,
  })) || [];


  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s === "approved" || s === "completed" )
      return theme.palette.success.light;
    if (s === "new" || s === "in progress")
      return theme.palette.warning.light;
    if (s === "rejected" || s === "denied") return theme.palette.error.light;
    return theme.palette.grey[500];
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value: string) => {
    setSelectedFilter(value);
    setAnchorEl(null);
  };

  const filteredWarranty = useMemo(() => {
    if (!warrantyList?.length) return [];
    if (selectedFilter === "All Warranty") return warrantyList;
    return warrantyList.filter(
      (o:any) => o.STATUS?.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [warrantyList, selectedFilter]);

  return (
    <>
      <BackdropLoader openStates={WarrantyLoading} />

      <Header
        title="Warranty Orders"
        buttons={[
          {
            label: "Create Warranty",
            variant: "contained",
            onClick: () => navigate("create"),
          },
        ]}
      />

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body1" fontWeight={500}>
            {selectedFilter}
          </Typography>

          <Button
            label=""
            startIcon={<ExpandMoreIcon />}
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
            <MenuItem onClick={() => handleClose("All Warranty")}>
            All Warranty
          </MenuItem> 
          <MenuItem onClick={() => handleClose("Approved")}>Approved</MenuItem>
          <MenuItem onClick={() => handleClose("New")}>New</MenuItem>
          {/* <MenuItem onClick={() => handleClose("Denied")}>Denied</MenuItem> */}
        
        </Menu>

        <TextFieldBase
          value={filteredWarranty.length.toString().padStart(2, "0")}
          size="small"
          id="orders-count-input"
          aria-label="Filtered orders count"
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

      <Table data={filteredWarranty}>
        <Cell type="text" title="Warranty No" value="WARRANTYNO" />
        <Cell type="text" title="Dealer Code" value="DEALERCODE" />
        <Cell type="text" title="Malfunction KMs" value="MALFUNCTIONKMS" />
        <Cell type="text" title="Invoice No" value="INVOICENO" />
        <Cell
          type="custom"
          title="Status"
          value="STATUS"
          render={(cell) => {
            const status = cell.getValue<string>() || "-";
            return (
              <Chip
                label={status}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(status),
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
            id="view-action-btn"
            type="view"
            onClick={(cell) =>
              navigate("view", { state: { id: cell?.row?.original?.ID } })
            }
          />
        </ActionCell>
      </Table>
    </>
  );
};

export default Index;
