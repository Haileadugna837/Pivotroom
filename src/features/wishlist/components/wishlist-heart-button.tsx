"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/features/wishlist/server/actions";

type WishlistHeartButtonProps = {
  expertId: string;
  initialWishlisted: boolean;
  isSignedIn: boolean;
  className?: string;
};

export function WishlistHeartButton({
  expertId,
  initialWishlisted,
  isSignedIn,
  className = "",
}: WishlistHeartButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push(`/login?next=/experts/${expertId}`);
      return;
    }

    const next = !wishlisted;
    setWishlisted(next);
    startTransition(async () => {
      try {
        const result = await toggleWishlist(expertId);
        setWishlisted(result.wishlisted);
      } catch {
        setWishlisted(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={wishlisted}
      className={`flex h-9 w-9 items-center justify-center text-white transition-transform hover:scale-110 disabled:opacity-70 ${className}`}
      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.5))" }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill={wishlisted ? "currentColor" : "none"} aria-hidden="true">
        <path
          d="M10 17s-6.5-4.06-8.5-8.06C.36 6.1 1.86 3 5 3c1.9 0 3.4 1.1 5 3 1.6-1.9 3.1-3 5-3 3.14 0 4.64 3.1 3.5 5.94C16.5 12.94 10 17 10 17z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
