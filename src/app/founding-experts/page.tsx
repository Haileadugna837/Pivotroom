import { redirect } from "next/navigation";

// The standalone "Founding Experts" program was retired and merged into
// the general, ongoing "Become an Expert" flow — this route stays as a
// redirect so old links/bookmarks don't 404.
export default function FoundingExpertsPage() {
  redirect("/become-an-expert");
}
