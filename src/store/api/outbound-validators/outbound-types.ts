export type AllocationEntry = {
  allocationId: string;
  status: "Yet to Pick" | "Picked-Up" | "Dispatched";
  editable: boolean;
};

export type SKUEntry = {
  sku: string;
  skuName: string;
  requestedQty: number;
  allocatedQty: number;
  availableQty: number;
  newAllocation: number;
};

export type DispatchEntry = {
  id: number;
  sku: string;
  skuName: string;
  vinNumber: string;
  status: "Picked-Up" | "Item Sold" | "Transferred" | "To Assembly";
  quantity?: number;
};

export type SkuItem = {
  skuName: string;
  sku: string;
  vin_number: string;
  storage: string;
};

export type AllotedItem = {
  skuName: string;
  sku: string;
  Allocated: number;
  Picked: number;
};

export type StorageTable = {
  storageName: string;
  skuList: SkuItem[];
};

export type OrderItemRow = {
  id: number;
  sku: string;
  skuName: string;
  requestedQty: number;
  allocatedQty: number;
  availableQty: number;
  newAllocation: number;
  stockId: string;
  varientId: number;
  orderItemId: number;
};
