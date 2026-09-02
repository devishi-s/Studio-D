"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AdminCategorySelect } from "@/components/admin/admin-category-select";
import {
  ADMIN_FIELD_CLASS,
  isValidProductSlug,
  parseLinesToArray,
  slugifyProductName,
} from "@/lib/admin-product-form";
import { adminCreateProductAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function AdminProductCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugifyProductName(name));
    }
  }, [name, slugTouched]);

  function validate(form: FormData): Record<string, string> {
    const next: Record<string, string> = {};
    const n = String(form.get("name") ?? "").trim();
    const s = String(form.get("slug") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const price = Number(form.get("price"));
    const category = String(form.get("category") ?? "").trim();
    const stock = Number(form.get("stock_count"));

    if (n.length < 2) next.name = "Name is required.";
    if (!isValidProductSlug(s)) {
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
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validate(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});

    const images = parseLinesToArray(String(formData.get("images") ?? ""));
    const materials = parseLinesToArray(
      String(formData.get("materials") ?? "")
    );
    const productId = `prod-${String(formData.get("slug")).trim()}`;

    startTransition(async () => {
      const result = await adminCreateProductAction({
        id: productId,
        slug: String(formData.get("slug")).trim(),
        name: String(formData.get("name")).trim(),
        description: String(formData.get("description")).trim(),
        price: Number(formData.get("price")),
        category: String(formData.get("category")).trim(),
        images,
        materials,
        dimensions: String(formData.get("dimensions") ?? "").trim() || null,
        stock_count: Number(formData.get("stock_count")),
        featured: formData.get("featured") === "on",
        is_active: true,
        tags: [],
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success("Product created.");
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field label="Name" error={errors.name}>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={ADMIN_FIELD_CLASS}
          aria-invalid={!!errors.name}
        />
      </Field>

      <Field label="Slug" error={errors.slug}>
        <input
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className={ADMIN_FIELD_CLASS}
          aria-invalid={!!errors.slug}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Auto-generated from the name; edit if needed.
        </p>
      </Field>

      <Field label="Description" error={errors.description}>
        <textarea
          name="description"
          rows={5}
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
            defaultValue={0}
            className={ADMIN_FIELD_CLASS}
            aria-invalid={!!errors.stock_count}
          />
        </Field>
      </div>

      <Field label="Category / subcategory" error={errors.category}>
        <AdminCategorySelect aria-invalid={!!errors.category} />
      </Field>

      <Field label="Image URLs (one per line)">
        <textarea
          name="images"
          rows={3}
          placeholder="https://… or storage path"
          className={ADMIN_FIELD_CLASS}
        />
      </Field>

      <Field label="Materials (comma or new line)">
        <textarea name="materials" rows={2} className={ADMIN_FIELD_CLASS} />
      </Field>

      <Field label="Dimensions">
        <input name="dimensions" className={ADMIN_FIELD_CLASS} />
      </Field>

      <label className="flex items-center gap-2 text-sm text-brand-brown">
        <input
          type="checkbox"
          name="featured"
          className="size-4 rounded border-border"
        />
        Featured on homepage
      </label>

      <Button
        type="submit"
        size="lg"
        className="rounded-full"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          "Create product"
        )}
      </Button>
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
