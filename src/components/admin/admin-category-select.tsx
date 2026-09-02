import { mainCategories } from "@/data/categories";
import { ADMIN_FIELD_CLASS } from "@/lib/admin-product-form";

type AdminCategorySelectProps = {
  name?: string;
  defaultValue?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

/** Main + subcategory picker for admin product forms. */
export function AdminCategorySelect({
  name = "category",
  defaultValue = "",
  id,
  "aria-invalid": ariaInvalid,
}: AdminCategorySelectProps) {
  return (
    <div className="space-y-1.5">
      <select
        id={id}
        name={name}
        className={ADMIN_FIELD_CLASS}
        defaultValue={defaultValue}
        aria-invalid={ariaInvalid}
      >
        {!defaultValue ? (
          <option value="" disabled>
            Select main category → subcategory
          </option>
        ) : null}
        {mainCategories.map((main) => (
          <optgroup key={main.slug} label={main.name}>
            <option value={main.slug}>
              {main.name} → (no subcategory)
            </option>
            {main.children.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {main.name} → {sub.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="text-xs text-muted-foreground">
        Pick a subcategory when you can (e.g. Wearables → Bracelets). Open the
        dropdown and scroll within each group to see subcategories.
      </p>
    </div>
  );
}
