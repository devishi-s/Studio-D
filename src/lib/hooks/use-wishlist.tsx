"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useOptimistic,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { toggleWishlistAction } from "@/lib/actions/wishlist";

type WishlistContextValue = {
  ids: Set<string>;
  isAuthenticated: boolean;
  toggle: (productId: string, redirectPath: string) => void;
  isPending: boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

type WishlistProviderProps = {
  children: ReactNode;
  /** Server-known wishlist product IDs; empty when signed out. */
  initialIds: string[];
  isAuthenticated: boolean;
};

export function WishlistProvider({
  children,
  initialIds,
  isAuthenticated,
}: WishlistProviderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticIds, setOptimisticIds] = useOptimistic(
    initialIds,
    (
      current: string[],
      action: { type: "add" | "remove"; productId: string }
    ) => {
      if (action.type === "add") {
        return current.includes(action.productId)
          ? current
          : [...current, action.productId];
      }
      return current.filter((id) => id !== action.productId);
    }
  );

  const toggle = useCallback(
    (productId: string, redirectPath: string) => {
      if (!isAuthenticated) {
        router.push(`/login?redirectTo=${encodeURIComponent(redirectPath)}`);
        return;
      }

      const currentlyWishlisted = optimisticIds.includes(productId);
      const nextWishlisted = !currentlyWishlisted;

      startTransition(async () => {
        setOptimisticIds({
          type: nextWishlisted ? "add" : "remove",
          productId,
        });

        const result = await toggleWishlistAction(productId);

        if (!result.ok) {
          if (result.requiresAuth) {
            router.push(
              `/login?redirectTo=${encodeURIComponent(redirectPath)}`
            );
            return;
          }
          toast.error(result.error);
          router.refresh();
          return;
        }

        toast.success(
          result.wishlisted ? "Added to wishlist" : "Removed from wishlist"
        );
        router.refresh();
      });
    },
    [isAuthenticated, optimisticIds, router, setOptimisticIds]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids: new Set(optimisticIds),
      isAuthenticated,
      toggle,
      isPending,
    }),
    [optimisticIds, isAuthenticated, toggle, isPending]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

type UseWishlistOptions = {
  productId: string;
  /** Used only when no WishlistProvider is present. */
  initialWishlisted?: boolean;
  isAuthenticated?: boolean;
  redirectPath: string;
};

/**
 * Client wishlist toggle with optimistic heart state.
 * Prefer wrapping the tree in `WishlistProvider` so cards stay in sync.
 */
export function useWishlist({
  productId,
  initialWishlisted = false,
  isAuthenticated = false,
  redirectPath,
}: UseWishlistOptions) {
  const ctx = useContext(WishlistContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localWishlisted, setLocalWishlisted] = useOptimistic(
    initialWishlisted,
    (_current: boolean, next: boolean) => next
  );

  if (ctx) {
    return {
      isWishlisted: ctx.ids.has(productId),
      isAuthenticated: ctx.isAuthenticated,
      isPending: ctx.isPending,
      toggle: () => ctx.toggle(productId, redirectPath),
    };
  }

  function toggle() {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=${encodeURIComponent(redirectPath)}`);
      return;
    }

    const next = !localWishlisted;

    startTransition(async () => {
      setLocalWishlisted(next);

      const result = await toggleWishlistAction(productId);
      if (!result.ok) {
        if (result.requiresAuth) {
          router.push(`/login?redirectTo=${encodeURIComponent(redirectPath)}`);
          return;
        }
        toast.error(result.error);
        router.refresh();
        return;
      }

      toast.success(
        result.wishlisted ? "Added to wishlist" : "Removed from wishlist"
      );
      router.refresh();
    });
  }

  return {
    isWishlisted: localWishlisted,
    isAuthenticated,
    isPending,
    toggle,
  };
}
