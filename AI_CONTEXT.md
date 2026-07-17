# Studio D — AI Project Context

> Permanent project memory for developers and Cursor agents.
>
> **`ROADMAP.md` is the authoritative implementation plan. Every Cursor agent must read both files before making changes.**

## Continuation Protocol

1. Read `AI_CONTEXT.md` and `ROADMAP.md` before inspecting or changing code.
2. Continue from the **first incomplete roadmap item**.
3. Complete only one roadmap step at a time unless the user explicitly requests otherwise.
4. After completing a step:
   - mark it complete and update **Current Step** in `ROADMAP.md`;
   - update **Current Project State** in this file.
5. Preserve the existing architecture, conventions, and design language.
6. **Never execute Git commands automatically.** Recommend the exact Git command and wait for explicit user confirmation before any Git operation, including status, diff, add, commit, branch, merge, pull, push, or PR commands.

## Project Overview

Studio D is a premium e-commerce storefront for handmade art and crafts. Its initial catalog includes crochet flowers, paintings, handmade gifts, and decorative crochet/home items.

The experience should combine the cleanliness of Apple, Notion, and Muji with the warmth of an Etsy artisan shop.

### Vision and Goals

- Present handmade products through a polished, trustworthy storefront.
- Make browsing and cart management simple on mobile and desktop.
- Build progressively: static storefront first, then cart, backend/auth, payments, and launch polish.
- Keep the code understandable for a first-time full-stack developer.
- Produce a deployable milestone at the end of every roadmap phase.

### Target Audience

- India-based shoppers seeking thoughtful handmade gifts and decor.
- Customers who value craft, warmth, originality, and premium presentation.
- Mobile shoppers using UPI/cards eventually through Razorpay.

## Tech Stack

- Next.js App Router with React Server Components
- TypeScript
- Tailwind CSS v4
- shadcn/ui using Base UI primitives
- Zustand with persistence for cart state
- Sonner for toast feedback
- Lucide React for icons
- Supabase later: PostgreSQL, Auth, Storage, and RLS
- Razorpay later: payments
- React Hook Form + Zod later: validated forms
- Embla Carousel later if the gallery needs a full carousel
- Resend or Supabase Edge Functions later: transactional email
- Vercel: intended deployment platform

Do not install future-phase libraries before their roadmap step requires them.

## Architecture

### Core Principles

- Server Components are the default for data fetching, SEO content, and static UI.
- Add `"use client"` only to small interactive leaves using hooks, Zustand, events, or browser APIs.
- Route groups organize related pages without changing public URLs.
- Pages compose focused reusable components rather than containing large UI implementations.
- Static data access is isolated behind helpers so Supabase can replace it later.
- URL search parameters are the source of truth for filters and sorting.
- Persist only lean cart references, never full product objects.
- Shared styling comes from brand tokens and reusable components, not one-off values.

### Folder Structure

```text
src/
├── app/
│   ├── (shop)/              # Storefront routes
│   │   ├── about/
│   │   ├── cart/
│   │   ├── categories/
│   │   │   └── [slug]/
│   │   └── products/
│   │       └── [slug]/
│   ├── layout.tsx           # Global Navbar, Footer, and Toaster
│   ├── page.tsx             # Homepage
│   └── globals.css          # Tailwind and brand tokens
├── components/
│   ├── cart/                # Cart sheet, page, rows, summary
│   ├── common/              # Logo, section headers, placeholders
│   ├── layout/              # Navbar, footer, container, homepage sections
│   ├── product/             # Cards, grids, filters, gallery, cart controls
│   └── ui/                  # shadcn/Base UI primitives
├── data/
│   └── products.ts          # Temporary catalog and query helpers
├── hooks/
│   └── use-mounted.ts       # Client hydration guard
├── lib/
│   ├── constants.ts
│   ├── format.ts
│   └── utils.ts
├── store/
│   └── cart.store.ts
└── types/
    └── index.ts
```

