import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.enum(
    ["headphones", "earphones", "speakers"],
    "Category is required",
  ),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isFeatured: z.string().optional(),
  specifications: z
    .array(
      z.object({
        id: z.number(),
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .min(1, "Enter at least one specification"),
});

export type ProductInput = z.infer<typeof productSchema>;

export type ProductErrors = z.core.$ZodErrorTree<ProductInput>["properties"];
