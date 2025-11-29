import z from "zod";

export const OnHoldItemDetailSchema = z.object({
  id: z.string(),
  skuName: z.string(),
  skuCode: z.string(),
  vin_number: z.string().optional(),
  quantity: z.number().optional(),
  uom: z.string(),
  status: z.enum(["Pending", "Sent To Put-Away", "Sent To Scrap"]),
});

export type OnHoldItemDetail = z.infer<typeof OnHoldItemDetailSchema>;
