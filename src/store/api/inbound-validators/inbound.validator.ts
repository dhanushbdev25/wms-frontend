import { z } from "zod";

// -------------------- SKU DETAILS --------------------
export const PutAwaySkuDetailsSchema = z
  .object({
    ID: z.number().optional(),
    PACKING_LIST_ITEM_ID: z.number(),
    SKU_NAME: z.string(),
    SKU_CODE: z.string(),
    VIN_NUMBER: z.string().optional().nullable(),
    UOM: z.string(),
    ITEM_STATUS: z.string(),
    SERIALIZED: z.boolean(),
    LOCATION_STATUS: z.string(),
    QTY: z.coerce.number().optional().nullable(),
    TYPE: z.string().optional(),
    GRN_STATUS: z.string().optional(),
    GRN_NO: z.string().optional().nullable(),
  })
  .transform((val) => ({
    id: val.ID,
    skuName: val.SKU_NAME,
    sku: val.SKU_CODE,
    vin_number: val.VIN_NUMBER,
    uom: val.UOM,
    itemStatus: val.ITEM_STATUS,
    locationStatus: val.LOCATION_STATUS,
    serialized: val.SERIALIZED,
    packageListItemId: val.PACKING_LIST_ITEM_ID,
    quantity: val.QTY,
    type: val.TYPE,
    grn_status: val.GRN_STATUS,
    grn_no: val.GRN_NO,
  }));

export type PutAwaySkuDetails = z.infer<typeof PutAwaySkuDetailsSchema>;

// -------------------- STORAGE DATA --------------------
export const StorageDataSchema = z
  .object({
    STORAGE_ID: z.number().nullable(),
    STORAGE_NAME: z.string(),
    SKU_LIST: z.array(PutAwaySkuDetailsSchema),
  })
  .transform((val) => ({
    storageId: val.STORAGE_ID,
    storageName: val.STORAGE_NAME,
    skuList: val.SKU_LIST,
  }));

export type StorageData = z.infer<typeof StorageDataSchema>;

// -------------------- STORAGE RESPONSE --------------------
export const StorageResponseSchema = z.object({
  message: z.string(), // <-- top-level message
  data: z.object({
    success: z.boolean().optional(),
    total_item_count: z.number(),
    putawayItems: z.array(StorageDataSchema).optional(),
    placedItems: z.array(StorageDataSchema).optional(),
  }),
});

export type StorageResponse = z.infer<typeof StorageResponseSchema>;

// -------------------- OTHER TYPES --------------------
export type BinningBody = {
  type: string;
  LOCATION_ID: number;
};

export interface InboundOrder {
  ID: number;
  CONTAINER_NO: string;
  ORDER_NO: string;
  TYPE: string;
  STATUS: string;
  EXPECTED_ITEMS: number;
  RECEIVED_ITEMS: number;
  ON_HOLD_ITEMS: number;
}

// -------------------- STATISTICS --------------------
const StatisticSchema = z.object({
  key: z.string(),
  value: z.number(),
});

// -------------------- QUALITY INSPECTION --------------------
export const QualityInspectionQuestionSchema = z.object({
  ID: z.number(),
  QUESTION: z.string(),
  OPTIONS: z.string(),
  COMMENT: z.boolean(),
  ATTACHMEN: z.boolean(),
  STATUS: z.enum(["Active", "Inactive"]),
});

const ContainerQIItemSchema = z.object({
  ID: z.number(),
  PACKING_LIST_ID: z.number(),
  QUESTION: z.string(),
  ANSWER: z.string(),
  COMMENT: z.string(),
  ATTACHMENT: z.string(),
  QualityInspectionQuestion: QualityInspectionQuestionSchema,
});

const ContainerQISchema = z.object({
  INSPECTION: z.string(),
  STATUS: z.string(),
  data: z.array(ContainerQIItemSchema),
});

const ItemQIItemSchema = z.object({
  ID: z.number(),
  PACKING_LIST_ID: z.number(),
  MATERIAL_ID: z.number(),
  VARIANT_ID: z.number(),
  TYPE: z.string(),
  QTY: z.string(),
  UOM: z.string(),
  STATUS: z.string(),
  REMARKS: z.string(),
  VIN: z.string(),
  ENGINENO: z.string(),
  VARIANT_NAME: z.string(),
  VARIANT_CODE: z.string(),
});

const ItemQISchema = z.object({
  INSPECTION: z.string(),
  STATUS: z.string(),
  data: z.array(ItemQIItemSchema),
});

