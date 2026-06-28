import type { Product, Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Crochet Flowers",
    slug: "crochet-flowers",
    description:
      "Handcrafted crochet flowers that last forever. Perfect for home decor, gifts, and special occasions.",
    image: "/images/categories/crochet-flowers.jpg",
    displayOrder: 1,
  },
  {
    id: "cat-2",
    name: "Paintings",
    slug: "paintings",
    description:
      "Original paintings and art prints to add warmth and character to your space.",
    image: "/images/categories/paintings.jpg",
    displayOrder: 2,
  },
  {
    id: "cat-3",
    name: "Handmade Gifts",
    slug: "handmade-gifts",
    description:
      "Thoughtfully crafted gifts for every occasion — birthdays, anniversaries, and celebrations.",
    image: "/images/categories/handmade-gifts.jpg",
    displayOrder: 3,
  },
  {
    id: "cat-4",
    name: "Decorative Items",
    slug: "decorative-items",
    description:
      "Crochet coasters, wall hangings, and decorative pieces to make your home feel warm and unique.",
    image: "/images/categories/decorative-items.jpg",
    displayOrder: 4,
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Rose Bouquet — Blush Pink",
    slug: "rose-bouquet-blush-pink",
    description:
      "A delicate bouquet of handmade crochet roses in soft blush pink. Each petal is carefully shaped and stitched. Never wilts, always beautiful.",
    price: 799,
    compareAtPrice: 999,
    images: ["/images/products/rose-bouquet-1.jpg"],
    category: categories[0],
    tags: ["roses", "bouquet", "gift", "bestseller"],
    stockCount: 15,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-01-15",
  },
  {
    id: "prod-2",
    name: "Sunflower Single Stem",
    slug: "sunflower-single-stem",
    description:
      "A cheerful handmade crochet sunflower on a wire stem. Adds a pop of sunshine to any room.",
    price: 349,
    images: ["/images/products/sunflower-1.jpg"],
    category: categories[0],
    tags: ["sunflower", "single", "decor"],
    stockCount: 25,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-02-10",
  },
  {
    id: "prod-3",
    name: "Lavender Fields — Watercolor Print",
    slug: "lavender-fields-watercolor",
    description:
      "A serene watercolor painting of lavender fields at golden hour. Printed on premium archival paper.",
    price: 1299,
    images: ["/images/products/lavender-painting-1.jpg"],
    category: categories[1],
    tags: ["painting", "watercolor", "landscape"],
    stockCount: 10,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-03-05",
  },
  {
    id: "prod-4",
    name: "Crochet Coaster Set — Earth Tones",
    slug: "crochet-coaster-set-earth",
    description:
      "Set of 4 handmade crochet coasters in warm earth tones. Machine washable and beautifully functional.",
    price: 499,
    images: ["/images/products/coasters-1.jpg"],
    category: categories[3],
    tags: ["coasters", "set", "kitchen", "decor"],
    stockCount: 20,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-03-20",
  },
  {
    id: "prod-5",
    name: "Birthday Gift Box — Floral",
    slug: "birthday-gift-box-floral",
    description:
      "A curated gift box with a crochet flower, handwritten card, and dried flower sachet. Ready to gift.",
    price: 1499,
    compareAtPrice: 1799,
    images: ["/images/products/gift-box-1.jpg"],
    category: categories[2],
    tags: ["gift", "birthday", "box", "bestseller"],
    stockCount: 8,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-04-01",
  },
  {
    id: "prod-6",
    name: "Macrame Wall Hanging — Ivory",
    slug: "macrame-wall-hanging-ivory",
    description:
      "A handknotted macrame wall hanging in natural ivory cotton. Adds texture and warmth to any wall.",
    price: 1899,
    images: ["/images/products/macrame-1.jpg"],
    category: categories[3],
    tags: ["macrame", "wall", "decor", "boho"],
    stockCount: 5,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-04-15",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category.slug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
