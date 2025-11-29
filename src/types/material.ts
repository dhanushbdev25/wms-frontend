import { SkuDetail } from "./sku";

export interface MaterialItem {
  skuId: number;
  skuCode: string;
  skuName: string;
  status: string;
  behaviour: string;
}

export interface Material {
  ID: number;
  MATERIAL_ID: number;
  VARIANT_CODE: string;
  VARIANT_NAME: string;
  DESCRIPTION: string;
  STATUS: string;
  EXPIRY_DATE: string;
  STORAGE_CONDITION: string;
  PUTAWAY_ID: number;
  PICKUP_ID: number;
  WARRANTY_APPLICABLE: string;
  RETURNABLE: boolean;
  DIMENSIONS: string;
  VOLUME: number;
  FRAGILE: boolean;
  VALUATION_TYPE: string;
  VALUATION_CLASS: string;
  PLANT: string;
  MRP_TYPE: string;
  PRICE: number;
  CURRENCY: string;
  PRICE_UNIT: 1;
  PRICE_CONTROL: string;
  ABC_INDICATOR: string;
  UOM: string;
  MATERIAL_GROUP: string;
  MATERIAL_CODE: any;
}

export const DEFAULT_VALUES: SkuDetail = {
  VariantId: "",
  VariantCode: "",
  MaterialId: "",
  MaterialType: "",
  status: "",
  lowStockAlert: "",
  highStockAlert: "",
  description: "Test",
  storageLocations: [],
};
