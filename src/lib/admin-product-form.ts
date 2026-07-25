export function slugifyProductName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function isValidProductSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export function parseLinesToArray(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const ADMIN_FIELD_CLASS =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-brand-brown outline-none transition focus:border-brand-coral/50 focus:ring-2 focus:ring-brand-coral/15 aria-invalid:border-destructive";
