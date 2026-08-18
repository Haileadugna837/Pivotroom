import type { Metadata } from "next";
import { NominateAnExpertView } from "@/features/acquisition/components/nominate-an-expert-view";

// Deliberately separate from the existing authed /nominate page — no
// sign-in required here, per spec. Kept as its own route so /nominate's
// existing, live, signed-in-only behavior is untouched.
export const metadata: Metadata = {
  title: "Nominate an expert",
};

export default function NominateAnExpertPage() {
  return <NominateAnExpertView />;
}
