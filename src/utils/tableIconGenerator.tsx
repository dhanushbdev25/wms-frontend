import {
  CheckCircleFilled,
  ClockCircleFilled,
  MinusCircleFilled,
  PlusCircleFilled,
} from "@ant-design/icons";
import { SiCodeship } from "react-icons/si";
import { Box } from "@mui/material";

export const tableIconGenerator = (
  status: any,
  onIconClick: any,
  stages?: any
) => {
  const staticIcons = [
    "OILEXECUTIONPRESHIPMENT",
    "OILEXECUTIONPOSTSHIPMENT",
    "WHEATEXECUTIONPRESHIPMENT",
    "WHEATEXECUTIONPOSTSHIPMENT",
  ];
  return (
    <Box sx={{ textAlign: "center" }} onClick={onIconClick}>
      {staticIcons.includes(stages) ? (
        <SiCodeship
          style={{ fontSize: "20px", color: "#2E2C5E", cursor: "pointer" }}
        />
      ) : status === "COMPLETED" ? (
        <CheckCircleFilled
          style={{ fontSize: "20px", color: "#138469", cursor: "pointer" }}
        />
      ) : status === "INPROGRESS" ? (
        <ClockCircleFilled
          style={{ fontSize: "20px", color: "#d4b106", cursor: "pointer" }}
        />
      ) : status === "FORCECLOSED" ? (
        <MinusCircleFilled
          style={{ fontSize: "20px", color: "#C3615E", cursor: "pointer" }}
        />
      ) : (
        <PlusCircleFilled
          style={{ fontSize: "20px", color: "#2E2C5E", cursor: "pointer" }}
        />
      )}
    </Box>
  );
};
