// src/features/outbound/outbound.validation.ts
import { Theme } from "@mui/material";
import { z } from "zod";

export const OrderFilterSchema = z.enum([
  "New",
  "In Progress",
  "All Orders",
  "Completed",
  "Short Closed"
] as const);

export const OrderResponseSchema = z.object({
  OrderID: z.number(),
  OrderNo: z.string(),
  Type: z.string().nullable(),
  Status: z.string().nullable(),
  RequestedItems: z.number(),
  AllocatedItems: z.number(),
  DispatchedItems: z.number(),
});

export const OutboundOrderStatus = {
  NEW: "NEW",
  ALLOCATED: "ALLOCATED",
  PICKED: "PICKED",
  DISPATCHED: "DISPATCHED",
  SHORTCLOSED: "SHORTCLOSED",
  TRANSFERRED: "TRANSFERRED",
  TO_ASSEMBLY: "TO-ASSEMBLY",


} as const;

export const getOutboundStatusColorMap = (
  theme: Theme,
): Record<string, string> => ({
  [OutboundOrderStatus.NEW.toLowerCase()]: theme.palette.grey[300],
  [OutboundOrderStatus.ALLOCATED.toLowerCase()]: theme.palette.info.light,
  [OutboundOrderStatus.PICKED.toLowerCase()]: "#d1c4e9", // custom purple
  [OutboundOrderStatus.DISPATCHED.toLowerCase()]: theme.palette.success.light,
  [OutboundOrderStatus.SHORTCLOSED.toLowerCase()]: theme.palette.error.light,
  [OutboundOrderStatus.TRANSFERRED.toLowerCase()]: theme.palette.warning.light,
  [OutboundOrderStatus.TO_ASSEMBLY.toLowerCase()]: "#80cbc4", // teal
});

export type OrderFilter = z.infer<typeof OrderFilterSchema>;
export type OrderFilterWithAll = OrderFilter;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
export type OutboundOrderStatus =
  (typeof OutboundOrderStatus)[keyof typeof OutboundOrderStatus];

//----------------------------------------order-allocation-dialog-----------------------------------
export const OrderItemSchema = z.object({
  ID: z.number().int().nonnegative(),
  ORDER_ID: z.number().int().nonnegative(),
  ORDER_NO: z.string(),
  STOCK_ID: z.string().uuid(),
  REQUESTED_QTY: z.number().int().nonnegative(),
  ALLOCATED_QTY: z.number().int().nullable(),
  AVAILABLE_QTY: z.number().int().nonnegative(),
  VARIANT_CODE: z.string(),
  VARIANT_NAME: z.string(),
  VARIANT_ID: z.number(),
  ORDER_ITEM_ID: z.number(),
});

export const OrderItemsResponseSchema = z.object({
  success: z.boolean(),
  orderItems: z.array(OrderItemSchema),
});

