-- Studio D: restructure product categories to two-level taxonomy
-- Run once in Supabase SQL Editor after deploying the new category code.
-- Safe to re-run (idempotent updates).

begin;

-- Old flat slug → new taxonomy slug
-- Crochet Flowers → Crochet Creations / Flowers
update public.products
set category = 'flowers'
where category = 'crochet-flowers';

-- Paintings → Art & Decor / Paintings (slug stays "paintings")
update public.products
set category = 'paintings'
where category = 'paintings';

-- Handmade gift sets → the subcategory that matches what is actually in the box
update public.products
set category = 'flowers'
where slug = 'birthday-gift-box-floral';

update public.products
set category = 'keychains'
where slug = 'anniversary-set-lavender-vanilla';

update public.products
set category = 'plushies'
where slug = 'new-baby-welcome-hamper';

-- Decorative Items → Art & Decor / Decor
update public.products
set category = 'decor'
where category = 'decorative-items';

commit;

-- Verify
select category, count(*) as product_count
from public.products
group by category
order by category;