Planned route groups `(auth)` and `(account)`, Supabase helpers, checkout, contact, and admin areas should be added only when their roadmap steps begin.

## Routing Structure

### Implemented

- `/` — homepage
- `/products` — product listing, category filtering, and sorting
- `/products/[slug]` — product details and related products
- `/categories` — category index
- `/categories/[slug]` — category listing
- `/about` — brand story
- `/cart` — cart management

### Planned

- `/contact`
- `/checkout`
- `/login`
- `/signup`
- `/account`
- `/account/orders`
- `/account/orders/[id]`
- `/admin`
- `/admin/products`
- `/admin/orders`

Dynamic product routes use `generateStaticParams()`. Invalid product and category slugs use `notFound()`.

## Design System

### Brand Character

Artistic, cozy, elegant, minimal, premium, handmade, thoughtful, and timeless.

### Palette

- Brown: `#6B3A2A` — headings and primary actions
- Warm brown: `#8B5E3C` — supporting text
- Cream: `#FDF5F0` — page background
- Blush: `#F5E6DB` — cards and soft surfaces
- Sage: `#7B9E87` — trust/success accents
- Coral: `#D4856A` — highlights and interactive accents
- Honey gold: `#E8B44D` — small decorative emphasis

Use the existing CSS variables and Tailwind token names. Do not replace this palette with generic shadcn defaults.

### Typography and Shape

- Playfair Display for headings.
- Geist for body content.
- Rounded cards, pills, and controls.
- Soft borders and restrained shadows.
- Generous whitespace and readable line lengths.
- Subtle fade/slide and hover animations only; avoid loud or excessive motion.

### UI/UX Principles

- Mobile-first and responsive.
- Clear hierarchy and one obvious primary action.
- Friendly handmade brand voice.
- Accessible labels, keyboard behavior, focus states, and native semantics.
- Empty, loading, invalid, and out-of-stock states are first-class UI.
- Avoid layout shifts and hydration mismatches.
- Checkout/payment must never appear functional before secure server work exists.

## Coding Conventions

- Files and folders: `kebab-case`
- Components and types: `PascalCase`
- Functions, variables, and hooks: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Booleans: `is*` or `has*`
- Event handlers: `handle*`
- Store files: `*.store.ts`
- Use named exports for reusable components.
- Use `import type` for type-only imports.
- Use absolute imports through `@/`.
- Use Tailwind utilities and the shared `cn()` helper.
- Keep domain types in `src/types` and site configuration in `src/lib/constants.ts`.
- Handle async failures explicitly; do not swallow errors.
- Avoid unrelated refactors while completing a roadmap step.

## Component Organization and Reusable Patterns

### Layout

`Navbar`, `NavLinks`, `MobileNav`, `Footer`, `Container`, `HeroBanner`, `CategoryShowcase`, `FeaturedProducts`, and `BrandStory`.

### Product

`ProductCard`, `ProductGrid`, `ProductFilters`, `ImageGallery`, `AddToCartButton`, `QuantitySelector`, and `ProductDetailCart`.

### Cart

`CartSheet`, `CartPageContent`, `CartItemRow`, and `CartSummary`.

### Common

`Logo`, `SectionHeader`, `ImagePlaceholder`, and `CategoryCard`.

### Patterns to Reuse

- Compose pages from section components.
- Reuse `ProductCard` through `ProductGrid` across all listings.
- Use controlled quantity selectors.
- Resolve cart product data at render time from `productId`.
- Use `useMounted()` before rendering persisted client state.
- Use Sonner for concise action feedback.
- Keep filters/sorting in the URL.
- Use `formatPrice()` for all currency display.

## Features Completed

