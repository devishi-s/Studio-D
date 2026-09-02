import type { Category } from "@/types";

/** Main category with nested subcategories. */
export type MainCategory = Category & {
  children: Category[];
};

/**
 * Two-level Studio D taxonomy.
 * `products.category` stores a slug from this tree (usually a subcategory;
 * main slug is allowed for general items, e.g. migrated handmade gifts → wearables).
 */
export const mainCategories: MainCategory[] = [
  {
    id: "cat-wearables",
    name: "Wearables",
    slug: "wearables",
    description:
      "Handmade pieces to wear and gift — bracelets, hair accessories, and more.",
    image: "/images/categories/wearables.jpg",
    displayOrder: 1,
    children: [
      {
        id: "cat-bracelets",
        name: "Bracelets",
        slug: "bracelets",
        description: "Handcrafted bracelets for everyday colour and charm.",
        image: "/images/categories/bracelets.jpg",
        displayOrder: 1,
        parentSlug: "wearables",
        parentName: "Wearables",
      },
      {
        id: "cat-hair-accessories",
        name: "Hair Accessories",
        slug: "hair-accessories",
        description: "Soft, handmade accents for hair and everyday styling.",
        image: "/images/categories/hair-accessories.jpg",
        displayOrder: 2,
        parentSlug: "wearables",
        parentName: "Wearables",
      },
    ],
  },
  {
    id: "cat-keychains-charms",
    name: "Keychains & Charms",
    slug: "keychains-charms",
    description:
      "Small keepsakes with big personality — keychains and bag charms.",
    image: "/images/categories/keychains-charms.jpg",
    displayOrder: 2,
    children: [
      {
        id: "cat-keychains",
        name: "Keychains",
        slug: "keychains",
        description: "Cute crochet and handmade keychains to clip on and gift.",
        image: "/images/categories/keychains.jpg",
        displayOrder: 1,
        parentSlug: "keychains-charms",
        parentName: "Keychains & Charms",
      },
      {
        id: "cat-bag-charms",
        name: "Bag Charms",
        slug: "bag-charms",
        description: "Playful charms to dress up bags, pouches, and more.",
        image: "/images/categories/bag-charms.jpg",
        displayOrder: 2,
        parentSlug: "keychains-charms",
        parentName: "Keychains & Charms",
      },
    ],
  },
  {
    id: "cat-crochet-creations",
    name: "Crochet Creations",
    slug: "crochet-creations",
    description:
      "Soft sculpture and everlasting florals — crochet flowers and plushies.",
    image: "/images/categories/crochet-creations.jpg",
    displayOrder: 3,
    children: [
      {
        id: "cat-flowers",
        name: "Flowers",
        slug: "flowers",
        description:
          "Handcrafted crochet flowers that last forever — gifts and décor.",
        image: "/images/categories/flowers.jpg",
        displayOrder: 1,
        parentSlug: "crochet-creations",
        parentName: "Crochet Creations",
      },
      {
        id: "cat-plushies",
        name: "Plushies",
        slug: "plushies",
        description: "Soft crochet plush companions made to cuddle and gift.",
        image: "/images/categories/plushies.jpg",
        displayOrder: 2,
        parentSlug: "crochet-creations",
        parentName: "Crochet Creations",
      },
    ],
  },
  {
    id: "cat-art-decor",
    name: "Art & Decor",
    slug: "art-decor",
    description:
      "Paintings and decorative pieces that warm up shelves and walls.",
    image: "/images/categories/art-decor.jpg",
    displayOrder: 4,
    children: [
      {
        id: "cat-paintings",
        name: "Paintings",
        slug: "paintings",
        description:
          "Original paintings and art prints to add warmth to your space.",
        image: "/images/categories/paintings.jpg",
        displayOrder: 1,
        parentSlug: "art-decor",
        parentName: "Art & Decor",
      },
      {
        id: "cat-decor",
        name: "Decor",
        slug: "decor",
        description:
          "Handmade decorative pieces — coasters, hangings, and home accents.",
        image: "/images/categories/decor.jpg",
        displayOrder: 2,
        parentSlug: "art-decor",
        parentName: "Art & Decor",
      },
    ],
  },
];

/** Flat list of main categories (homepage, /categories index). */
export const categories: Category[] = mainCategories.map(
  ({ children: _children, ...main }) => main
);

/** Every selectable leaf (subcategories) plus mains — for lookups. */
export const allCategoryNodes: Category[] = [
  ...categories,
  ...mainCategories.flatMap((main) => main.children),
];

/** Subcategories only — primary admin product category options. */
export const subcategoryOptions: Category[] = mainCategories.flatMap(
  (main) => main.children
);

export function getMainCategoryBySlug(slug: string): MainCategory | undefined {
  return mainCategories.find((c) => c.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return allCategoryNodes.find((c) => c.slug === slug);
}

export function getSubcategory(
  mainSlug: string,
  subSlug: string
): Category | undefined {
  const main = getMainCategoryBySlug(mainSlug);
  return main?.children.find((c) => c.slug === subSlug);
}

/** Storefront / admin path for a category node. */
export function categoryHref(category: Pick<Category, "slug" | "parentSlug">): string {
  if (category.parentSlug) {
    return `/categories/${category.parentSlug}/${category.slug}`;
  }
  return `/categories/${category.slug}`;
}

/**
 * Slugs to match in `products.category` for a filter value.
 * Main category → main slug + all child slugs.
 * Subcategory → that slug only.
 */
export function getCategoryFilterSlugs(slug: string): string[] {
  const main = getMainCategoryBySlug(slug);
  if (main) {
    return [main.slug, ...main.children.map((c) => c.slug)];
  }
  if (getCategoryBySlug(slug)) {
    return [slug];
  }
  return [slug];
}

/** Display label, e.g. "Wearables · Bracelets" for subcategories. */
export function categoryDisplayName(category: Category): string {
  if (category.parentName) {
    return `${category.parentName} · ${category.name}`;
  }
  return category.name;
}

/** Resolve a DB slug into a full Category (with parent fields when applicable). */
export function resolveCategory(slug: string): Category {
  const match = getCategoryBySlug(slug);
  if (match) return match;

  return {
    id: slug,
    name: slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    slug,
    description: "",
    image: "",
    displayOrder: 0,
  };
}
