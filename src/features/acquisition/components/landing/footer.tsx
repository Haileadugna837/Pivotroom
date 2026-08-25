export function AcquisitionFooter() {
  return (
    <footer className="border-t border-pivot-line py-14 pb-7">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col justify-between gap-8 px-6 sm:flex-row">
        <div>
          <div className="font-serif text-4xl text-pivot-ink">pivotroom</div>
          <p className="mt-3 max-w-[430px] text-xs leading-relaxed text-pivot-muted">
            A space for useful conversations with people whose experience can move your next decision forward.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs text-pivot-ink">
          <a href="#join" className="hover:text-pivot-accent">
            Early access
          </a>
          <a href="#problems" className="hover:text-pivot-accent">
            Use cases
          </a>
          <a href="#how" className="hover:text-pivot-accent">
            How it works
          </a>
          <a href="#faq" className="hover:text-pivot-accent">
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}
