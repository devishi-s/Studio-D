import type { Product, Category, SortOption } from "@/types";

// ─── Categories ──────────────────────────────────────────────

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

// ─── Products ────────────────────────────────────────────────

export const products: Product[] = [
  // ── Crochet Flowers ──
  {
    id: "prod-1",
    name: "Rose Bouquet — Blush Pink",
    slug: "rose-bouquet-blush-pink",
    description:
      "A delicate bouquet of handmade crochet roses in soft blush pink. Each petal is carefully shaped and stitched by hand, creating flowers that capture the romance of real roses without ever wilting. Perfect as a lasting gift or an elegant centerpiece for your home.",
    price: 799,
    compareAtPrice: 999,
    images: [
      "/images/products/rose-bouquet-1.jpg",
      "/images/products/rose-bouquet-2.jpg",
    ],
    category: categories[0],
    tags: ["roses", "bouquet", "gift", "bestseller"],
    materials: ["Premium cotton yarn", "Floral wire stems", "Satin ribbon wrap"],
    dimensions: "Bouquet: 25cm tall, 6 stems",
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
      "A cheerful handmade crochet sunflower on a sturdy wire stem. The golden-yellow petals radiate warmth and happiness, making it the perfect pick-me-up for any room. Each sunflower is individually crafted with attention to every petal.",
    price: 349,
    images: ["/images/products/sunflower-1.jpg"],
    category: categories[0],
    tags: ["sunflower", "single", "decor"],
    materials: ["Cotton yarn", "Wrapped floral wire", "Felt backing"],
    dimensions: "30cm tall, flower head 10cm diameter",
    stockCount: 25,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-02-10",
  },
  {
    id: "prod-3",
    name: "Tulip Trio — Spring Mix",
    slug: "tulip-trio-spring-mix",
    description:
      "A set of three handmade crochet tulips in soft spring colors — blush pink, butter yellow, and lavender. Arranged together, they bring the freshness of a spring garden into your space all year round.",
    price: 649,
    images: [
      "/images/products/tulip-trio-1.jpg",
      "/images/products/tulip-trio-2.jpg",
    ],
    category: categories[0],
    tags: ["tulips", "set", "spring", "new"],
    materials: ["Mercerized cotton yarn", "Green floral tape", "Steel wire core"],
    dimensions: "22cm tall each, set of 3",
    stockCount: 18,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-05-01",
  },

  // ── Paintings ──
  {
    id: "prod-4",
    name: "Lavender Fields — Watercolor Print",
    slug: "lavender-fields-watercolor",
    description:
      "A serene watercolor painting of lavender fields at golden hour. The soft purples and warm golds create a calming atmosphere that transforms any wall into a window to the French countryside. Printed on premium archival paper with museum-grade inks.",
    price: 1299,
    images: ["/images/products/lavender-painting-1.jpg"],
    category: categories[1],
    tags: ["painting", "watercolor", "landscape"],
    materials: ["300gsm cold-pressed watercolor paper", "Archival pigment inks"],
    dimensions: "A3 (29.7cm × 42cm), unframed",
    stockCount: 10,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-03-05",
  },
  {
    id: "prod-5",
    name: "Golden Hour — Abstract Acrylic",
    slug: "golden-hour-abstract-acrylic",
    description:
      "An original abstract acrylic painting in warm golds, burnt sienna, and cream. Textured brushstrokes catch the light differently throughout the day, giving this piece a living quality. Each painting is one-of-a-kind — no two are exactly alike.",
    price: 2499,
    images: [
      "/images/products/golden-hour-1.jpg",
      "/images/products/golden-hour-2.jpg",
    ],
    category: categories[1],
    tags: ["painting", "acrylic", "abstract", "original"],
    materials: [
      "Artist-grade acrylic on stretched canvas",
      "Wooden stretcher bars",
      "Protective varnish finish",
    ],
    dimensions: "40cm × 50cm × 2cm, gallery wrapped",
    stockCount: 3,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-05-20",
  },
  {
    id: "prod-6",
    name: "Botanical Line Art — Monstera",
    slug: "botanical-line-art-monstera",
    description:
      "A minimal botanical line drawing of a Monstera leaf, hand-drawn with fine-tip ink. Clean lines and open space make this print a versatile piece that complements any interior style — from modern minimalist to cozy boho.",
    price: 599,
    images: ["/images/products/monstera-1.jpg"],
    category: categories[1],
    tags: ["line art", "botanical", "minimal", "new"],
    materials: ["220gsm smooth art paper", "Archival pigment inks"],
    dimensions: "A4 (21cm × 29.7cm), unframed",
    stockCount: 20,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-06-01",
  },

  // ── Handmade Gifts ──
  {
    id: "prod-7",
    name: "Birthday Gift Box — Floral",
    slug: "birthday-gift-box-floral",
    description:
      "A curated gift box with a handmade crochet flower, a hand-poured soy candle, a handwritten greeting card, and a dried flower sachet. Wrapped in tissue and presented in a kraft box with a satin ribbon. Ready to gift — no wrapping needed.",
    price: 1499,
    compareAtPrice: 1799,
    images: [
      "/images/products/gift-box-1.jpg",
      "/images/products/gift-box-2.jpg",
    ],
    category: categories[2],
    tags: ["gift", "birthday", "box", "bestseller"],
    materials: [
      "Cotton yarn flower",
      "Soy wax candle",
      "Handmade paper card",
      "Dried flower sachet",
      "Kraft gift box",
    ],
    dimensions: "Box: 20cm × 15cm × 10cm",
    stockCount: 8,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-04-01",
  },
  {
    id: "prod-8",
    name: "Anniversary Set — Lavender & Vanilla",
    slug: "anniversary-set-lavender-vanilla",
    description:
      "A thoughtful anniversary gift set featuring a pair of hand-poured soy candles in lavender and vanilla, a crochet heart keychain, and a personalizable greeting card. Packaged in a linen-textured box with a dried lavender sprig.",
    price: 1899,
    compareAtPrice: 2199,
    images: ["/images/products/anniversary-set-1.jpg"],
    category: categories[2],
    tags: ["gift", "anniversary", "candle", "bestseller"],
    materials: [
      "Soy wax candles with cotton wicks",
      "Cotton yarn keychain",
      "Recycled paper card",
      "Linen-textured box",
    ],
    dimensions: "Box: 25cm × 18cm × 8cm",
    stockCount: 6,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-04-20",
  },
  {
    id: "prod-9",
    name: "New Baby Welcome Hamper",
    slug: "new-baby-welcome-hamper",
    description:
      "Welcome a new little one with this hand-curated hamper. Includes a tiny crochet bunny, a soft muslin bib, a small crochet rattle, and a congratulations card. Everything is made from baby-safe, natural materials.",
    price: 2299,
    images: [
      "/images/products/baby-hamper-1.jpg",
      "/images/products/baby-hamper-2.jpg",
    ],
    category: categories[2],
    tags: ["gift", "baby", "hamper", "new"],
    materials: [
      "Organic cotton yarn",
      "Muslin fabric (OEKO-TEX certified)",
      "Food-grade wooden rattle core",
      "Kraft basket",
    ],
    dimensions: "Basket: 28cm × 20cm × 12cm",
    stockCount: 5,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-06-10",
  },

  // ── Decorative Items ──
  {
    id: "prod-10",
    name: "Crochet Coaster Set — Earth Tones",
    slug: "crochet-coaster-set-earth",
    description:
      "A set of 4 handmade crochet coasters in warm earth tones — terracotta, olive, mustard, and cream. Machine washable and beautifully functional. Protects your surfaces while adding handmade charm to your coffee table.",
    price: 499,
    images: [
      "/images/products/coasters-1.jpg",
      "/images/products/coasters-2.jpg",
    ],
    category: categories[3],
    tags: ["coasters", "set", "kitchen", "decor"],
    materials: ["100% cotton yarn", "Non-slip backing"],
    dimensions: "10cm diameter each, set of 4",
    stockCount: 20,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-03-20",
  },
  {
    id: "prod-11",
    name: "Macrame Wall Hanging — Ivory",
    slug: "macrame-wall-hanging-ivory",
    description:
      "A handknotted macrame wall hanging in natural ivory cotton rope. Features a combination of square knots and spiral patterns that create beautiful texture and movement. Hung from a natural driftwood dowel, it adds warmth and boho elegance to any wall.",
    price: 1899,
    images: ["/images/products/macrame-1.jpg"],
    category: categories[3],
    tags: ["macrame", "wall", "decor", "boho"],
    materials: [
      "3mm natural cotton rope",
      "Driftwood hanging rod",
      "Brass hanging ring",
    ],
    dimensions: "45cm wide × 70cm long (including fringe)",
    stockCount: 5,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-04-15",
  },
  {
    id: "prod-12",
    name: "Crochet Plant Hanger — Natural",
    slug: "crochet-plant-hanger-natural",
    description:
      "A sturdy yet delicate crochet plant hanger in natural off-white. Designed to hold pots up to 15cm in diameter. The open-weave pattern lets your plant breathe while adding a handmade touch to your indoor garden. Comes with a metal ceiling hook.",
    price: 699,
    images: ["/images/products/plant-hanger-1.jpg"],
    category: categories[3],
    tags: ["plant", "hanger", "decor", "new"],
    materials: [
      "5mm braided cotton cord",
      "Galvanized steel ceiling hook",
      "Wooden bead accents",
    ],
    dimensions: "90cm long, fits pots up to 15cm diameter",
    stockCount: 12,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-06-05",
  },
];

// ─── Query helpers ───────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(
    (p) => p.category.slug === categorySlug && p.isActive
  );
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && p.isActive);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllActiveProducts(): Product[] {
  return products.filter((p) => p.isActive);
}

export function sortProducts(items: Product[], sort: SortOption): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

export function filterProducts(
  items: Product[],
  categorySlug?: string
): Product[] {
  if (!categorySlug || categorySlug === "all") return items;
  return items.filter((p) => p.category.slug === categorySlug);
}
