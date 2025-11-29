export interface SkuDetails {
  id: number;
  skuCode: string;
  skuName: string;
  status: string;
  type: string | null;
  locations: string;
  lowStockAlert: number;
  highStockAlert: number;
  [key: string]: string | number | null;
}

export interface SkuData {
  ID: number;
  VARIANT_CODE: string;
  VARIANT_NAME: string;
  Material: {
    MATERIAL_TYPE: string;
  };
  MATERIAL_ID: number;
}

export interface StorageLocationData {
  LOCATION_ID: number;
  LOCATION_CODE: string;
  HIERARCHY_LEVEL: string;
  CONDITION: string;
  LOCATION_NAME: string;
}

export interface StorageLocationMapping {
  location: string;
  warehouseId: number;
  warehouseLocationId: string;
  type: string;
  condition: string;
  assignedCapacity: string;
  maximumCapacity: string;
  receivingStatus: string;
  stockQuality?: string;
}

export interface SkuDetail {
  VariantId: number | string;
  VariantName?: string;
  VariantCode: string;
  MaterialId: number | string;
  MaterialType: string;
  status: string;
  lowStockAlert: number | string;
  highStockAlert: number | string;
  description: string;
  storageLocations: StorageLocation[];
}

export interface StorageLocation {
  location: string;
  warehouseId: number;
  warehouseLocationId: number;
  stockQuality: string;
  receivingStatus: string;
  type: string;
  condition: string;
  assignedCapacity: number;
  maximumCapacity: number;
}

export interface SkuDetailById {
  VARIANT_ID: number | string;
  VARIANT_NAME?: string;
  VARIANT_CODE: string;
  MATERIAL_ID: number | string;
  MATERIAL_TYPE: string;
  STATUS: string;
  LOW_STOCK_ALERT: number | string;
  HIGH_STOCK_ALERT: number | string;
  DESCRIPTION: string;
  STORAGE_LOCATIONS: StorageLocationByVariantId[];
}

export interface StorageLocationByVariantId {
  LOCATION: string;
  WAREHOUSE_ID: number;
  WAREHOUSE_LOCATION_ID: number;
  STOCK_QUALITY?: string;
  RECEIVING_STATUS: string;
  TYPE: string;
  CONDITION: string;
  ASSIGNED_CAPACITY: number;
  MAXIMUM_CAPACITY: number;
}

export interface MaterialItem {
  skuid: number;
  skucode: string;
  skuname: string;
  status: string;
}
