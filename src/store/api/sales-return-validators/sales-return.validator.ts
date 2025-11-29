import z from "zod";

// Zod schema and types
export const SalesReturnItemSchema = z.object({
  id: z.string(),
  returnId: z.string(),
  sourceOrderId: z.string().nullable(),
  quantity: z.number(),
  putAwayStatus: z.enum(["Approved","Return Approval Pending","All Returns"]),
});

export type SalesReturnItem = z.infer<typeof SalesReturnItemSchema>;


export const SalesReturnViewItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  vin: z.string(),
  quantity: z.number(),
  uom: z.string().nullable(),
  location: z.string(),
  // putAwayStatus: z.enum(["Not Placed", "Placed"]),
});

export type SalesReturnItemView = z.infer<typeof SalesReturnViewItemSchema>;
