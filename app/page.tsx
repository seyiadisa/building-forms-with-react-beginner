"use client";

import { useActionState, useReducer } from "react";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
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
import { Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/actions";

type Specification = {
  id: number;
  label: string;
  value: string;
};

type SpecificationAction =
  | {
      type: "added";
    }
  | {
      type: "deleted";
      id: number;
    }
  | {
      type: "updated";
      id: number;
      field: Pick<Specification, "label" | "value">;
      // fieldValue: string;
    };

let nextId = 1;

const reducer = (
  specifications: Specification[],
  action: SpecificationAction,
) => {
  switch (action.type) {
    case "added":
      return [...specifications, { id: nextId++, label: "", value: "" }];
    case "deleted":
      return specifications.filter((spec) => spec.id !== action.id);
    case "updated":
      return specifications.reduce(
        (prev, curr) =>
          curr.id === action.id
            ? [...prev, { id: curr.id, ...action.field }]
            : [...prev, curr],
        [] as Specification[],
      );
    default:
      throw new Error(`Invalid action type: ${action satisfies never}`);
  }
};

export default function ProductCreateForm() {
  const [state, formAction, isPending] = useActionState(createProduct, {});
  const [specifications, dispatch] = useReducer(reducer, [
    { id: nextId++, label: "", value: "" },
  ]);

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
        {state.errors?.name && (
          <FieldError>{state.errors.name.errors}</FieldError>
        )}
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
          <FieldError>{state.errors.category.errors}</FieldError>
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
          <FieldError>{state.errors.description.errors}</FieldError>
        )}
      </Field>

      <Field orientation="horizontal">
        <Checkbox
          id="isFeatured"
          name="isFeatured"
          value="true"
          defaultChecked={state.data?.isFeatured === "true"}
          aria-invalid={!!state.errors?.isFeatured}
        />
        <FieldLabel htmlFor="isFeatured">Mark as featured</FieldLabel>
      </Field>
      {state.errors?.isFeatured && (
        <FieldError>{state.errors.isFeatured.errors}</FieldError>
      )}

      <input
        type="hidden"
        name="specifications"
        value={JSON.stringify(specifications)}
      />

      <div>
        <h2 className="my-2 text-lg">Specifications</h2>

        <div className="space-y-4">
          {specifications.map((spec, i) => (
            <FieldGroup
              key={i}
              className="flex flex-row flex-nowrap items-center"
            >
              <Field>
                <FieldLabel>Label</FieldLabel>
                <Input
                  placeholder="Battery Life"
                  defaultValue={spec.label}
                  onChange={(e) =>
                    dispatch({
                      type: "updated",
                      id: spec.id,
                      field: { label: e.target.value, value: spec.value },
                    })
                  }
                />
                {state.errors?.specifications?.items?.[i] && (
                  <div>
                    <FieldError>
                      {
                        state.errors.specifications.items[i].properties?.label
                          ?.errors
                      }
                    </FieldError>
                  </div>
                )}
              </Field>
              <Field>
                <FieldLabel>Value</FieldLabel>
                <Input
                  placeholder="3 days"
                  defaultValue={spec.value}
                  onChange={(e) =>
                    dispatch({
                      type: "updated",
                      id: spec.id,
                      field: { value: e.target.value, label: spec.label },
                    })
                  }
                />
                {state.errors?.specifications?.items?.[i] && (
                  <div>
                    <FieldError>
                      {
                        state.errors.specifications.items[i].properties?.value
                          ?.errors
                      }
                    </FieldError>
                  </div>
                )}
              </Field>
              <Button
                type="button"
                variant="outline"
                className="self-end"
                onClick={() => dispatch({ type: "deleted", id: spec.id })}
              >
                <Trash className="size-4 text-red-500" />
              </Button>
            </FieldGroup>
          ))}
          {state.errors?.specifications?.errors && (
            <FieldError>{state.errors.specifications.errors}</FieldError>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-2 w-full"
          onClick={() => dispatch({ type: "added" })}
        >
          <Plus className="mr-2" /> Add New
        </Button>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating product..." : "Create product"}
      </Button>
      {state.success && (
        <p className="text-sm text-green-600">Product created successfully</p>
      )}
    </form>
  );
}
