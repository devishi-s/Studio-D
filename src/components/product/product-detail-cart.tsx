"use client";

import { useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { QuantitySelector } from "@/components/product/quantity-selector";

type ProductDetailCartProps = {
  productId: string;
  productName: string;
  inStock: boolean;
  maxQuantity: number;
};

export function ProductDetailCart({
  productId,
  productName,
  inStock,
  maxQuantity,
}: ProductDetailCartProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-3">
      {inStock && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">Qty</span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            max={maxQuantity}
          />
        </div>
      )}
      <AddToCartButton
        productId={productId}
        productName={productName}
        inStock={inStock}
        quantity={quantity}
      />
    </div>
  );
}
