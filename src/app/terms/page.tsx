import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern using Pivotroom.africa.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Terms of Service</h1>
      <p className="mb-8 text-sm text-black/50 dark:text-white/50">Last updated {new Date().getFullYear()}</p>

      <div className="flex flex-col gap-6 text-sm text-black/80 dark:text-white/80">
        <section>
          <h2 className="mb-2 font-medium">What Pivotroom.africa is</h2>
          <p>
            Pivotroom.africa is a marketplace that connects clients with independent experts for paid,
            1:1 video sessions. Experts are not employees of Pivotroom — they set their own rates and
            availability, and are responsible for the advice they give during a session.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Booking and payment</h2>
          <p>
            A booking reserves a time slot; it is confirmed once you submit payment proof and an admin
            verifies it. Verified sessions include a video call link where available. If your proof
            can&apos;t be verified, the booking is rejected and you should contact us to resolve it. You may
            cancel a booking before it&apos;s confirmed, or up to 2 hours before a confirmed session&apos;s
            start time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Expert applications</h2>
          <p>
            Becoming an expert currently requires an invitation. Admin reviews and approves applications,
            and may reject or suspend an expert account at its discretion — for example for
            misrepresentation, no-shows, or conduct that undermines trust in the platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Account standing</h2>
          <p>
            We may restrict an account (blocking new bookings) or suspend it (blocking sign-in entirely)
            if we believe it&apos;s being used to abuse the platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Reviews</h2>
          <p>
            Clients may leave a rating and comment after a completed session. Reviews should reflect a
            genuine experience; we may hide a review that violates this without deleting the underlying
            record.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Changes</h2>
          <p>We may update these terms as the platform evolves. Material changes will be reflected here.</p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Questions</h2>
          <p>Reach out via the Contact us link in the footer.</p>
        </section>
      </div>
    </div>
  );
}
