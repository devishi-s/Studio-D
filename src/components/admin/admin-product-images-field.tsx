"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";

import { ADMIN_FIELD_CLASS } from "@/lib/admin-product-form";
import {
  MAX_PRODUCT_IMAGES,
  isValidProductImageFolder,
  validateProductImageFile,
} from "@/lib/product-images";
import {
  deleteProductImage,
  uploadProductImages,
} from "@/lib/supabase/upload-product-image";
import { resolveProductImagePath } from "@/lib/supabase/storage";

type AdminProductImagesFieldProps = {
  productId: string;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  error?: string;
};

export function AdminProductImagesField({
  productId,
  value,
  onChange,
  disabled = false,
  error,
}: AdminProductImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const canUpload = isValidProductImageFolder(productId);
  const atCap = value.length >= MAX_PRODUCT_IMAGES;
  const busy = disabled || uploading;

  async function onPick(files: FileList | null) {
    if (!files?.length || busy) return;
    if (!canUpload) {
      toast.error("Add a product name first, then attach photos.");
      return;
    }

    const remaining = MAX_PRODUCT_IMAGES - value.length;
    const picked = Array.from(files).slice(0, remaining);
    for (const file of picked) {
      const valid = validateProductImageFile(file);
      if (!valid.ok) {
        toast.error(valid.error);
        return;
      }
    }

    setUploading(true);
    const result = await uploadProductImages(productId, picked);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    onChange([...value, ...result.paths]);
    toast.success(
      result.paths.length === 1
        ? "Photo added."
        : `${result.paths.length} photos added.`
    );
  }

  async function removeAt(index: number) {
    const path = value[index];
    if (!path || busy) return;
    onChange(value.filter((_, i) => i !== index));
    await deleteProductImage(path);
  }

  function makeCover(index: number) {
    if (index <= 0 || busy) return;
    const next = [...value];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  }

  function addUrl() {
    const next = urlDraft.trim();
    if (!next) return;
    if (atCap) {
      toast.error(`You can add up to ${MAX_PRODUCT_IMAGES} photos.`);
      return;
    }
    if (value.includes(next)) {
      toast.error("That photo is already on this product.");
      return;
    }
    onChange([...value, next]);
    setUrlDraft("");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-brand-brown">Photos</p>
        <p className="text-xs text-muted-foreground">
          First photo is the shop thumbnail. JPEG, PNG, WebP, or GIF, up to 5
          MB. {value.length}/{MAX_PRODUCT_IMAGES}
        </p>
      </div>

      {value.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((path, index) => (
            <li
              key={`${path}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-brand-blush/40"
            >
              <img
                src={resolveProductImagePath(path)}
                alt=""
                className="h-full w-full object-cover"
              />
              {index === 0 ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-brown">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  disabled={busy}
                  className="absolute left-1.5 top-1.5 rounded-full bg-white/90 p-1 text-brand-brown shadow-sm"
                  aria-label="Use as cover photo"
                >
                  <Star className="h-3 w-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => void removeAt(index)}
                disabled={busy}
                className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-brand-brown shadow-sm"
                aria-label="Remove photo"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-border/70 bg-brand-blush/30 px-3 py-6 text-center text-sm text-muted-foreground">
          No photos yet. The shop will show a placeholder until you add one.
        </p>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={busy || atCap || !canUpload}
          className="sr-only"
          onChange={(event) => void onPick(event.target.files)}
        />
        <button
          type="button"
          disabled={busy || atCap || !canUpload}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-sm font-medium text-brand-brown transition-colors hover:bg-brand-blush/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Add photos"}
        </button>
        {!canUpload ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Add a product name first so photos can be saved.
          </p>
        ) : null}
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
          Or paste a link
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            placeholder="/images/… or https://…"
            disabled={busy || atCap}
            className={ADMIN_FIELD_CLASS}
          />
          <button
            type="button"
            onClick={addUrl}
            disabled={busy || atCap || !urlDraft.trim()}
            className="h-10 shrink-0 rounded-full border border-border bg-white px-3 text-sm font-medium text-brand-brown disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </details>

      {error ? (
        <p className="text-xs font-normal text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
