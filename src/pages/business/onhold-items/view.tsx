import {
  Box,
  Container,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/common/header";
import StatisticsSummary from "../../../components/common/statistics-summary";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import Button from "../../../components/common/button/Button";
import { ActionCell, Cell, Table } from "../../../components/common/table";
import ScanHeaderDialog from "../inbound/scan-headerdialog";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextFieldBase from "../../../components/textfeild/TextFieldBase";
import { ScanDialogPickup } from "./popUps/cmn_popup";
import ScrapDialog from "./popUps/scrap_pop";
import { useGetAllOnHoldItemsByIdQuery } from "../../../store/api/onhold-items/onhold-api";
import { OnHoldItemDetail } from "../../../store/api/onhold-items-validators/onhold.validator";

type OnHoldFilter = "All Items" | "Scrapped" | "Damaged" | "Sent To Scrap";

const OnHoldView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as {
    state?: { itemId?: number; serialized?: boolean };
  };
  const { itemId, serialized } = state || {};
  const [value, setValue] = useState<string>("");
  const [matchedItems, setMatchedItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<OnHoldFilter>("All Items");
  const [scrapOpen, setScrapOpen] = useState(false);
  const [scrapItem, setScrapItem] = useState<OnHoldItemDetail | null>(null);
  const [flag, setFlag] = useState<string>();
  const [mainData, setMainData] = useState<OnHoldItemDetail[]>([]);
  const { data, isLoading } = useGetAllOnHoldItemsByIdQuery(itemId);
    
  useEffect(() => {
    if (data?.data?.items) {
      const mappedItems: OnHoldItemDetail[] = data.data.items.map(
        (item: any) => ({
          id: item.ID,
          skuName: item.VARIANT_NAME,
          skuCode: item.VARIANT_CODE,
          vin_number: item.VIN,
          uom: item.UOM,
          quantity: item.QUANTITY || undefined, 
          status:
            item.STATUS === "DAMAGED"
              ? "Damaged"
              : item.STATUS === "SCRAPPED"
                ? "Scrapped"
                : "Sent To Put-Away",
        }),
      );
      setMainData(mappedItems);
    }
  }, [data]);

  const statistics = useMemo(() => {
    const stats = data?.data?.statistics;
    if (!stats) return [];
    return [
      {
        label: "Total On Hold Items",
        value: stats["Total On-Hold Items"] ?? 0,
      },
      { label: "Pending Items", value: stats["Pending Items"] ?? 0 },
      { label: "Scrapped Items", value: stats["Scrapped Items"] ?? 0 },
      { label: "Put-Away Items", value: stats["Putaway Items"] ?? 0 },
    ];
  }, [data]);

  const filteredItems = useMemo(() => {
    if (selectedFilter === "All Items") return mainData;
    return mainData.filter((item) => item.status === selectedFilter);
  }, [selectedFilter, mainData]);

  const handleScrapOpen = (item: OnHoldItemDetail, type: string) => {
    setScrapItem(item);
    setScrapOpen(true);
    setFlag(type);
  };

  const handleScrapClose = () => {
    setScrapOpen(false);
    setScrapItem(null);
  };

  const handleScrapConfirm = () => {
    console.log("Confirmed:", flag, scrapItem);
    setScrapOpen(false);
  };

  const headerDetails = data?.data?.headers || [];

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            setSelectedFilter("All Items");
            setAnchorEl(null);
          }}
        >
          All Items
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedFilter("Scrapped");
            setAnchorEl(null);
          }}
        >
          Scrapped
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedFilter("Damaged");
            setAnchorEl(null);
          }}
        >
          Damaged
        </MenuItem>
      </Menu>

      {/* Header */}
      <Header
        onBack={() => navigate(-1)}
        title={headerDetails?.PO_NO || ""}
        buttons={[]}
      />

      {/* Header details */}
      <Grid container spacing={2} mt={1}>
        {headerDetails &&
          Object.entries(headerDetails).map(([key, value]) => (
            <Grid item key={key}>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                {key.replaceAll("_", " ")}:{" "}
              </Typography>
              <Typography variant="body2" fontWeight="bold" component="span">
                {value}
              </Typography>
            </Grid>
          ))}
      </Grid>

      <StatisticsSummary data={statistics} />
      <Container
        sx={{
          backgroundColor: "white",
          borderRadius: "5px",
          marginTop: "20px",
          width: "100%",
        }}
      >
        <Box sx={{ overflowX: "auto", m: 2, pt: 2 }}>
          {/* <ScanHeaderDialog
            value={value}
            tableDataSets={mainData}
            setValue={setValue}
            setMatchedItems={setMatchedItems}
            handleClickOpen={() => setDialogOpen(true)}
            serialized={serialized}
          /> */}

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ m: 1.5 }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body1" fontWeight={500}>
                {selectedFilter}
              </Typography>
              <Button
                label={<ExpandMoreIcon />}
                // startIcon={<ExpandMoreIcon />}
                variant="text"
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{ minWidth: "auto", padding: 0, lineHeight: 1 }}
              />
            </Stack>

            <TextFieldBase
              value={filteredItems.length.toString().padStart(2, "0")}
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

          {Object.keys(rowSelection).length > 0 && (
            <Stack direction="row" spacing={2} sx={{ m: 1.5, mb: 2 }}>
              <Button
                label="Put-Away"
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  const selectedItems = Object.keys(rowSelection).map(
                    (key) => filteredItems[Number(key)],
                  );
                  handleScrapOpen(selectedItems, "putaway");
                  setFlag("putaway");
                }}
              />

              <Button
                label="Scrap"
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  const selectedItems = Object.keys(rowSelection).map(
                    (key) => filteredItems[Number(key)],
                  );
                  handleScrapOpen(selectedItems, "scrap");
                  setFlag("scarp");
                }}
              />
            </Stack>
          )}

          <Table<OnHoldItemDetail>
            data={filteredItems}
            enableRowSelection={true}
            state={{ rowSelection }}
            onRowSelectionChange={setRowSelection}
            initialState={{ columnPinning: { right: ["actions"] } }}
          >
            <Cell type="text" title="SKU Name" value="skuName" />
            <Cell type="text" title="SKU Code" value="skuCode" />
            <Cell type="text" title="VIN Number" value="vin_number" />
            <Cell type="text" title="UoM" value="uom" />
            <Cell
              type="status"
              title="Status"
              value="status"
              colors={{
                Pending: "orange",
                "Sent To Put-Away": "green",
                "Sent To Scrap": "gray",
              }}
            />

            <ActionCell>
              <Button
                label="Put-Away"
                variant="outlined"
                color="primary"
                size="small"
                onClick={(cell) =>
                  handleScrapOpen([cell.row.original], "putaway")
                }
              />
              <Button
                label="Scrap"
                variant="outlined"
                color="error"
                size="small"
               onClick={(cell) => handleScrapOpen([cell.row.original], "scrap")}

              />
            </ActionCell>
          </Table>
        </Box>
      </Container>

      <ScrapDialog
        flag={flag || ""}
        open={scrapOpen}
        onClose={handleScrapClose}
        onConfirm={handleScrapConfirm}
        scrapItem={scrapItem as OnHoldItemDetail}
        serialized={serialized}
      />

      <ScanDialogPickup
        matchedItems={matchedItems}
        handleClose={() => setDialogOpen(false)}
        openItem={dialogOpen}
        setMainData={(val) => console.log("Action:", val)}
      />
    </>
  );
};

export default OnHoldView;