- Next.js, TypeScript, Tailwind, and shadcn setup
- Brand tokens, typography, and global animations
- Global responsive Navbar, mobile navigation, Footer, and content container
- Homepage hero, categories, featured products, and brand story
- Static product/category catalog with query, filtering, and sorting helpers
- Product listing and category pages
- Product details, gallery placeholders, metadata, static parameters, stock display, and related products
- About page
- Zustand cart with add, remove, quantity update, clear, count, subtotal, and localStorage persistence
- Functional Add to Cart buttons across cards and product details
- Quantity selector on product details
- Sonner confirmation and out-of-stock feedback
- Navbar cart badge and quick-access cart Sheet
- Full `/cart` page with responsive line items, controls, totals, clear action, and empty state
- Disabled checkout placeholders to prevent implying payment support
- Responsive `/contact` page with contact details and social placeholder
- Accessible contact form with local validation, inline errors, toast feedback, and an honest `mailto:` draft handoff

## Current Project State

- **Roadmap phase:** Phase 3 — Supabase + Auth + Real Data
- **Current step:** Phase 3.1 — Supabase setup
- Phase 1 storefront implementation is complete.
- Phase 2 cart, interactivity, and contact work is complete.
- Product/category data remains static.
- Images remain branded placeholders.
- Cart data persists locally under `studio-d-cart`.
- Contact messages are not delivered by a backend; the form prepares a draft in the visitor's email app.
- Checkout, backend, authentication, orders, payments, and admin are not implemented.
- The last reported production build passed with the static `/contact` route.
- Vercel deployment status is not verified.

## Important Decisions and Why

- **App Router:** Server Components, nested layouts, streaming, and current Next.js direction.
- **shadcn/ui:** components live in the repository and remain fully customizable.
- **Zustand over Redux/Context:** minimal boilerplate, selective subscriptions, and simple persistence.
- **Lean cart items:** `{ productId, quantity }` avoids stale duplicated product data.
- **URL filter state:** shareable, bookmarkable, and SEO-friendly.
- **Static data first:** UI and product experience can be validated before backend complexity.
- **Supabase later:** PostgreSQL, Auth, Storage, and RLS fit the planned commerce backend.
- **Server-authoritative payments later:** prices, stock, totals, and order state must be recalculated server-side before Razorpay.

## Things Future Agents Must Not Change

- Do not replace the App Router or move the project to the Pages Router.
- Do not replace the Studio D palette, typography, brand voice, or handmade design language without user approval.
- Do not persist full `Product` objects in the cart.
- Do not make entire pages Client Components when a small client island is sufficient.
- Do not introduce Redux or another global store without a demonstrated need and user approval.
- Do not bypass the roadmap or combine multiple roadmap steps without instruction.
- Do not implement Razorpay before server-side order creation and validation exist.
- Do not trust client-provided prices, totals, inventory, payment status, or user identity.
- Do not remove responsive, empty, invalid, loading, stock, or accessibility states.
- Do not copy Radix-specific shadcn patterns blindly: this project uses Base UI.
- Do not execute any Git command without explicit user confirmation.

## Important Base UI Note

This shadcn installation uses Base UI primitives:

- The project `Button` does not use the traditional Radix `asChild` pattern.
- Rendered triggers/closers must respect native element semantics.
- A prior `SheetClose` rendered as a Next.js `Link` triggered a `nativeButton` runtime warning. It was fixed by using a normal `Link` and closing the Sheet with component state.

## Pending Improvements

Follow `ROADMAP.md` for implementation order. Known technical improvements include:

- Enforce each product’s `stockCount` in all cart quantity controls.
- Consolidate duplicated quantity-control UI where useful.
- Add real product images through `next/image`.
- Add unit/integration tests for cart operations, totals, filters, and forms.
- Add loading skeletons and stronger error boundaries.
- Complete accessibility and responsive-browser QA.
- Add versioning/migration handling for persisted cart data before catalog changes.
- Verify and perform deployment when directed.

## Future Cursor Agent Instructions

- Explain architectural choices in beginner-friendly language.
- Inspect existing components and types before creating alternatives.
- Reuse existing components and tokens wherever possible.
- Keep each change proportional to one roadmap item.
- Verify TypeScript/build behavior after implementation.
- Do not claim deployment, tests, payment, or backend behavior unless verified.
- Update this file and `ROADMAP.md` after every completed roadmap step.
