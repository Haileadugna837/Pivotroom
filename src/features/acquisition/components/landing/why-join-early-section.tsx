const VALUE_PROPS = [
  { title: "Request experts", text: "Tell us who you'd love to talk to." },
  { title: "Shape the marketplace", text: "Tell us what problems you need help solving." },
  { title: "Get first access", text: "Know when matching experts become available." },
  { title: "Follow experts", text: "Get notified when someone you want joins Pivotroom." },
];

export function AcquisitionWhyJoinEarlySection({ onGetEarlyAccess }: { onGetEarlyAccess: () => void }) {
  return (
    <section className="border-t border-black/10 bg-black/[0.02] px-6 py-16 text-center dark:border-white/15 dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">Join before Pivotroom opens.</h2>
      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
        {VALUE_PROPS.map((item) => (
          <div key={item.title}>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">{item.text}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onGetEarlyAccess}
        className="mt-10 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background"
      >
        Get Early Access
      </button>
    </section>
  );
}
