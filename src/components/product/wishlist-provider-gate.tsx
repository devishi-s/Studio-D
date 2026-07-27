import { createClient } from "@/lib/supabase/server";
import { getWishlistProductIds } from "@/lib/supabase/wishlist";
import { WishlistProvider } from "@/lib/hooks/use-wishlist";

type WishlistProviderGateProps = {
  children: React.ReactNode;
};

/** Server wrapper that seeds wishlist IDs for the signed-in user. */
export async function WishlistProviderGate({
  children,
}: WishlistProviderGateProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const initialIds = user ? await getWishlistProductIds(user.id) : [];

  return (
    <WishlistProvider
      initialIds={initialIds}
      isAuthenticated={Boolean(user)}
    >
      {children}
    </WishlistProvider>
  );
}
