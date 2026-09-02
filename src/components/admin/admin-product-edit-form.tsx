"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminCategorySelect } from "@/components/admin/admin-category-select";
import {
  ADMIN_FIELD_CLASS,
  isValidProductSlug,
  parseLinesToArray,
} from "@/lib/admin-product-form";
import type { AdminProduct } from "@/lib/supabase/admin";
import {
  adminDeleteProductAction,
  adminUpdateProductAction,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

type AdminProductEditFormProps = {
  product: AdminProduct;
};

export function AdminProductEditForm({ product }: AdminProductEditFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: FormData): Record<string, string> {
    const next: Record<string, string> = {};
    const name = String(form.get("name") ?? "").trim();
    const slug = String(form.get("slug") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const price = Number(form.get("price"));
    const category = String(form.get("category") ?? "").trim();
    const stock = Number(form.get("stock_count"));

    if (name.length < 2) next.name = "Name is required.";
    if (!isValidProductSlug(slug)) {
      next.slug = "Use lowercase letters, numbers, and hyphens only.";
    }
    if (description.length < 10) {
      next.description = "Add a short description (10+ characters).";
    }
    if (!Number.isFinite(price) || price < 0) {
      next.price = "Enter a valid price.";
    }
    if (!category) next.category = "Choose a category.";
    if (!Number.isInteger(stock) || stock < 0) {
      next.stock_count = "Stock must be a whole number ≥ 0.";
    }
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validate(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await adminUpdateProductAction(product.id, {
        slug: String(formData.get("slug")).trim(),
        name: String(formData.get("name")).trim(),
        description: String(formData.get("description")).trim(),
        price: Number(formData.get("price")),
        category: String(formData.get("category")).trim(),
        images: parseLinesToArray(String(formData.get("images") ?? "")),
        materials: parseLinesToArray(String(formData.get("materials") ?? "")),
        dimensions: String(formData.get("dimensions") ?? "").trim() || null,
        stock_count: Number(formData.get("stock_count")),
        featured: formData.get("featured") === "on",
        is_active: formData.get("is_active") === "on",
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Product saved.");
      router.refresh();
    });
  }

  function onDelete() {
    const confirmed = window.confirm(
      `Delete “${product.name}”? This cannot be undone if the product has no order history.`
    );
    if (!confirmed) return;

    setDeleting(true);
    startTransition(async () => {
      const result = await adminDeleteProductAction(product.id);
      setDeleting(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Product deleted.");
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label="Name" error={errors.name}>
        <input
          name="name"
          defaultValue={product.name}
          className={ADMIN_FIELD_CLASS}
          aria-invalid={!!errors.name}
        />
      </Field>

      <Field label="Slug" error={errors.slug}>
        <input
          name="slug"
          defaultValue={product.slug}
          className={ADMIN_FIELD_CLASS}
          aria-invalid={!!errors.slug}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          rows={5}
          defaultValue={product.description}
          className={ADMIN_FIELD_CLASS}
          aria-invalid={!!errors.description}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (₹)" error={errors.price}>
          <input
            name="price"
            type="number"
            min={0}
            step="1"
            defaultValue={product.price}
            className={ADMIN_FIELD_CLASS}
            aria-invalid={!!errors.price}
          />
        </Field>
        <Field label="Stock count" error={errors.stock_count}>
          <input
            name="stock_count"
            type="number"
            min={0}
            step="1"
            defaultValue={product.stockCount}
            className={ADMIN_FIELD_CLASS}
            aria-invalid={!!errors.stock_count}
          />
        </Field>
      </div>

      <Field label="Category / subcategory" error={errors.category}>
        <AdminCategorySelect
          defaultValue={product.category}
          aria-invalid={!!errors.category}
        />
      </Field>

      <Field label="Image URLs (one per line)">
        <textarea
          name="images"
          rows={3}
          defaultValue={product.images.join("\n")}
          className={ADMIN_FIELD_CLASS}
        />
      </Field>

      <Field label="Materials (comma or new line)">
        <textarea
          name="materials"
          rows={2}
          defaultValue={product.materials.join(", ")}
          className={ADMIN_FIELD_CLASS}
        />
      </Field>

      <Field label="Dimensions">
        <input
          name="dimensions"
          defaultValue={product.dimensions}
          className={ADMIN_FIELD_CLASS}
        />
      </Field>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-brand-brown">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product.featured}
            className="size-4 rounded border-border"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-brown">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product.isActive}
            className="size-4 rounded border-border"
          />
          Active (visible in shop)
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          type="submit"
          size="lg"
          className="rounded-full"
          disabled={pending || deleting}
        >
          {pending && !deleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="lg"
          className="rounded-full"
          disabled={pending || deleting}
          onClick={onDelete}
        >
          {deleting ? "Deleting…" : "Delete product"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-brand-brown">
      {label}
      {children}
      {error ? (
        <span className="mt-1 block text-xs font-normal text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}
