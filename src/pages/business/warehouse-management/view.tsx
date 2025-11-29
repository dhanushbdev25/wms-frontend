import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import SectionNavigation from "./components/section-navigation";
import Overview from "./components/overview";
import StorageHierarchy from "./components/storage-hierarchy";
import SKU from "./components/sku";
import StorageLocation from "./components/storage-location";
import { useGetWarehouseDetailsQuery } from "../../../store/api/warehouse-management/warehouseApi";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { WarehouseDetails } from "../../../types/warehouse";
import Header from "../../../components/common/header";

const options = [
  {
    key: "overview",
    label: "Overview",
    icon: <WarehouseOutlinedIcon />,
    description: "Warehouse details and information",
  },
  {
    key: "hierarchy",
    label: "Storage Hierarchy",
    icon: <ListIcon />,
    description: "Manage storage levels and structure",
  },
  {
    key: "location",
    label: "Storage Location",
    icon: <StorageOutlinedIcon />,
    description: "View and manage storage locations",
  },
  {
    key: "sku",
    label: "SKU Configuration",
    icon: <CategoryOutlinedIcon />,
    description: "Configure SKU settings and details",
  },
];

const ViewWarehouseManagement = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [warehouseDetails, setWarehouseDetails] =
    useState<WarehouseDetails | null>(null);
  const [selected, setSelected] = useState<string>("overview");
  // const { data, isLoading, isSuccess } = useGetWarehouseDetailsQuery(id);

  const { data, isLoading, isSuccess } = useGetWarehouseDetailsQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    if (isSuccess) {
      setWarehouseDetails(data.data);
    }
  }, [isSuccess, data]);

  return (
    <>
      <BackdropLoader openStates={isLoading} />
      {warehouseDetails && (
        <>
          <Header
            onBack={() => {
              navigate(`/${process.env.APP_NAME}/warehouse-management`);
            }}
            title={warehouseDetails.WAREHOUSE_NAME || "Warehouse"}
            buttons={[
              // {
              //   label: "View Storage Layout",
              //   onClick: () => {},
              // },
              {
                label: "Create Storage Location",
                onClick: () => {
                  navigate(
                    `/${process.env.APP_NAME}/warehouse-management/${id}/storage-location/new`,
                  );
                },
              },
              {
                label: "Add SKU",
                onClick: () => {
                  navigate(
                    `/${process.env.APP_NAME}/warehouse-management/${id}/sku/new`,
                  );
                },
              },
            ]}
          />
          <Container
            maxWidth={false}
            sx={{
              mt: 3,
              px: { xs: 2, sm: 3 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                mb: 3,
              }}
            >
              <SectionNavigation
                options={options}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                minHeight: "400px",
                p: { xs: 2, sm: 3 },
                transition: "all 0.3s ease-in-out",
              }}
            >
              {selected === "overview" && (
                <Overview id={+(id || "")} {...warehouseDetails} />
              )}
              {selected === "hierarchy" && <StorageHierarchy />}
              {selected === "location" && <StorageLocation />}
              {selected === "sku" && <SKU />}
            </Box>
          </Container>
        </>
      )}
    </>
  );
};

export default ViewWarehouseManagement;
