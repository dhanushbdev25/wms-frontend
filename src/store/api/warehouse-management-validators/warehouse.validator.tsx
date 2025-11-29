import { SkuDetailById } from "../../../types/sku";
import z from "zod";

export const warehouseSchema = z.object({
  warehouseName: z.string().min(1, "Warehouse Name is required"),
  warehouseCode: z.string().min(1, "Warehouse Code is required"),
  status: z.string().min(1, "Status is required"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pinCode: z.string().min(1, "Pincode is required"),
  managerId: z.coerce.number().int().min(1, "Manager is required"),
});

export const storageLocationSchema = z.object({
  locationName: z.string().min(1, "Location name is required"),

  hierarchyId: z.coerce
    .number().min(1, "Location type is required"),

  locationCode: z.string().min(1, "Location ID is required"),

  parentHierarchyName: z.string().optional(),

  parentLocationId: z.coerce.number().optional(),

  status: z.string().min(1, "Status is required"),

  locationPurpose: z.string().min(1, "Location Purpose is required"),

  condition: z.string().min(1, "Location Condition is required").optional(),
  uom: z.string().min(1, "Unit of Measurement is required").optional(),

  fullSize: z
    .coerce
    .number({ message: "Storage Full Capacity is required" })
    .min(1, "Storage Full Capacity is required")
    .optional(),

  maxSize: z
    .coerce
    .number({ message: "Storage Max Capacity is required" })
    .min(1, "Storage Max Capacity is required")
    .optional(),
});


export const skuSchema = z.object({
  description: z.string().min(1, "Description is required"),
  VariantId: z
    .number({ message: "SKU Name is required" })
    .min(1, "Invalid value"),
  VariantCode: z.string().min(1, "SKU Code is required"),
  MaterialId: z
    .number({ message: "SKU Id is required" })
    .min(1, "Invalid value"),
  MaterialType: z.string().min(1, "Material Type is required"),
  status: z.string().min(1, "Status is required"),
  lowStockAlert: z.number().min(1, "Low Stock Alert is required"),
  highStockAlert: z.number().min(1, "High Stock Alert is required"),
  // storageLocations: z.array(z.any()).min(1, "Storage Locations is required"),
});

// Define request arg types
export type WarehouseIdArg = number | string;
export type ManageWarehouseArg = {
  id?: number | string;
  WAREHOUSE_CODE: string;
  WAREHOUSE_NAME: string;
  STATUS: string;
  ADDRESS: string;
  STATE: string;
  CITY: string;
  PIN_CODE: string;
  MANAGER_ID: number;
  WAREHOUSE_TYPE: string;
};

export type LocationIdArg = string | number;

export type CreateLocationArg = {
  id: number | string; // warehouseId
  name: string;
  code: string;
  parentId?: number | string;
};

export type UpdateLocationArg = {
  id: number | string; // locationId
  name?: string;
  code?: string;
};

export type ManageLocationArg = CreateLocationArg | UpdateLocationArg;

// For fetching hierarchy of a warehouse
export type GetStorageHierarchyArg = number;
// warehouseId

// For fetching hierarchy location with warehouseId and level
export interface GetStorageHierarchyLocationArg {
  id: number;
  hierarchyLevel: number | string;
}

// For managing hierarchy (create/update)
export interface ManageStorageHierarchyArg {
  id: number;
  action: "update" | "create";
  [key: string]: unknown;
}

export type GetSkuLocationDetailArg = {
  warehouseId: number | string;
  id: number | string;
};

export type ManageSkuArg = SkuDetailById & { id?: number };
