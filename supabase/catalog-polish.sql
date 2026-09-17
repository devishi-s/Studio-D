-- Studio D catalog polish (idempotent)
-- Generated from src/data/catalog-seed.json
-- Safe for existing projects: upserts products, does not truncate.
-- Preserves reviews, wishlist, and orders that reference product ids.

begin;

insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-1',
  'rose-bouquet-blush-pink',
  'Rose Bouquet, Blush Pink',
  'A delicate bouquet of handmade crochet roses in soft blush pink. Each petal is carefully shaped and stitched by hand, creating flowers that capture the romance of real roses without ever wilting. Perfect as a lasting gift or an elegant centerpiece for your home.',
  799,
  999,
  'flowers',
  ARRAY['/images/products/rose-bouquet-1.jpg']::text[],
  ARRAY['roses', 'bouquet', 'gift', 'bestseller']::text[],
  true,
  true,
  ARRAY['Premium cotton yarn', 'Floral wire stems', 'Satin ribbon wrap']::text[],
  'Bouquet: 25cm tall, 6 stems',
  15,
  '2025-01-15'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-2',
  'sunflower-single-stem',
  'Sunflower Single Stem',
  'A cheerful handmade crochet sunflower on a sturdy wire stem. The golden-yellow petals radiate warmth and happiness, making it the perfect pick-me-up for any room. Each sunflower is individually crafted with attention to every petal.',
  349,
  NULL,
  'flowers',
  ARRAY['/images/products/sunflower-1.jpg']::text[],
  ARRAY['sunflower', 'single', 'decor']::text[],
  false,
  true,
  ARRAY['Cotton yarn', 'Wrapped floral wire', 'Felt backing']::text[],
  '30cm tall, flower head 10cm diameter',
  25,
  '2025-02-10'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-3',
  'tulip-trio-spring-mix',
  'Tulip Trio, Spring Mix',
  'A set of three handmade crochet tulips in soft spring colors, blush pink, butter yellow, and lavender. Arranged together, they bring the freshness of a spring garden into your space all year round.',
  649,
  NULL,
  'flowers',
  ARRAY['/images/products/tulip-trio-1.jpg']::text[],
  ARRAY['tulips', 'set', 'spring', 'new']::text[],
  true,
  true,
  ARRAY['Mercerized cotton yarn', 'Green floral tape', 'Steel wire core']::text[],
  '22cm tall each, set of 3',
  18,
  '2025-05-01'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-7',
  'birthday-gift-box-floral',
  'Birthday Gift Box, Floral',
  'A curated gift box with a handmade crochet flower, a hand-poured soy candle, a handwritten greeting card, and a dried flower sachet. Wrapped in tissue and presented in a kraft box with a satin ribbon. Ready to gift, no wrapping needed.',
  1499,
  1799,
  'flowers',
  ARRAY['/images/products/gift-box-1.jpg']::text[],
  ARRAY['gift', 'birthday', 'box', 'bestseller']::text[],
  true,
  true,
  ARRAY['Cotton yarn flower', 'Soy wax candle', 'Handmade paper card', 'Dried flower sachet', 'Kraft gift box']::text[],
  'Box: 20cm × 15cm × 10cm',
  8,
  '2025-04-01'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-4',
  'lavender-fields-watercolor',
  'Lavender Fields, Watercolor Print',
  'A serene watercolor painting of lavender fields at golden hour. The soft purples and warm golds create a calming atmosphere that transforms any wall into a window to the French countryside. Printed on premium archival paper with museum-grade inks.',
  1299,
  NULL,
  'paintings',
  ARRAY['/images/products/lavender-painting-1.jpg']::text[],
  ARRAY['painting', 'watercolor', 'landscape']::text[],
  true,
  true,
  ARRAY['300gsm cold-pressed watercolor paper', 'Archival pigment inks']::text[],
  'A3 (29.7cm × 42cm), unframed',
  10,
  '2025-03-05'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-5',
  'golden-hour-abstract-acrylic',
  'Golden Hour, Abstract Acrylic',
  'An original abstract acrylic painting in warm golds, burnt sienna, and cream. Textured brushstrokes catch the light differently throughout the day, giving this piece a living quality. Each painting is one-of-a-kind, no two are exactly alike.',
  2499,
  NULL,
  'paintings',
  ARRAY['/images/products/golden-hour-1.jpg']::text[],
  ARRAY['painting', 'acrylic', 'abstract', 'original']::text[],
  true,
  true,
  ARRAY['Artist-grade acrylic on stretched canvas', 'Wooden stretcher bars', 'Protective varnish finish']::text[],
  '40cm × 50cm × 2cm, gallery wrapped',
  3,
  '2025-05-20'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-6',
  'botanical-line-art-monstera',
  'Botanical Line Art, Monstera',
  'A minimal botanical line drawing of a Monstera leaf, hand-drawn with fine-tip ink. Clean lines and open space make this print a versatile piece that complements any interior style, from modern minimalist to cozy boho.',
  599,
  NULL,
  'paintings',
  ARRAY['/images/products/monstera-1.jpg']::text[],
  ARRAY['line art', 'botanical', 'minimal', 'new']::text[],
  false,
  true,
  ARRAY['220gsm smooth art paper', 'Archival pigment inks']::text[],
  'A4 (21cm × 29.7cm), unframed',
  20,
  '2025-06-01'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-10',
  'crochet-coaster-set-earth',
  'Crochet Coaster Set, Earth Tones',
  'A set of 4 handmade crochet coasters in warm earth tones, terracotta, olive, mustard, and cream. Machine washable and beautifully functional. Protects your surfaces while adding handmade charm to your coffee table.',
  499,
  NULL,
  'decor',
  ARRAY['/images/products/coasters-1.jpg']::text[],
  ARRAY['coasters', 'set', 'kitchen', 'decor']::text[],
  true,
  true,
  ARRAY['100% cotton yarn', 'Non-slip backing']::text[],
  '10cm diameter each, set of 4',
  20,
  '2025-03-20'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-11',
  'macrame-wall-hanging-ivory',
  'Macrame Wall Hanging, Ivory',
  'A handknotted macrame wall hanging in natural ivory cotton rope. Features a combination of square knots and spiral patterns that create beautiful texture and movement. Hung from a natural driftwood dowel, it adds warmth and boho elegance to any wall.',
  1899,
  NULL,
  'decor',
  ARRAY['/images/products/macrame-1.jpg']::text[],
  ARRAY['macrame', 'wall', 'decor', 'boho']::text[],
  false,
  true,
  ARRAY['3mm natural cotton rope', 'Driftwood hanging rod', 'Brass hanging ring']::text[],
  '45cm wide × 70cm long (including fringe)',
  5,
  '2025-04-15'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-12',
  'crochet-plant-hanger-natural',
  'Crochet Plant Hanger, Natural',
  'A sturdy yet delicate crochet plant hanger in natural off-white. Designed to hold pots up to 15cm in diameter. The open-weave pattern lets your plant breathe while adding a handmade touch to your indoor garden. Comes with a metal ceiling hook.',
  699,
  NULL,
  'decor',
  ARRAY['/images/products/plant-hanger-1.jpg']::text[],
  ARRAY['plant', 'hanger', 'decor', 'new']::text[],
  true,
  true,
  ARRAY['5mm braided cotton cord', 'Galvanized steel ceiling hook', 'Wooden bead accents']::text[],
  '90cm long, fits pots up to 15cm diameter',
  12,
  '2025-06-05'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-13',
  'crochet-bead-bracelet-coral',
  'Crochet Bead Bracelet, Coral',
  'A soft crochet bracelet with coral beads and a warm brass clasp. Light enough for everyday wear, with the handmade texture Studio D is known for. Stacks easily with other pieces or stands on its own.',
  449,
  NULL,
  'bracelets',
  ARRAY['/images/products/coral-bead-bracelet-1.jpg']::text[],
  ARRAY['bracelet', 'wearable', 'coral', 'new']::text[],
  false,
  true,
  ARRAY['Cotton yarn', 'Coral glass beads', 'Brass clasp']::text[],
  'Adjustable, 16–19cm wrist',
  16,
  '2025-07-02'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-14',
  'thread-friendship-bracelet-sage',
  'Thread Friendship Bracelet, Sage',
  'A hand-knotted friendship bracelet in sage, cream, and honey-gold threads. Made in the classic chevron pattern, finished with sliding knots so it fits most wrists. A small, lasting gift.',
  299,
  NULL,
  'bracelets',
  ARRAY['/images/products/sage-thread-bracelet-1.jpg']::text[],
  ARRAY['bracelet', 'friendship', 'sage']::text[],
  false,
  true,
  ARRAY['Waxed cotton thread', 'Sliding knot closure']::text[],
  'Adjustable, 15–20cm wrist',
  22,
  '2025-07-08'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-15',
  'satin-scrunchie-set-blush',
  'Satin Scrunchie Set, Blush',
  'A set of three satin scrunchies in blush, cream, and dusty rose. Gentle on hair, with a soft gather that looks finished rather than sporty. Packed together for gifting or everyday rotation.',
  399,
  NULL,
  'hair-accessories',
  ARRAY['/images/products/blush-scrunchie-set-1.jpg']::text[],
  ARRAY['hair', 'scrunchie', 'set', 'new']::text[],
  false,
  true,
  ARRAY['Satin fabric', 'Soft elastic core']::text[],
  'Set of 3, 10cm diameter each',
  18,
  '2025-07-12'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-16',
  'crochet-daisy-hair-clip',
  'Crochet Daisy Hair Clip',
  'A tiny crochet daisy on a gold-tone alligator clip. The petals are stitched in cream with a honey-gold centre, a small handmade accent for buns, braids, or a tucked-behind-the-ear wave.',
  349,
  NULL,
  'hair-accessories',
  ARRAY['/images/products/daisy-hair-clip-1.jpg']::text[],
  ARRAY['hair', 'clip', 'daisy', 'crochet']::text[],
  false,
  true,
  ARRAY['Cotton yarn', 'Felt backing', 'Gold-tone alligator clip']::text[],
  'Flower 4.5cm, clip 5cm',
  14,
  '2025-07-18'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-8',
  'anniversary-set-lavender-vanilla',
  'Anniversary Set, Lavender & Vanilla',
  'A thoughtful anniversary gift set featuring a pair of hand-poured soy candles in lavender and vanilla, a crochet heart keychain, and a personalizable greeting card. Packaged in a linen-textured box with a dried lavender sprig.',
  1899,
  2199,
  'keychains',
  ARRAY['/images/products/anniversary-set-1.jpg']::text[],
  ARRAY['gift', 'anniversary', 'candle', 'bestseller']::text[],
  false,
  true,
  ARRAY['Soy wax candles with cotton wicks', 'Cotton yarn keychain', 'Recycled paper card', 'Linen-textured box']::text[],
  'Box: 25cm × 18cm × 8cm',
  6,
  '2025-04-20'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-17',
  'mini-crochet-heart-keychain',
  'Mini Crochet Heart Keychain',
  'A plump little crochet heart on a gold-tone key ring. Soft enough to squeeze, sturdy enough for keys, and small enough to tuck into a gift. Stitched in blush pink with a cream edge.',
  249,
  NULL,
  'keychains',
  ARRAY['/images/products/heart-keychain-1.jpg']::text[],
  ARRAY['keychain', 'heart', 'gift', 'bestseller']::text[],
  true,
  true,
  ARRAY['Cotton yarn', 'Polyester filling', 'Gold-tone split ring']::text[],
  'Heart 5cm, ring 2.5cm',
  30,
  '2025-07-22'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-18',
  'daisy-bloom-keychain',
  'Daisy Bloom Keychain',
  'A cheerful crochet daisy keychain with a green stem loop. The kind of small handmade piece that makes a bag or set of keys feel like yours. Each flower is stitched by hand, so no two sit quite the same.',
  279,
  NULL,
  'keychains',
  ARRAY['/images/products/daisy-keychain-1.jpg']::text[],
  ARRAY['keychain', 'daisy', 'floral']::text[],
  false,
  true,
  ARRAY['Cotton yarn', 'Felt backing', 'Nickel-free key ring']::text[],
  'Flower 4cm, total drop 8cm',
  24,
  '2025-07-25'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-19',
  'mushroom-bag-charm',
  'Mushroom Bag Charm',
  'A squat crochet mushroom charm with a coral cap and cream stem. Clips onto tote straps, pouches, and backpacks with a lobster clasp. Playful, compact, and surprisingly sturdy.',
  329,
  NULL,
  'bag-charms',
  ARRAY['/images/products/mushroom-bag-charm-1.jpg']::text[],
  ARRAY['charm', 'bag', 'mushroom', 'new']::text[],
  false,
  true,
  ARRAY['Cotton yarn', 'Polyester filling', 'Antique-gold lobster clasp']::text[],
  '6cm tall, clasp 3cm',
  20,
  '2025-08-01'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-20',
  'star-charm-honey-gold',
  'Star Charm, Honey Gold',
  'A five-point crochet star in honey-gold yarn, lightly stuffed so it holds its shape. Finished with a short chain and clasp for bags, zippers, or a set of keys that need a little light.',
  299,
  NULL,
  'bag-charms',
  ARRAY['/images/products/star-bag-charm-1.jpg']::text[],
  ARRAY['charm', 'star', 'gold']::text[],
  false,
  true,
  ARRAY['Mercerized cotton yarn', 'Polyester filling', 'Brass clasp']::text[],
  'Star 5.5cm across',
  18,
  '2025-08-04'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-9',
  'new-baby-welcome-hamper',
  'New Baby Welcome Hamper',
  'Welcome a new little one with this hand-curated hamper. Includes a tiny crochet bunny, a soft muslin bib, a small crochet rattle, and a congratulations card. Everything is made from baby-safe, natural materials.',
  2299,
  NULL,
  'plushies',
  ARRAY['/images/products/baby-hamper-1.jpg']::text[],
  ARRAY['gift', 'baby', 'hamper', 'new']::text[],
  false,
  true,
  ARRAY['Organic cotton yarn', 'Muslin fabric (OEKO-TEX certified)', 'Food-grade wooden rattle core', 'Kraft basket']::text[],
  'Basket: 28cm × 20cm × 12cm',
  5,
  '2025-06-10'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-21',
  'tiny-crochet-bunny',
  'Tiny Crochet Bunny',
  'A palm-sized amigurumi bunny in cream cotton, with embroidered eyes and a blush-stitched nose. Soft enough to sit on a shelf or tuck into a gift. No plastic parts, safe as a keepsake for little ones.',
  899,
  NULL,
  'plushies',
  ARRAY['/images/products/tiny-bunny-1.jpg']::text[],
  ARRAY['plushie', 'bunny', 'gift', 'new']::text[],
  true,
  true,
  ARRAY['Organic cotton yarn', 'Polyester filling', 'Embroidered features']::text[],
  '12cm tall seated',
  10,
  '2025-08-10'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


insert into public.products (
  id, slug, name, description, price, compare_at_price, category,
  images, tags, featured, is_active, materials, dimensions, stock_count, created_at
) values (
  'prod-22',
  'amigurumi-bear-cub',
  'Amigurumi Bear Cub',
  'A round little bear cub in warm oatmeal yarn, with tiny ears and a honey-gold scarf. Hand-crocheted and firmly stuffed so it sits upright. A companion piece for nurseries, desks, and quiet corners.',
  1099,
  NULL,
  'plushies',
  ARRAY['/images/products/amigurumi-bear-1.jpg']::text[],
  ARRAY['plushie', 'bear', 'gift']::text[],
  false,
  true,
  ARRAY['Cotton yarn', 'Polyester filling', 'Embroidered features']::text[],
  '14cm tall seated',
  8,
  '2025-08-14'::timestamptz
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  category = excluded.category,
  images = excluded.images,
  tags = excluded.tags,
  featured = excluded.featured,
  is_active = excluded.is_active,
  materials = excluded.materials,
  dimensions = excluded.dimensions,
  stock_count = excluded.stock_count;


commit;

-- Verify
select category, count(*) as product_count
from public.products
group by category
order by category;
