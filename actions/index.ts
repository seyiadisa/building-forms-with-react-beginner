"use server";

import { productSchema, ProductInput, ProductErrors } from "@/schema";
import { z } from "zod";

type ActionState = {
  data?: ProductInput;
  errors?: ProductErrors;
  success?: boolean;
};

export async function createProduct(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  data["specifications"] = JSON.parse(formData.get("specifications") as string);
  const validatedData = productSchema.safeParse(data);

  if (!validatedData.success) {
    // Map Zod errors to { fieldName: message }
    const errors = z.treeifyError(validatedData.error).properties;

    return {
      errors,
      data: data as unknown as ProductInput,
    };
  }

  // Here you can perform actions such as saving to a DB

  return {
    success: true,
  };
}
