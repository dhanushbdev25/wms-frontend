import { PutAwaySkuDetails } from "../store/api/inbound-validators/inbound.validator";

export type RawSkuItem = {
  skuName?: string;
  SKU_NAME?: string;
  sku?: string;
  SKU_CODE?: string;
  vin_number?: string;
  VIN_NUMBER?: string;
  uom?: string;
  UOM?: string;
  itemStatus?: string;
  ITEM_STATUS?: string;
  locationStatus?: string;
  LOCATION_STATUS?: string;
  serialized?: boolean;
  SERIALIZED?: boolean;
  packageListItemId?: number;
  PACKING_LIST_ITEM_ID?: number;
  quantity?: number;
};

export type StorageWithSkuList = {
  skuList?: RawSkuItem[];
};

export const normalizeItem = (item: RawSkuItem): PutAwaySkuDetails => ({
  id: item.id ?? "",
  type: item.type ?? "",
  skuName: item.skuName ?? item.SKU_NAME ?? "",
  sku: item.sku ?? item.SKU_CODE ?? "",
  vin_number: item.vin_number ?? item.VIN_NUMBER ?? "",
  uom: item.uom ?? item.UOM ?? "",
  itemStatus: item.itemStatus ?? item.ITEM_STATUS ?? "",
  locationStatus: item.locationStatus ?? item.LOCATION_STATUS ?? "",
  serialized: item.serialized ?? item.SERIALIZED ?? false,
  packageListItemId: item.packageListItemId ?? item.PACKING_LIST_ITEM_ID ?? 0,
  quantity: item.quantity ?? item.quantity ?? 0,
});
