import z from "zod";

export const schema = z.object({
  materialCode: z.string().min(1, "Material code is required"),
  variantCode: z.string().min(1, "Variant code is required"),
  variantName: z.string().min(1, "Variant name is required"),
  variantDescription: z.string().min(1, "Material description is required"),
  status: z.string().min(1, "Status is required"),
  uom: z.string().min(1, "Unit of measure is required"),
  materialGroup: z.string().optional(),
});

export type MaterialFormValues = z.infer<typeof schema>;

export type ManageMaterialArg = {
  id?: number;
  MATERIAL_CODE: string;
  VARIANT_CODE: string;
  VARIANT_NAME: string;
  DESCRIPTION: string;
  STATUS: string;
  UOM: string;
};
