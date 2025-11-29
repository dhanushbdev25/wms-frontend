import { Grid, useTheme } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../../components/common/button/Button";
import Header from "../../../components/common/header";
import { Table, Cell } from "../../../components/common/table";
import { getStatusColorMap } from "../../../helpers/assemblyEnums";
import StatisticsSummary from "../warehouse-management/components/location-overview/statistics-summary";
import {
  useGetAssemblyOrderByIdQuery,
  usePostFinishGoodMutation,
} from "../../../store/api/assembly/assembly-api";
import { AssemblyItemApiType } from "../../../store/api/assembly-validator/assembly.validator";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import FinishedGoodsDialog from "./finished-goods";
import Swal from "sweetalert2";

export default function AssemblyPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const statusColorMap = getStatusColorMap(theme);

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [openFinishedGoods, setOpenFinishedGoods] = useState(false);

  const location = useLocation();
  const assemblyOrderId = location.state?.assemblyOrderId;
  const orderID = location.state?.id;

  const { data, isLoading } = useGetAssemblyOrderByIdQuery(orderID, {
    refetchOnMountOrArgChange: true,
  });

  const [postFinishGood, { isLoading: assemblydataLoading }] =
    usePostFinishGoodMutation();

  const statistics = data?.data?.data?.statatics || [];

  const assemblyItems: AssemblyItemApiType[] =
    data?.data?.data?.assemblyItems?.map((item: any) => ({
      id: item.STOCK_ID,
      sku: item.VARIANT_CODE,
      skuName: item.VARIANT_NAME,
      vinNumber: item.VARIANT_VALUES?.VIN ?? "",
      engineNumber: item.VARIANT_VALUES?.ENGINENO ?? "",
      status:
        item.STATUS.toLowerCase() === "finished_goods"
          ? "Finished Goods"
          : item.STATUS.toLowerCase() === "asm_qi_failed"
            ? "ASM QI Failed"
            : item.STATUS.toLowerCase() === "asm_qi_passed"
              ? "ASM QI Passed"
              : item.STATUS.toLowerCase() === "pickedup"
              ? "Picked Up" : item.STATUS,
      Refdocno: item.REF_DOC_NO,
      Refdocapp: item.REF_DOC_APPROVED,
    })) || [];

  const handleGoods = async () => {
    const selectedIndexes = Object.keys(rowSelection).map(Number);

    const selectedStockIds = selectedIndexes.map((i) => assemblyItems[i].id);

    const payload = {
      stockIds: selectedStockIds,
    };

    try {
      const res = await postFinishGood({ orderID, body: payload }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.message || "Items marked as finish goods successfully",
      });
      setRowSelection({});
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Something went wrong",
      });
    }
  };

  const showRefDocColumns = assemblyItems?.some((item) => item?.Refdocno);

  return (
    <>
      <BackdropLoader openStates={isLoading || assemblydataLoading} />
      <Header
        title={`Assembly Order: ${assemblyOrderId}`}
        onBack={() => navigate(-1)}
        buttons={[
          // {
          //   label: "Finished Goods",
          //   variant: "outlined",
          //   onClick: () => setOpenFinishedGoods(true),
          // },
        ]}
      />

      <StatisticsSummary data={statistics} />

      <Grid sx={{ m: 1, display: "flex", justifyContent: "flex-end" }}>
        {Object.keys(rowSelection).length > 0 && (
          <Button label="Convert to finished Goods" onClick={handleGoods} />
        )}
      </Grid>
      <Table<AssemblyItemApiType>
        data={assemblyItems}
        // enableRowSelection
        enableRowSelection={(row) =>
          row.original.status?.toLowerCase() == "asm qi passed"
        }
        state={{ rowSelection }}
        onRowSelectionChange={setRowSelection}
        sx={{ mt: 1 }}
      >
        <Cell type="text" title="SKU" value="sku" />
        <Cell type="text" title="SKU Name" value="skuName" />
        <Cell type="text" title="VIN Number" value="vinNumber" />
        <Cell type="text" title="Engine Number" value="engineNumber" />

        {showRefDocColumns && (
          <Cell type="text" title="REF DOC NO" value="Refdocno" />
        )}
        {showRefDocColumns && (
          <Cell type="boolean" title="REF DOC Approved" value="Refdocapp" />
        )}

        <Cell
          type="status"
          title="Status"
          value="status"
          colors={statusColorMap}
        />

        <Cell
          type="custom"
          title="Action"
          value="status"
          render={(cell) => (
            
            <Button
              label="Conduct QI"
              size="small"
              variant="outlined"
              sx={{
                color: theme.palette.grey[700],
                borderColor: theme.palette.grey[400],
                backgroundColor: theme.palette.grey[300],
                "&:hover": {
                  backgroundColor: theme.palette.background.paper,
                  borderColor: theme.palette.grey[400],
                },
                textTransform: "none",
              }}
              onClick={() =>
                navigate("quality-check", {
                  state: { id: orderID, stockid: cell.row.original.id },
                })
              }
              disabled={
                cell.row.original.status === "ASM QI Passed" ||
                cell.row.original.status === "ASM QI Failed" ||
                cell.row.original.status === "Finished Goods"
              }
            />
          )}
        />
      </Table>
      <FinishedGoodsDialog
        open={openFinishedGoods}
        onClose={() => setOpenFinishedGoods(false)}
        data={assemblyItems}
      />
    </>
  );
}
