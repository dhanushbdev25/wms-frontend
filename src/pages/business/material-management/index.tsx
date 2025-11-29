import { useNavigate } from "react-router-dom";
import Header from "../../../components/common/header";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../components/common/table";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import StatisticsSummary from "../../../components/common/statistics-summary";
import { useGetAllMaterialsQuery } from "../../../store/api/material-management/api";
import { MaterialItem } from "../../../types/material";

const ListMaterials = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetAllMaterialsQuery(
    {},
    // { refetchOnMountOrArgChange: true }
  );
  const statisticsData = data?.statistics
    ? [
        { label: "Total Sku", value: data.statistics.totalSku ?? 0 },
        { label: "Raw Material", value: data.statistics.rawMaterial ?? 0 },
        { label: "Semi Finished", value: data.statistics.semiFinished ?? 0 },
        { label: "Package Material", value: data.statistics.packageMaterial ?? 0 },
        { label: "Finished Good", value: data.statistics.finishedGood ?? 0 },
      ]
    : [];

const normalizedData =
  data?.data?.map((item) => ({
      skuId: item.ID,
      skuCode: item.VARIANT_CODE,
      skuName: item.VARIANT_NAME,
      behaviour: item.Material?.MATERIAL_TYPE || "-",
      status: item.STATUS,
    }))
    ?.slice()     
    ?.reverse()  
  || [];


return (
  <>
    <BackdropLoader openStates={isLoading} />
    <Header
      title="Material Management"
      buttons={[
        {
          label: "Create material",
          color: "primary",
          variant: "contained",
          onClick: () => {
            navigate(`/${process.env.APP_NAME}/material-management/new`);
          },
        },
      ]}
    />

    {/* This won't show anything until backend adds statistics */}
    {data?.statistics && <StatisticsSummary data={statisticsData} />}

    <Table<MaterialItem>
      data={normalizedData}
      globalFilter
      filters={[
        { type: "select", title: "All Status", value: "status" },
        { type: "select", title: "All Behaviour", value: "behaviour" },
      ]}
    >
      <Cell type="text" title="SKU Name" value="skuName" />
      <Cell type="text" title="SKU Code" value="skuCode" />
      <Cell type="text" title="Behaviour" value="behaviour" />
      <Cell
        type="status"
        title="Status"
        value="status"
        colors={{ active: "green", inactive: "red" }}
      />
      <ActionCell>
        <Action
          type="edit"
          onClick={(cell) => {
            navigate(
              `/${process.env.APP_NAME}/material-management/${cell.row.original.skuId}/edit`
            );
          }}
        />
      </ActionCell>
    </Table>
  </>
);

};

export default ListMaterials;
