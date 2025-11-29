import CloseIcon from "@mui/icons-material/Close";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import DoneIcon from "@mui/icons-material/Done";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import Button from "../../../../components/common/button/Button";
import { Cell, Table } from "../../../../components/common/table";

import { ScandialogQuality } from "../quality-inspection-dialogs/quality-inspection-dialog";
import ScanHeaderDialog from "../scan-headerdialog";
import {
  InspectionDataProps,
  PutAwaySkuDetails,
} from "../../../../store/api/inbound-validators/inbound.validator";
import { usePostItemQualityInspectionMutation } from "../../../../store/api/Inbound/inboundApi";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import { mapStatusToLocationStatus } from "../../../../utils/locationStatus";
import { getStatusStyles } from "../../../../utils/GetStatusColor";
import useIsMobile from "../../../../themes/useIsMobile";
import MobileCardList from "../../../../components/common/mobile-components/mobile-cardlist";

const QualityinspectionTable = ({
  inspectionData,
  disabled,
  ID,
  serialized,
  setEnablePutAway,
}: InspectionDataProps) => {
  const [postItemQualityInspection, { isLoading }] =
    usePostItemQualityInspectionMutation();

  const theme = useTheme();
  const isMobile = useIsMobile();
  const [value, setValue] = useState<string>("");
  const [openItem, setOpenItem] = useState(false);
  const [matchedItems, setMatchedItems] = useState<PutAwaySkuDetails>();
  const [mainData, setMainData] = useState<PutAwaySkuDetails[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [proceedResolve, setProceedResolve] =
    useState<(value: boolean) => void>();

  const handleClose = () => setOpenItem(false);
  const handleClickOpen = () => setOpenItem(true);
  const flag = "Inspectiondata";
  useEffect(() => {
    if (inspectionData?.data) {
      const formattedData = inspectionData?.data.map((item) => ({
        id: item.ID,
        skuName: item.VARIANT_NAME,
        sku: item.VARIANT_CODE,
        vin_number: item.VIN,
        uom: item.UOM,
        locationStatus: mapStatusToLocationStatus(item.STATUS),
        quantity: item.QTY ? Number(item.QTY) : undefined,
        serialized: serialized,
        type: item.TYPE,
        itemStatus: "", // provide a default string
        packageListItemId: 0,
      }));
      setMainData(formattedData);
    }
  }, [inspectionData]);
  useEffect(() => {
    if ((inspectionData?.INSPECTION ?? "").toLowerCase() === "completed") {
      setEnablePutAway(true);
    }
  }, [inspectionData]);

  const itemsReadyCount = useMemo(() => {
    return mainData?.filter((item) => item.locationStatus === "QI-Passed")
      .length;
  }, [mainData]);

  const showConfirmDialog = (message: string) => {
    return new Promise<boolean>((resolve) => {
      setDialogMessage(message);
      setDialogOpen(true);
      setProceedResolve(() => resolve);
    });
  };

  const handleDialogClose = (proceed: boolean) => {
    setDialogOpen(false);
    proceedResolve?.(proceed);
  };

  const handleSent = async () => {
    const qiPendingItems = mainData.filter(
      (item) => item.locationStatus.toUpperCase() === "QI PENDING",
    );

    if (qiPendingItems.length === 0) {
      await submitInspection();
      return;
    }

    const message =
      qiPendingItems.length === mainData.length
        ? "You want to proceed without scanning any items?"
        : "By submitting, all non-inspected items will be considered as QI Passed and moved to put-away.";

    const proceed = await showConfirmDialog(message);

    if (!proceed) return;
    await submitInspection();
  };
  const submitInspection = async () => {
    const payload = mainData.map((item) => {
      let status = item.locationStatus.toUpperCase();

      if (status === "QI PENDING") status = "QI-PASSED";
      return {
        ID: item.id!,
        QTY: item.quantity,
        STATUS: status,
      };
    });

    await postItemQualityInspection({ id: ID, body: payload }).unwrap();
    setEnablePutAway(true);
  };

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      <Grid container direction="column" spacing={2}>
        <Grid item sx={{ width: "100%" }}>
          {isMobile ? (
            <Accordion
              sx={{
                boxShadow: "none",
                borderRadius: 2,
                backgroundColor: "#FFF",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary
                sx={{
                  px: 1,
                  py: 0.5,
                  minHeight: "40px !important",
                  "&.Mui-expanded": { minHeight: "40px !important" },
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    padding: 0,
                    alignItems: "center",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <CollectionsBookmarkOutlinedIcon sx={{ fontSize: "18px" }} />

                  <Box>
                    <Typography fontSize="14px" fontWeight={600}>
                      Items Quality Inspection
                    </Typography>
                    <Typography fontSize="11px" color="text.secondary">
                      Check individual item quality
                    </Typography>
                  </Box>
                </Box>
                <Box ml="auto" textAlign="right">
                  <Chip
                    label={inspectionData?.INSPECTION || "Pending"}
                    size="small"
                    sx={{
                      backgroundColor:
                        (inspectionData?.INSPECTION || "Pending") ===
                        "Completed"
                          ? theme.palette.success.light
                          : theme.palette.error.light,
                      color: "#fff",
                      fontSize: "11px",
                      height: "22px",
                    }}
                  />
                </Box>
              </AccordionSummary>

              <Divider sx={{ my: 1 }} />

              <AccordionDetails sx={{ padding: 1 }}>
                <Box sx={{ width: "100%" }}>
                  {inspectionData?.INSPECTION?.toLowerCase() !==
                    "completed" && (
                  <Box
                    sx={{
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                      backgroundColor: "white",
                    }}
                  >
                    <ScanHeaderDialog
                      value={value}
                      tableDataSets={mainData}
                      setValue={setValue}
                      setMatchedItems={setMatchedItems}
                      handleClickOpen={handleClickOpen}
                      serialized={serialized}
                      flag={flag}
                    />
                  </Box>
                  )}
                  <MobileCardList<PutAwaySkuDetails>
                    data={mainData}
                    headers={[
                      {
                        titleKey: { name: "SKU", value: "skuName" },

                        statusKey: "locationStatus",
                        renderStatus: (status) => (
                          <Chip
                            label={status}
                            size="small"
                            sx={{
                              ...getStatusStyles(status, theme),
                              fontSize: "11px",
                              height: "20px",
                            }}
                          />
                        ),
                      },
                    ]}
                    columns={[
                      serialized
                        ? { title: "VIN", value: "vin_number" }
                        : { title: "Quantity", value: "quantity" },
                      { title: "UOM", value: "uom" },
                      { title: "SKU Code", value: "sku" },
                    ]}
                  />

                  {/* FOOTER Buttons */}
                  <Box mt={2}>
                    <Chip
                      label="By submitting, all non-inspected items will become QI Passed."
                      icon={<ErrorOutlineOutlinedIcon />}
                      sx={{
                        fontSize: "10px",
                        backgroundColor: theme.palette.primary.lighter,
                        py: 1,
                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      mt={1}
                      gap={1}
                    >
                      <Button
                        label="Discard"
                        startIcon={<CloseIcon />}
                        variant="contained"
                        color="secondary"
                        disabled={
                          inspectionData?.INSPECTION?.toLowerCase() ===
                          "completed"
                        }
                      />
                      <Button
                        label="Submit"
                        startIcon={<DoneIcon />}
                        variant="contained"
                        onClick={handleSent}
                        disabled={
                          inspectionData?.INSPECTION?.toLowerCase() ===
                          "completed"
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Accordion
              sx={{
                boxShadow: "none",
                padding: 0,
                width: "100%",
                maxWidth: "100vw",
              }}
              disabled={disabled}
            >
              <AccordionSummary sx={{ flexDirection: "row-reverse" }}>
                <Grid container spacing={2} alignItems="center" sx={{ ml: 2 }}>
                  <Grid item xs={1}>
                    <CollectionsBookmarkOutlinedIcon />
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="h5">
                      Items Quality Inspection
                    </Typography>
                    <Typography variant="body2">
                      Check individual item quality and accuracy
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box textAlign="center">
                      <Typography>Inspection</Typography>
                      <Chip
                        label={inspectionData?.INSPECTION || "Pending"}
                        sx={{
                          backgroundColor: theme.palette.background.paper,
                          color:
                            (inspectionData?.INSPECTION || "Pending") ===
                            "Completed"
                              ? theme.palette.success.light
                              : theme.palette.error.light,
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails sx={{ padding: 0 }}>
                <Box sx={{ width: "100%" }}>
                  {inspectionData?.INSPECTION?.toLowerCase() !==
                    "completed" && (
                    <ScanHeaderDialog
                      value={value}
                      tableDataSets={mainData}
                      setValue={setValue}
                      setMatchedItems={setMatchedItems}
                      handleClickOpen={handleClickOpen}
                      serialized={serialized}
                      flag={flag}
                    />
                  )}

                  <Table<PutAwaySkuDetails> data={mainData}>
                    <Cell type="text" title="SKU Name" value="skuName" />
                    <Cell type="text" title="SKU" value="sku" />
                    {serialized ? (
                      <Cell type="text" title="Vin Number" value="vin_number" />
                    ) : (
                      <Cell type="text" title="Quantity" value="quantity" />
                    )}
                    <Cell type="text" title="UOM" value="uom" />

                    <Cell<PutAwaySkuDetails>
                      type="custom"
                      title="Status"
                      render={(cell) => (
                        <Chip
                          label={cell.row.original.locationStatus}
                          size="small"
                          variant="outlined"
                          sx={getStatusStyles(
                            cell.row.original.locationStatus,
                            theme,
                          )}
                        />
                      )}
                    />
                  </Table>

                  <Grid m={2}>
                    <Chip
                      label="By submitting, all non-inspected items will be moved to put-away"
                      icon={<ErrorOutlineOutlinedIcon />}
                      sx={{
                        fontSize: "12px",
                        height: "50px",
                        backgroundColor: theme.palette.primary.lighter,
                      }}
                    />

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      mt={1}
                      gap={1}
                    >
                      <Button
                        label="Discard"
                        startIcon={<CloseIcon />}
                        variant="contained"
                        color="secondary"
                        disabled={
                          inspectionData?.INSPECTION?.toLowerCase() ===
                          "completed"
                        }
                      />
                      <Button
                        id="submit-btn"
                        label="Submit"
                        startIcon={<DoneIcon />}
                        variant="contained"
                        onClick={handleSent}
                        disabled={
                          inspectionData?.INSPECTION?.toLowerCase() ===
                          "completed"
                        }
                      />
                    </Box>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>
      </Grid>

      <ScandialogQuality
        openItem={openItem}
        handleClose={handleClose}
        matchedItems={matchedItems}
        setMainData={setMainData}
        setValue={setValue}
        serialized={serialized}
        mainData={mainData}
      />

      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            label="cancel"
            onClick={() => handleDialogClose(false)}
            variant="outlined"
          />

          <Button
            label="proceed"
            onClick={() => handleDialogClose(true)}
            variant="contained"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QualityinspectionTable;
