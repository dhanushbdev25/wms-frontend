import { useNavigate, useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Action,
  ActionCell,
  Cell,
  Table,
} from "../../../../../components/common/table";
import BackdropLoader from "../../../../../components/third-party/BackdropLoader";
import { useGetAllSkuByWarehouseIdQuery } from "../../../../../store/api/warehouse-management/skuApi";
import { SkuDetails } from "../../../../../types/sku";

// ✅ Filters configuration (based on camelCase fields)
const filters: {
  type: "select";
  title: string;
  value: keyof SkuDetails;
}[] = [
  { type: "select", title: "All Status", value: "status" },
  { type: "select", title: "All Type", value: "type" },
  { type: "select", title: "All Location", value: "locations" },
];

const SKU = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //  Fetch SKU data using warehouse ID
  const { data, isLoading } = useGetAllSkuByWarehouseIdQuery(id);

  //  Normalize backend data (uppercase keys → camelCase)
  const normalizedData: SkuDetails[] =
    data?.data?.map((item: any) => ({
      id: item.VARIANT_ID,
      skuCode: item.VARIANT_CODE,
      skuName: item.VARIANT_NAME,
      status: item.STATUS,
      type: item.MATERIAL_TYPE,
      locations: item.LOCATIONS,
      lowStockAlert: item.LOW_STOCK_ALERT,
      highStockAlert: item.HIGH_STOCK_ALERT,
    })) || [];

  return (
    <>
      <BackdropLoader openStates={isLoading} />

      <Table<SkuDetails> data={normalizedData} globalFilter filters={filters}>
        <Cell type="text" title="SKU Code" value="skuCode" />
        <Cell type="text" title="SKU Name" value="skuName" />
        <Cell
          type="text"
          title="Status"
          value="status"
          colors={{ ACTIVE: "green", INACTIVE: "red" }}
        />
        <Cell type="text" title="Type" value="type" />
        <Cell type="text" title="Location" value="locations" />
        <Cell type="text" title="Low Stock" value="lowStockAlert" />
        <Cell type="text" title="High Stock" value="highStockAlert" />

        <ActionCell>
          <Action
            type="view"
            id="nav-btn"
            icon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={(cell) =>
              navigate(
                `/${process.env.APP_NAME}/warehouse-management/${id}/sku/${cell.row.original.id}`,
              )
            }
          />
          <Action
            type="edit"
            id="nav-btn"
            onClick={(cell) =>
              navigate(
                `/${process.env.APP_NAME}/warehouse-management/${id}/sku/${cell.row.original.id}/edit`,
              )
            }
          />
        </ActionCell>
      </Table>
    </>
  );
};

export default SKU;