export const OrderItemsNewSchema = z.object({
  success: z.boolean(),
  data: z.array(OrderItemSchema),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderItemsResponse = z.infer<typeof OrderItemsResponseSchema>;
export type OrderNewItemshema = z.infer<typeof OrderItemsNewSchema>;
//---------------------------------------allocation table accordon----------------------------
//------------------get-all-order-allocation------------------------------------
const AllocationItemSchema = z.object({
  ID: z.number(),
  ORDER_ITEM_ID: z.number(),
  STOCK_ID: z.string(),
  TOTAL_ALLOCATED_QTY: z.number(),
  ALLOCATED_QTY: z.number(),
  VARIANT_CODE: z.string(),
  VARIANT_NAME: z.string(),
});

const AllocationGroupSchema = z.object({
  ID: z.number(),
  ALLOCATION_CODE: z.string(),
  allocations: z.array(AllocationItemSchema),
});

const AllocationsResponseSchema = z.object({
  success: z.boolean(),
  allocations: z.array(AllocationGroupSchema),
});

export type AllocationsResponse = z.infer<typeof AllocationsResponseSchema>;

//-------------------create allocation ----------------------------------
export const allocationItemSchema = z.object({
  orderItemId: z.number(),
  variantId: z.number(),
  allocatedQty: z.number(),
});

// Schema for an array of allocation items
export const createAllocationSchemaArray = z.array(allocationItemSchema);

// TypeScript type
export type CreateAllocationSchema = z.infer<
  typeof createAllocationSchemaArray
>;

//--------------------------get order by id ------------------------------

export const statisticsSchema = z.object({
  key: z.string(),
  value: z.number(),
});

export const orderResponseSchema = z.object({
  success: z.boolean(),
  OrderNo: z.string(),
  Type: z.string(),
  STATISTICS: z.array(statisticsSchema),
});

export type OrderItemResponse = z.infer<typeof orderResponseSchema>;

//-----------------------dispatched item -----------------------------

export const dispatchItemSchema = z.object({
  VARIANT_CODE: z.string(),
  VARIANT_NAME: z.string(),
  ATTRIBUTE_VALUE: z.string(),
  STATUS: z.string(),
  DISPATCH_ID: z.number(),
});

export const dispatchResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    pickedUp: z.array(dispatchItemSchema),
    others: z.array(dispatchItemSchema),
  }),
});

export type DispatchResponseType = z.infer<typeof dispatchResponseSchema>;

//-------------------------postCreate way bill---------------------------

export const idsSchema = z.object({
  allocationIds: z.array(z.number()),
});
export type createWayBillShcema = z.infer<typeof idsSchema>;

//--------------------------------------patch pick up items------------------
export const vinAllocationSchema = z.object({
  values: z.array(
    z.object({
      vin: z.string(),
      orderItemId: z.number(),
    }),
  ),
});

export type VinAllocationSchema = z.infer<typeof vinAllocationSchema>;

// -----------------------get items pickup----------------------------------

export const pickupSummarySchema = z.object({
  SKU: z.string(),
  VARIANT_NAME: z.string(),
  ALLOCATED: z.number(),
  PICKED: z.number(),
});

export const pickupItemShema = z.object({
  VARIANT_CODE: z.string(),
  VARIANT_NAME: z.string(),
  VIN: z.string(),
  STOCK_ID: z.string().uuid(),
  STATUS: z.string(),
  ORDER_ITEM_ID : z.number().optional(),
});

export const ItemLocationSchema = z.object({
  LOCATION_ID: z.number(),
  LOCATION_NAME: z.string(),
  items: z.array(pickupItemShema),
});

export const readyForPickupSchema = z.object({
  WAREHOUSE_ID: z.number(),
  WAREHOUSE_NAME: z.string(),
  locations: z.array(ItemLocationSchema),
});

export const pickupResponseSchema = z.object({
  success: z.boolean(),
  pickupSummary: z.array(pickupSummarySchema),
  readyForPickup: z.array(readyForPickupSchema),
});

export type PickupResponse = z.infer<typeof pickupResponseSchema>;

export type SkuItem = {
  sku: string;
  skuName: string;
  vin_number: string;
  stockId: number;
  storage: string;
  quantity?:number;
};

export type StorageData = {
  storageName: string;
  skuList: SkuItem[];
};
//---------------------------------------------------view page validators-----------------

export const statisticSchema = z.object({
  key: z.string(),
  value: z.union([z.string(), z.number()]),
});

export const orderDataSchema = z.object({
  STATISTICS: z.array(statisticSchema),
});

export const locationStateSchema = z.object({
  order: z
    .object({
      data: orderDataSchema,
    })
    .optional(),
});

/* --- Types inferred from Zod --- */
export type Statistic = z.infer<typeof statisticSchema>;
export type OrderData = z.infer<typeof orderDataSchema>;
export type LocationState = z.infer<typeof locationStateSchema>;
