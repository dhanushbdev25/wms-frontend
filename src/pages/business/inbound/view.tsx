import {
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  useTheme,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../../components/common/header";
import StatisticsSummary from "../../../components/common/statistics-summary";
import Putaway from "./putaway-page/putaway";
import Qualityinspection from "./quality-inspection/quality-inspection";
import { useGetPackageOrderByIdQuery } from "../../../store/api/Inbound/inboundApi";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { PackageApiResponse } from "../../../store/api/inbound-validators/inbound.validator";
import useIsMobile from "../../../themes/useIsMobile";
import CustomAccordion from "../../../components/accordian/Accordian";
import HeaderDetailsCard from "./components/HeaderDetailsCard";

const View = () => {
  interface HeaderDetail {
    label: string;
    value: string | number;
    icon: React.ReactNode;
  }

  const location = useLocation();
  const navigate = useNavigate();
  const packageId = location.state?.packageId;

  const { data: packagedata, isLoading } = useGetPackageOrderByIdQuery(
    packageId,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [items, setItems] = useState<PackageApiResponse>();
  const [enablePutAway, setEnablePutAway] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const isMobile = useIsMobile();
  const theme = useTheme();

  const refType = packagedata?.data?.REFERENCE_TYPE;
  
  useEffect(() => {
    if (packagedata) {
      setItems(packagedata);
    }
  }, [packagedata]);

  // Check if QI is already completed
  const isQICompleted = useMemo(() => {
    if (!items?.data) return false;
    
    const containerQI = items.data.CONTAINER_QUALITY_INSPECTION;
    const itemQI = items.data.ITEM_QUALITY_INSPECTION;
    
    const containerCompleted = 
      containerQI?.INSPECTION?.toLowerCase() === "completed" &&
      containerQI?.STATUS?.toLowerCase() === "qi-passed";
    
    const itemCompleted = 
      itemQI?.INSPECTION?.toLowerCase() === "completed";
    
    return containerCompleted && itemCompleted;
  }, [items?.data]);

  // Initialize enablePutAway based on QI completion status
  useEffect(() => {
    if (isQICompleted) {
      setEnablePutAway(true);
      // Auto-advance to Putaway step if QI is already completed
      setActiveStep(1);
    }
  }, [isQICompleted]);

  // Auto-advance to Putaway step when QI is completed
  useEffect(() => {
    if (enablePutAway && activeStep === 0) {
      setActiveStep(1);
    }
  }, [enablePutAway, activeStep]);

  // Define steps for the timeline
  const steps = [
    {
      label: "Quality Inspection",
      description: "Perform container and item quality inspection",
      icon: <CheckCircleOutlinedIcon />,
      key: "quality-inspection",
    },
    {
      label: "Putaway",
      description: "Place items in storage locations",
      icon: <Inventory2OutlinedIcon />,
      key: "putaway",
    },
  ];

  // Determine step status
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < activeStep) return "completed";
    if (stepIndex === activeStep) return "active";
    if (stepIndex === 1 && !enablePutAway && !isQICompleted) return "disabled";
    return "pending";
  };

  const headerDetails: HeaderDetail[] = [
    { 
      label: "PO", 
      value: items?.data.PO_NO || "-",
      icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
    },
    { 
      label: "Shipment", 
      value: items?.data.SHIPMENT_ADVICE_NO || "-",
      icon: <LocalShippingIcon sx={{ fontSize: 20 }} />,
    },
    { 
      label: "Container", 
      value: items?.data.CONTAINER_NO || "-",
      icon: <InventoryIcon sx={{ fontSize: 20 }} />,
    },
  ];
  
  return (
    <>
      <BackdropLoader openStates={isLoading} />
      {isMobile ? (
        <>
          <CustomAccordion
            ariaId={`inbound-view-box`}
            header={
              <Header
                onBack={() => navigate(-1)}
                title={items?.data.CONTAINER_NO || "Package Details"}
                buttons={[]}
              />
            }
            sx={{
              "& .MuiAccordionSummary-content": {
                margin: "0 !important",
                alignItems: "center",
              },
              "&.Mui-expanded": {
                minHeight: "36px !important",
              },
              borderRadius: 1.5,
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <>
              <Divider sx={{ my: 1, mx: -2 }} />
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  {headerDetails.map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: "rgba(0, 112, 242, 0.04)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: 0.75,
                            backgroundColor: "rgba(0, 112, 242, 0.1)",
                            color: "primary.main",
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: "0.7rem", fontWeight: 500 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          </CustomAccordion>
        </>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Header
              onBack={() => navigate(-1)}
              title={items?.data.CONTAINER_NO || "Package Details"}
              buttons={[]}
            />
          </Box>
          <HeaderDetailsCard details={headerDetails} />
        </>
      )}
      {isMobile ? (
        ""
      ) : (
        <StatisticsSummary data={items?.data.STATISTICS || []} />
      )}

      <Container
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          marginTop: 3,
          padding: { xs: 2, md: 3 },
          width: "100%",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        {items?.data.ID && (
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            sx={{
              "& .MuiStepLabel-root": {
                "& .MuiStepLabel-label": {
                  fontSize: "1rem",
                  fontWeight: 600,
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: theme.palette.success.main,
                },
                "& .MuiStepLabel-label.Mui-disabled": {
                  color: theme.palette.text.disabled,
                },
              },
              "& .MuiStepIcon-root": {
                fontSize: "2rem",
                "&.Mui-active": {
                  color: theme.palette.primary.main,
                },
                "&.Mui-completed": {
                  color: theme.palette.success.main,
                },
                "&.Mui-disabled": {
                  color: theme.palette.action.disabled,
                },
              },
              "& .MuiStepContent-root": {
                borderLeft: `2px solid ${theme.palette.divider}`,
                marginLeft: "20px",
                paddingLeft: 3,
              },
            }}
          >
            {steps.map((step, index) => {
              const stepStatus = getStepStatus(index);
              const isCompleted = stepStatus === "completed";
              const isActive = stepStatus === "active";
              const isDisabled = stepStatus === "disabled";

              return (
                <Step
                  key={step.key}
                  completed={isCompleted}
                  active={isActive}
                  disabled={isDisabled}
                >
                  <StepLabel
                    StepIconComponent={({ active, completed }) => (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: completed
                            ? theme.palette.success.main
                            : active
                            ? theme.palette.primary.main
                            : isDisabled
                            ? theme.palette.action.disabledBackground
                            : theme.palette.grey[300],
                          color: completed || active ? "white" : theme.palette.text.secondary,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {completed ? (
                          <CheckCircleIcon sx={{ fontSize: 24 }} />
                        ) : (
                          React.cloneElement(step.icon, { sx: { fontSize: 24 } })
                        )}
                      </Box>
                    )}
                    onClick={() => {
                      if (!isDisabled) {
                        setActiveStep(index);
                      }
                    }}
                    sx={{
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                          color: isActive
                            ? theme.palette.primary.main
                            : isCompleted
                            ? theme.palette.success.main
                            : isDisabled
                            ? theme.palette.text.disabled
                            : theme.palette.text.primary,
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.75rem",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                  {isActive && (
                    <StepContent>
                      <Card
                        sx={{
                          mt: 2,
                          mb: 4,
                          borderRadius: 2,
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          backgroundColor: "white",
                          overflow: "visible",
                        }}
                      >
                        <Box
                          sx={{
                            p: { xs: 2, md: 3 },
                            overflowX: "auto",
                            ...(isMobile && { maxHeight: "100vh", overflowY: "auto" }),
                          }}
                        >
                          {index === 0 && (
                            <Qualityinspection
                              qualityData={items?.data}
                              setEnablePutAway={setEnablePutAway}
                            />
                          )}
                          {index === 1 && (
                            <Putaway
                              itemID={items?.data.ID}
                              serialized={items?.data.SERIALIZED}
                              refType={refType}
                              items={items?.data.STATISTICS}
                            />
                          )}
                        </Box>
                      </Card>
                    </StepContent>
                  )}
                </Step>
              );
            })}
          </Stepper>
        )}
      </Container>
    </>
  );
};

export default View;
