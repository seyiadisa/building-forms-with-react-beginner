"use server";

import { productSchema, ProductInput, ProductErrors } from "@/schema";
import { z } from 'zod';

type ActionState = {
  data?: ProductInput
  errors?: ProductErrors
  success?: boolean
}

export async function createProduct(
    _prevState: ActionState,
    formData: FormData
  ): Promise<ActionState> {
    // convert the FormData to a JS object 
    const data = Object.fromEntries(formData.entries());

    const validatedData = productSchema.safeParse(data);

    // if you prefer not to use zod, this is where you would
    // implement your validation logic
    if (!validatedData.success) {
      const errors = z.flattenError(validatedData.error).fieldErrors;
      return {
        errors,
        data: data as ProductInput 
      };
    }

    // Here you can perform actions such as saving to a DB
    // or sending a request to an API
      
    return {
      success: true,
    };
 } 