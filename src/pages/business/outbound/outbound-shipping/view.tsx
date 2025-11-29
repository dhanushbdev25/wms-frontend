import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../../../../components/common/header";
import StatisticsSummary from "../../../../components/common/statistics-summary";

import Allocation from "./allocation";
import DispatchItems from "./dispatch";
import ItemPickup from "./item-pickup";
import { useGetOrderByIDQuery } from "../../../../store/api/outbound/api";
import { OrderItemResponse } from "../../../../store/api/outbound-validators/outbound.validator";
import BackdropLoader from "../../../../components/third-party/BackdropLoader";
import useIsMobile from "../../../../themes/useIsMobile";
import OutboundHeaderDetailsCard from "../components/OutboundHeaderDetailsCard";


const View: React.FC = () => {
  const locationid = useLocation();
  const { orderId, serialized } = locationid.state || {};
  const [activeStep, setActiveStep] = useState<number>(0);

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const [getAllorderData, setGetAllorderData] = useState<OrderItemResponse>();
  const [enablePickupItem, setEnablePickupItem] = useState(false);
  const [enableDispatchItem, setEnableDispatchItem] = useState(false);

  const { data: getAllorderDataById, isFetching: AllorderLoading } =
    useGetOrderByIDQuery(orderId, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (getAllorderDataById) {
      // The API response may be wrapped in a data property or direct
      // Try both patterns to handle different response structures
      const orderData = (getAllorderDataById as any)?.data || getAllorderDataById;
      setGetAllorderData(orderData as OrderItemResponse);
    }
  }, [getAllorderDataById]);

  interface HeaderDetail {
    label: string;
    value: string | number;
    icon: React.ReactNode;
  }

  const headerDetails: HeaderDetail[] = [
    {
      label: "Material Type",
      value: getAllorderData?.Type || "-",
      icon: <CategoryIcon sx={{ fontSize: 20 }} />,
    },
  ];

  const steps = [
    {
      label: "Allocation",
      description: "Allocate items for the order",
      icon: <CheckCircleOutlinedIcon />,
      key: "allocation",
    },
    {
      label: "Items Pick-Up",
      description: "Pick up allocated items",
      icon: <Inventory2OutlinedIcon />,
      key: "pickup",
    },
    {
      label: "Dispatch",
      description: "Dispatch items and create waybill",
      icon: <LocalShippingOutlinedIcon />,
      key: "dispatch",
    },
  ];

  // Determine step status
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < activeStep) return "completed";
    if (stepIndex === activeStep) return "active";
    if (stepIndex === 1 && !enablePickupItem) return "disabled";
    if (stepIndex === 2 && !enableDispatchItem) return "disabled";
    return "pending";
  };

  // Auto-advance to next step when enabled
  useEffect(() => {
    if (enablePickupItem && activeStep === 0) {
      setActiveStep(1);
    }
  }, [enablePickupItem, activeStep]);

  useEffect(() => {
    if (enableDispatchItem && activeStep === 1) {
      setActiveStep(2);
    }
  }, [enableDispatchItem, activeStep]);

  return (
    <>
      <BackdropLoader openStates={AllorderLoading} />
      <>
        <Box sx={{ mb: 3 }}>
          <Header
            onBack={() => navigate(-1)}
            title={getAllorderData?.OrderNo || "Order Details"}
            buttons={[]}
          />
        </Box>
        <OutboundHeaderDetailsCard details={headerDetails} />
        {isMobile ? (
          ""
        ) : (
          <StatisticsSummary data={getAllorderData?.STATISTICS || []} />
        )}
      </>

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
        <Stepper
          activeStep={activeStep}
          orientation={isMobile ? "vertical" : "vertical"}
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
                          <Allocation setEnablePickupItem={setEnablePickupItem} />
                        )}
                        {index === 1 && (
                          <ItemPickup
                            orderId={orderId}
                            serialized={serialized}
                            setEnableDispatchItem={setEnableDispatchItem}
                          />
                        )}
                        {index === 2 && (
                          <DispatchItems orderId={orderId} serialized={serialized} />
                        )}
                      </Box>
                    </Card>
                  </StepContent>
                )}
              </Step>
            );
          })}
        </Stepper>
      </Container>
    </>
  );
};

export default View;
