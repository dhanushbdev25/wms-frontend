// Import Assets
import {
  FormOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  InboxOutlined,
  ExportOutlined,
  RollbackOutlined,
  PauseCircleOutlined,
  BuildOutlined,
  SafetyCertificateOutlined,
  FileAddOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  BarcodeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { ComponentType, lazy } from "react";

import Loadable from "../components/third-party/Loadable";

// Icons
const icons = {
  FormOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  InboxOutlined,
  ExportOutlined,
  RollbackOutlined,
  PauseCircleOutlined,
  BuildOutlined,
  SafetyCertificateOutlined,
  FileAddOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  BarcodeOutlined,
  AppstoreOutlined,
};

// Types
type IconComponent = typeof FormOutlined;
interface ScreenConfig {
  icon: IconComponent;
  element: ComponentType<unknown>;
}

interface SectionConfig {
  icon: IconComponent;
}

// Screen Imports
const QualityInspectionPage = Loadable(
  lazy(() => import("../pages/business/quality-inspection")),
);

const WarehouseManagementPage = Loadable(
  lazy(() => import("../pages/business/warehouse-management")),
);
const ManageWarehousePage = Loadable(
  lazy(() => import("../pages/business/warehouse-management/manage")),
);
const ViewWarehousePage = Loadable(
  lazy(() => import("../pages/business/warehouse-management/view")),
);

const ManageStorageLocationPage = Loadable(
  lazy(
    () =>
      import("../pages/business/warehouse-management/storage-location/manage"),
  ),
);
const ViewStorageLocationPage = Loadable(
  lazy(
    () =>
      import("../pages/business/warehouse-management/storage-location/view"),
  ),
);

const ManageSkuPage = Loadable(
  lazy(() => import("../pages/business/warehouse-management/sku/manage")),
);
const ViewSkuPage = Loadable(
  lazy(() => import("../pages/business/warehouse-management/sku/view")),
);
const MaterialManagementPage = Loadable(
  lazy(() => import("../pages/business/material-management")),
);
const ManageMaterialPage = Loadable(
  lazy(() => import("../pages/business/material-management/manage")),
);

const AssemblyPage = Loadable(lazy(() => import("../pages/business/assembly")));

const ViewAssemblyPage = Loadable(
  lazy(() => import("../pages/business/assembly/AssemblyItems")),
);
const CreateAssemblypage = Loadable(
  lazy(() => import("../pages/business/assembly/new-assemblyorder")),
);
const InboundPage = Loadable(
  lazy(() => import("../pages/business/inbound/index")),
);
const putawaypage = Loadable(
  lazy(() => import("../pages/business/inbound/view")),
);

const summarypage = Loadable(
  lazy(() => import("../pages/business/inbound/summary/summary")),
);

const OutboundPage = Loadable(
  lazy(() => import("../pages/business/outbound/index")),
);

const OutboundView = Loadable(
  lazy(() => import("../pages/business/outbound/outbound-shipping/view")),
);

const OutboundSummary = Loadable(
  lazy(() => import("../pages/business/outbound/outbound-summary/summary")),
);

const returnpage = Loadable(
  lazy(() => import("../pages/business/sales-return")),
);

const returnViewpage = Loadable(
  lazy(() => import("../pages/business/sales-return/view")),
);

const createReturn = Loadable(
  lazy(() => import("../pages/business/sales-return/create-Return")),
);
const onholdItemPage = Loadable(
  lazy(() => import("../pages/business/onhold-items/index")),
);
const onholdViewPage = Loadable(
  lazy(() => import("../pages/business/onhold-items/view")),
);
const AssemblyPageQualityCheck = Loadable(
  lazy(() => import("../pages/business/assembly/quality-check")),
);
const WarrantyCheck = Loadable(
  lazy(() => import("../pages/business/warranty/index")),
);
const WarrentDetails = Loadable(
  lazy(() => import("../pages/business/warranty/view-warranty")),
);
const WarrantyCreate = Loadable(
  lazy(
    () => import("../pages/business/warranty/create-warranty/create-warranty"),
  ),
);
// ==============================|| SCREEN LIST ||============================== //

export const Screens: Record<string, ScreenConfig> = {
  QUALITYINSPECTION: {
    icon: icons.CheckCircleOutlined,
    element: QualityInspectionPage,
  },
  MATERIAL_MANAGEMENT: {
    icon: icons.DatabaseOutlined,
    element: MaterialManagementPage,
  },

  INBOUND: {
    icon: icons.InboxOutlined,
    element: InboundPage,
  },
  INBOUND_PUTAWAY: {
    icon: icons.ContainerOutlined,
    element: putawaypage,
  },
  INBOUND_SUMMARY: {
    icon: icons.FileAddOutlined,
    element: summarypage,
  },

  OUTBOUND: {
    icon: icons.ExportOutlined,
    element: OutboundPage,
  },
  OUTBOUND_SHIPPING: {
    icon: icons.ShoppingOutlined,
    element: OutboundView,
  },

  OUTBOUND_SUMMARY: {
    icon: icons.FileAddOutlined,
    element: OutboundSummary,
  },

  CREATE_MATERIAL: {
    icon: icons.PlusOutlined,
    element: ManageMaterialPage,
  },
  EDIT_MATERIAL: {
    icon: icons.EditOutlined,
    element: ManageMaterialPage,
  },
  WAREHOUSE_MANAGEMENT: {
    icon: icons.AppstoreOutlined,
    element: WarehouseManagementPage,
  },
  CREATE_WAREHOUSE: {
    icon: icons.PlusOutlined,
    element: ManageWarehousePage,
  },
  EDIT_WAREHOUSE: {
    icon: icons.EditOutlined,
    element: ManageWarehousePage,
  },
  VIEW_WAREHOUSE: {
    icon: icons.EyeOutlined,
    element: ViewWarehousePage,
  },
  CREATE_STORAGE_LOCATION: {
    icon: icons.PlusOutlined,
    element: ManageStorageLocationPage,
  },
  EDIT_STORAGE_LOCATION: {
    icon: icons.EditOutlined,
    element: ManageStorageLocationPage,
  },
  VIEW_STORAGE_LOCATION: {
    icon: icons.EyeOutlined,
    element: ViewStorageLocationPage,
  },
  ADD_SKU: {
    icon: icons.PlusOutlined,
    element: ManageSkuPage,
  },
  EDIT_SKU: {
    icon: icons.EditOutlined,
    element: ManageSkuPage,
  },
  VIEW_SKU: {
    icon: icons.EyeOutlined,
    element: ViewSkuPage,
  },

  SALES_RETURN: {
    icon: icons.RollbackOutlined,
    element: returnpage,
  },

  SALES_RETURN_VIEW: {
    icon: icons.EyeOutlined,
    element: returnViewpage,
  },

  CREATE_RETURN: {
    icon: icons.PlusOutlined,
    element: createReturn,
  },

  ONHOLD_ITEMS: {
    icon: icons.PauseCircleOutlined,
    element: onholdItemPage,
  },
  ONHOLD_VIEW: {
    icon: icons.EyeOutlined,
    element: onholdViewPage,
  },
  ASSEMBLY: {
    icon: icons.BuildOutlined,
    element: AssemblyPage,
  },
  ASSEMBLY_ITEMS: {
    icon: icons.BarcodeOutlined,
    element: ViewAssemblyPage,
  },
  CREATE_ASSEMBLY: {
    icon: icons.PlusOutlined,
    element: CreateAssemblypage,
  },
  ASSEMBLY_QUALITY_CHECK: {
    icon: icons.CheckCircleOutlined,
    element: AssemblyPageQualityCheck,
  },
  WARRANTY: {
    icon: icons.SafetyCertificateOutlined,
    element: WarrantyCheck,
  },
  WARRANTY_VIEW: {
    icon: icons.EyeOutlined,
    element: WarrentDetails,
  },
  WARRANTY_CREATE: {
    icon: icons.PlusOutlined,
    element: WarrantyCreate,
  },
};

export const Sections: Record<string, SectionConfig> = {
  WMSINBOUND: {
    icon: icons.FormOutlined,
  },
};
