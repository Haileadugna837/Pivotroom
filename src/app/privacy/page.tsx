import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Pivotroom.africa collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-xl font-semibold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-black/50 dark:text-white/50">Last updated {new Date().getFullYear()}</p>

      <div className="flex flex-col gap-6 text-sm text-black/80 dark:text-white/80">
        <section>
          <h2 className="mb-2 font-medium">What we collect</h2>
          <p>
            When you create an account, we collect your name and email address. If you apply to become
            an expert, we additionally collect your headline, bio, category, rate, photo, timezone, and
            payout bank details. When you book a session, we collect the transaction details you submit
            as payment proof (transaction ID, payer name, date). We do not process card payments directly
            — payments are verified manually by an administrator against your submitted proof.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">How we use it</h2>
          <p>
            We use this information to operate the marketplace: to show your profile to prospective
            clients (if you&apos;re an expert), to create and manage bookings, to verify payments, to send
            transactional emails (booking confirmations, payment status, invites), and to keep basic
            aggregate traffic metrics (page views) for our own product decisions.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Who can see it</h2>
          <p>
            Your name and photo are visible to other users where relevant (e.g. an expert&apos;s public
            profile, or a client&apos;s name to the expert they&apos;ve booked). Payout bank details, payment
            proof, and account email are only visible to you and to Pivotroom administrators. We do not
            sell your information to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Third-party services</h2>
          <p>
            We use Supabase for authentication and data storage, Google Calendar/Meet (only if an expert
            chooses to connect their calendar) to schedule and generate meeting links, and Resend to send
            transactional email.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Google Calendar access</h2>
          <p>
            If an expert chooses to connect their Google Calendar, we request access only to their calendar
            events (not their full calendar settings or other calendars) so we can check their availability
            and create booking events with a Google Meet link attached. This access is optional — clients
            never need it, and experts can use Pivotroom without connecting a calendar.
          </p>
          <p className="mt-2">
            We store the resulting access token only for as long as the calendar stays connected. An expert
            can revoke access at any time using the &ldquo;Disconnect&rdquo; button on their availability
            settings page, or directly from their{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google Account permissions
            </a>{" "}
            page.
          </p>
          <p className="mt-2">
            Pivotroom&apos;s use and transfer of information received from Google APIs to any other app will
            adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Your choices</h2>
          <p>
            You can update or delete most of your profile information from your account settings at any
            time. To request full account deletion, use the Contact us link in the site footer.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-medium">Questions</h2>
          <p>Reach out via the Contact us link in the footer with any privacy questions or requests.</p>
        </section>
      </div>
    </div>
  );
}
