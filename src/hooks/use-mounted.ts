import { useEffect, useState } from "react";

/**
 * Returns true after the component has mounted on the client.
 * Useful for avoiding hydration mismatches with client-only content
 * like the cart badge count (read from localStorage).
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
