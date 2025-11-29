import { Theme } from "@mui/material";

export const AssemblyItemsStatus = {
  IN_ASSEMBLY: "In-Assembly",
  ASM_QI_PASSED: "ASM QI Passed",
  ASM_QI_FAILED: "ASM QI Failed",
  REQUESTED_QUANTITY: "Requested-Quantity",
  ALLOCATED: "Allocated",
  RECEIVED: "Received",
  FINISHED_GOODS: "Finished Goods",
};

export type AssemblyItemsStatus =
  (typeof AssemblyItemsStatus)[keyof typeof AssemblyItemsStatus];

export const getStatusColorMap = (theme: Theme): Record<string, string> => ({
  [AssemblyItemsStatus.IN_ASSEMBLY.toLowerCase()]: theme.palette.warning.light,
  [AssemblyItemsStatus.ASM_QI_PASSED.toLowerCase()]: theme.palette.success.main,
  [AssemblyItemsStatus.ASM_QI_FAILED.toLowerCase()]: theme.palette.error.main,
  [AssemblyItemsStatus.REQUESTED_QUANTITY.toLowerCase()]:
    theme.palette.info.light,
  [AssemblyItemsStatus.ALLOCATED.toLowerCase()]: theme.palette.primary.light,
  [AssemblyItemsStatus.RECEIVED.toLowerCase()]: theme.palette.secondary.light,
  [AssemblyItemsStatus.FINISHED_GOODS.toLowerCase()]:
    theme.palette.success.dark,
});
