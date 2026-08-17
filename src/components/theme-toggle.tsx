"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, type LucideIcon } from "lucide-react";

type ThemePreference = "light" | "dark" | "system";

const OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function applyTheme(preference: ThemePreference) {
  const isDark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Read the stored preference on mount (the anti-flash script in the root
  // layout already applied the right class before this ever renders — this
  // just syncs the toggle's own UI state to match). Reading localStorage
  // during the initial render (instead of here) would mismatch the server's
  // render and trigger a hydration error, so this has to be an effect —
  // the standard SSR "mounted guard" pattern.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme") as ThemePreference | null;
    setPreference(stored ?? "system");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // While "system" is selected, keep following the OS preference live if it
  // changes without a page reload (e.g. the user's device switches at sunset).
  useEffect(() => {
    if (!mounted || preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [mounted, preference]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(value: ThemePreference) {
    setPreference(value);
    window.localStorage.setItem("theme", value);
    applyTheme(value);
    setOpen(false);
  }

  if (!mounted) {
    return <div className="h-9 w-9 shrink-0" aria-hidden="true" />;
  }

  const ActiveIcon = OPTIONS.find((o) => o.value === preference)?.icon ?? Monitor;

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-black/70 hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
      >
        <ActiveIcon size={16} strokeWidth={1.6} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-36 overflow-hidden rounded-xl border border-black/10 bg-background shadow-lg dark:border-white/15"
        >
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = option.value === preference;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => select(option.value)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm ${
                  active
                    ? "font-medium text-foreground"
                    : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                }`}
              >
                <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
