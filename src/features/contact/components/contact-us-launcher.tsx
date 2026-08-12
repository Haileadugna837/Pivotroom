"use client";

import { useState } from "react";
import { ContactUsModal } from "@/features/contact/components/contact-us-modal";

export function ContactUsLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm underline">
        Contact us
      </button>
      {open && <ContactUsModal onClose={() => setOpen(false)} />}
    </>
  );
}
