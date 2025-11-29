// User interface
export interface IUser {
  name: string;
  email: string;
  role: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Generic API response
export interface IGenericResponse {
  data: string;
  message: string;
}

// Generic wrapper with typed data
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  statistics?: Record<string, number>;
}

// Full material item (matches GET /sku/:id)
export interface IMaterialItem {
  ID: number;
  MATERIAL_ID: number | null;
  VARIANT_CODE: string;
  VARIANT_NAME: string;
  DESCRIPTION: string;
  STATUS: string;
  EXPIRY_DATE: string | null; // ISO string from API
  STORAGE_CONDITION: string;
  PUTAWAY_ID: number | null;
  PICKUP_ID: number | null;
  WARRANTY_APPLICABLE: string | null; // ISO string from API
  RETURNABLE: boolean;
  DIMENSIONS: string;
  VOLUME: number | null;
  FRAGILE: boolean;
  VALUATION_TYPE: string;
  VALUATION_CLASS: string;
  PLANT: string;
  MRP_TYPE: string;
  VARIANT_TYPE?: string | null;
  PRICE: number;
  CURRENCY: string;
  PRICE_UNIT: number;
  PRICE_CONTROL: string;
  ABC_INDICATOR: string;
  UOM: string;
  MATERIAL_GROUP: string;
}

// API response for a single SKU
export interface ISkuResponse {
  success: boolean;
  data: IMaterialItem;
}

// Patch payload (all optional for partial update)
export interface IPatchSkuDetails {
  MATERIAL_ID?: number | null;
  VARIANT_CODE?: string | null;
  VARIANT_NAME?: string | null;
  DESCRIPTION?: string | null;
  STATUS?: string | null;
  EXPIRY_DATE?: Date | null;
  STORAGE_CONDITION?: string | null;
  PUTAWAY_ID?: number | null;
  PICKUP_ID?: number | null;
  WARRANTY_APPLICABLE?: Date | null;
  RETURNABLE?: boolean | null;
  DIMENSIONS?: string | null;
  VOLUME?: number | null;
  FRAGILE?: boolean | null;
  VALUATION_TYPE?: string | null;
  VALUATION_CLASS?: string | null;
  PLANT?: string | null;
  MRP_TYPE?: string | null;
  VARIANT_TYPE?: string | null; // nullable string
  PRICE?: number | null;
  CURRENCY?: string | null;
  PRICE_UNIT?: number | null;
  PRICE_CONTROL?: string | null;
  ABC_INDICATOR?: string | null;
  UOM?: string | null;
  MATERIAL_GROUP?: string | null; // nullable string
}

export interface OutboundApiResponse<T> {
  success: boolean;
  orders: T;
}

export interface OutboundApiNewResponse<T> {
  success: boolean;
  Data: T;
}
