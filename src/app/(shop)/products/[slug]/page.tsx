import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck, Shield, Undo2 } from "lucide-react";

import { getProductBySlug, getProductsByCategory, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import { ImageGallery } from "@/components/product/image-gallery";
import { ProductDetailCart } from "@/components/product/product-detail-cart";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

const PROMISES = [
  { icon: Truck, text: "Free shipping over ₹999" },
  { icon: Shield, text: "Quality guaranteed" },
  { icon: Undo2, text: "Easy 7-day returns" },
] as const;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;

  const relatedProducts = getProductsByCategory(product.category.slug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="py-10 sm:py-14">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-brown"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/categories/${product.category.slug}`}
            className="transition-colors hover:text-brand-brown"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product detail grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image gallery — interactive client component */}
          <ImageGallery
            images={product.images}
            productName={product.name}
          />

          {/* Product info — server rendered */}
          <div className="flex flex-col">
            {/* Category */}
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-xs font-medium uppercase tracking-widest text-brand-coral transition-colors hover:text-brand-brown"
            >
              {product.category.name}
            </Link>

            {/* Name */}
            <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-brand-brown sm:text-3xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-brand-brown">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <span className="rounded-full bg-brand-coral/10 px-2.5 py-0.5 text-xs font-semibold text-brand-coral">
                    Save {formatPrice(product.compareAtPrice! - product.price)}
                  </span>
                </>
              )}
            </div>

            <Separator className="my-5" />

            {/* Description */}
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {/* Materials & Dimensions */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown">
                  Materials
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {product.materials.map((mat) => (
                    <li
                      key={mat}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-coral" />
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-brown">
                  Dimensions
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {product.dimensions}
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Quantity selector + Add to cart */}
            <ProductDetailCart
              productId={product.id}
              productName={product.name}
              inStock={product.stockCount > 0}
              maxQuantity={product.stockCount}
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {product.stockCount > 0
                ? `${product.stockCount} in stock — ready to ship`
                : "Currently out of stock"}
            </p>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {PROMISES.map((item) => (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-1.5 rounded-lg bg-brand-blush/50 px-2 py-3 text-center"
                >
                  <item.icon className="h-4 w-4 text-brand-sage" />
                  <span className="text-[11px] leading-tight text-muted-foreground">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-brand-blush px-2.5 py-0.5 text-[11px] text-brand-brown-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <SectionHeader
              title="You May Also Like"
              subtitle={`More from ${product.category.name}`}
            />
            <div className="mt-8">
              <ProductGrid products={relatedProducts} columns={4} />
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
