"use client";

import { useActionState } from "react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/actions";

export default function ProductCreateForm() {
  const [state, formAction, isPending] = useActionState(createProduct, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 justify-center w-full h-screen max-w-lg my-12"
    >
      <Field>
        <FieldLabel htmlFor="name">Product name</FieldLabel>
        <Input
          id="name"
          name="name"
          placeholder="Sony WH-1000XM5"
          defaultValue={state.data?.name ?? ""}
          aria-invalid={!!state.errors?.name}
        />
        {state.errors?.name && <FieldError>{state.errors.name}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <Select name="category" defaultValue={state.data?.category}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="headphones">Headphones</SelectItem>
            <SelectItem value="earphones">Earphones</SelectItem>
            <SelectItem value="speakers">Speakers</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.category && (
          <FieldError>{state.errors.category}</FieldError>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          name="description"
          rows={5}
          placeholder="Describe the product..."
          defaultValue={state.data?.description ?? ""}
          aria-invalid={!!state.errors?.description}
        />
        {state.errors?.description && (
          <FieldError>{state.errors.description}</FieldError>
        )}
      </Field>

      <Field orientation="horizontal">
        <Checkbox
          id="isFeatured"
          name="isFeatured"
          defaultChecked={state.data?.isFeatured ?? false}
          aria-invalid={!!state.errors?.isFeatured}
        />
        <FieldLabel htmlFor="isFeatured">Mark as featured</FieldLabel>
        {state.errors?.isFeatured && (
          <FieldError>{state.errors.isFeatured}</FieldError>
        )}
      </Field>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating product..." : "Create product"}
      </Button>
      {state.success && (
        <p className="text-sm text-green-600">Product created successfully</p>
      )}
    </form>
  );
}