const InspectionData = z.object({
  inspectionData: ItemQISchema,
  disabled: z.boolean().optional(),
  ID: z.number(),
  serialized: z.boolean(),
  setEnablePutAway: z.any(),
});

// -------------------- PACKAGE DATA --------------------
const PackageDataSchema = z.object({
  ID: z.number(),
  PO_NO: z.string(),
  SHIPMENT_ADVICE_NO: z.string(),
  CONTAINER_NO: z.string(),
  STATISTICS: z.array(StatisticSchema),
  CONTAINER_QUALITY_INSPECTION: ContainerQISchema,
  ITEM_QUALITY_INSPECTION: ItemQISchema,
  QUALITY_INSPECTION_QUESTIONS: ContainerQIItemSchema,
  SERIALIZED: z.boolean(),
});

export const PackageApiResponseSchema = z.object({
  success: z.boolean(),
  data: PackageDataSchema,
});

export type QualityQuestions = z.infer<typeof ContainerQIItemSchema>;
export type PackageApiResponse = z.infer<typeof PackageApiResponseSchema>;

export type qualityinspection = z.infer<typeof ItemQISchema>;

const postContainerQIItemSchema = z.object({
  QUESTION_ID: z.number(),
  ANSWER: z.string(),
  COMMENT: z.string(),
  ATTACHMENT: z.string(),
});

export type ContainerQualityInspection = z.infer<
  typeof postContainerQIItemSchema
>;
export type ContainerQualityInspectionArray = ContainerQualityInspection[];

const ItemQualitySchema = z.object({
  ID: z.number().optional(),
  QTY: z.number().optional(),
  STATUS: z.string(),
});

export type ItemsSchema = z.infer<typeof ItemQualitySchema>;

export const StorageLocationSchema = z.object({
  LOCATION_ID: z.number(),
  LOCATION_CODE: z.string(),
});
export type StorageLocation = z.infer<typeof StorageLocationSchema>;

export const BinLocationResponseSchema = z.object({
  success: z.boolean(),
  locations: z.array(StorageLocationSchema),
});
export type BinLocationResponse = z.infer<typeof BinLocationResponseSchema>;

export type BinLocationArgs = number;

export type ItemType = {
  skuName: string;
  sku: string;
  vin_number: string;
  uom: string;
  itemStatus: string;
  locationStatus: string;
  serialized: boolean;
  storageId: number;
  storageName: string;
  packageListItemId: number;
};

export type BinningItemType = {
  ID: number;
  UNIQUE_ID: string | null;
  MATERIAL_ID: number;
  MATERIAL_VARIANT_ID: number;
  QTY: string;
  UOM: string;
  STATUS: string;
  OUID: number;
  LOCATION_ID: number;
  WAREHOUSE_ID: number;
  BINNING_DATE: string;
  BATCH_NO: string | null;
  MFG_DATE: string | null;
  EXPIRY_DATE: string | null;
  QI_STATUS: string | null;
  QI_DATE: string | null;
  DISPATCH_DATE: string | null;
  HU_ID: string | null;
};

export type BinningResponse = BinningItemType[];

export type BulkScanRequest = {
  ITEM_IDS: number[];
};

export type InspectionDataProps = z.infer<typeof InspectionData>;

const GrnResponse = z.object({
  success: z.boolean(),
  data: z.object({
    ID: z.number(),
    GRN_NO: z.string(),
    GRN_STATUS: z.enum(["PENDING APPROVAL", "APPROVED", "REJECTED"]),
  }),
});

export type GrnResponse = z.infer<typeof GrnResponse>;

const inspectionItemSchema = z.object({
  questionId: z.number().optional(),
  status: z.enum(["pass", "fail"]).optional(),
  comment: z.string().optional(),
  files: z.array(z.instanceof(File)).optional(),
});

export const inspectionFormSchema = z.object({
  items: z.array(inspectionItemSchema),
});

export type InspectionForm = z.infer<typeof inspectionFormSchema>;

export const OrderFilterSchema = z.enum([
  "GRN Uunder Approval",
  "Approved",
  "All Orders",
  "New",
] as const);

export type OrderFilter = z.infer<typeof OrderFilterSchema>;

export type InboundOrderRow = {
  id: number;
  containerId: string;
  orderId: string;
  orderType: string;
  status: string;
  expectedItems: number;
  receivedItems: number;
  onHoldItems: number;
};

export type ResponseData = {
  type: string; // external flag, e.g., "Place Items", "GRN"
  message: string; // the actual response message
};
