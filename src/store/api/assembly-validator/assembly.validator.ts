import { z } from "zod";

// -------------------
// Schemas
// -------------------

// AssemblyItem schema
export const AssemblyItemSchema = z.object({
  ID: z.number().int().positive({ message: "ID is required" }),
  SKU: z.string().min(1, { message: "SKU is required" }),
  SKU_Name: z.string().min(1, { message: "SKU Name is required" }),
  VIN_Number: z.string().min(1, { message: "VIN Number is required" }),
  Engine_Number: z.string().min(1, { message: "Engine Number is required" }),
  STATUS: z.enum(["In-Assembly", "Asm-QI-Passed", "Asm-QI-Failed"], {
    message: "Invalid status",
  }),
  ACTION: z.boolean(),
});

// ResponseData schema
export const ResponseDataSchema = z.object({
  ID: z.number().int().positive(),
  ASSEMBLY_ORDER_ID: z.string().min(1, { message: "Order ID is required" }),
  STATISTICS: z.array(
    z.object({
      label: z.string().min(1, { message: "Statistic label is required" }),
      value: z.number(),
    }),
  ),
  ASSEMBLY_ITEMS: z.array(AssemblyItemSchema),
});

// SampleResponse schema (wraps ResponseData)
export const SampleResponseSchema = z.object({
  data: ResponseDataSchema,
});

export const AssemblyOrderSchema = z.object({
  id: z.number().int().positive({ message: "ID must be a positive integer" }),
  orderNo: z.string().min(1, { message: "Order number is required" }),
  status: z.enum(["Yet to Start", "In Progress", "Completed"], {
    message: "Invalid status value",
  }),
  requestedItems: z.number().nonnegative({ message: "Requested items cannot be negative" }),
  allocatedItems: z.number().nonnegative({ message: "Allocated items cannot be negative" }),
  receivedItems: z.number().nonnegative({ message: "Received items cannot be negative" }),
  finishedGoods: z.number().nonnegative({ message: "Finished goods cannot be negative" }),
});

// Assembly API Response schema (entire API payload)
export const AssemblyApiResponseSchema = z.object({
  success: z.boolean().nullable(),
  data: z.array(AssemblyOrderSchema).nonempty({ message: "Data array cannot be empty" }),
});

export const AssemblyItemApiSchema = z.object({
  id: z.number().int(),
  sku: z.string(),
  skuName: z.string(),
  vinNumber: z.string(),
  engineNumber: z.string().optional(), // make it optional
  status: z.enum(["In Assembly", "Asm QI Passed", "Asm QI Failed"]),
  Refdocno:z.string().optional
});

export const AssemblyOrderApiSchema = z.object({
  message: z.string(),
  data: z.object({
    statatics: z.array(
      z.object({
        key: z.string(),
        value: z.number(),
      })
    ),
    assemblyItems: z.array(AssemblyItemApiSchema),
  }),
});

// -------------------
// Types
// -------------------

export type AssemblyItemType = z.infer<typeof AssemblyItemSchema>;
export type ResponseDataType = z.infer<typeof ResponseDataSchema>;
export type SampleResponseType = z.infer<typeof SampleResponseSchema>;

export type AssemblyOrderType = z.infer<typeof AssemblyOrderSchema>;
export type AssemblyApiResponseType = z.infer<typeof AssemblyApiResponseSchema>;

export type AssemblyItemApiType = z.infer<typeof AssemblyItemApiSchema>;
export type AssemblyOrderApiType = z.infer<typeof AssemblyOrderApiSchema>;
