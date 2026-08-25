type FeaturedLogo = { id: string; name: string; logo_url: string; link_url: string | null };

export function FeaturedLogosStrip({ logos }: { logos: FeaturedLogo[] }) {
  if (logos.length === 0) return null;

  return (
    <div className="mt-10 border-t border-pivot-paper/15 pt-6">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-pivot-paper/60">Featured on</p>
      <div className="flex gap-8 overflow-x-auto pb-1">
        {logos.map((logo) => {
          const img = (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.logo_url}
              alt={logo.name}
              className="h-6 w-auto shrink-0 object-contain grayscale opacity-60 transition hover:opacity-100 hover:grayscale-0 sm:h-7"
            />
          );
          return logo.link_url ? (
            <a key={logo.id} href={logo.link_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
              {img}
            </a>
          ) : (
            <span key={logo.id} className="shrink-0">
              {img}
            </span>
          );
        })}
      </div>
    </div>
  );
}
