import { CaptureAcquisitionVisit } from "@/features/acquisition/components/capture-acquisition-visit";
import { BecomeExpertHero } from "@/features/acquisition/components/become-expert/hero";
import { BecomeExpertInvitationBand } from "@/features/acquisition/components/become-expert/invitation-band";
import { BecomeExpertBelief } from "@/features/acquisition/components/become-expert/belief-section";
import { BecomeExpertWho } from "@/features/acquisition/components/become-expert/who-section";
import { BecomeExpertBenefits } from "@/features/acquisition/components/become-expert/benefits-section";
import { BecomeExpertEconomics } from "@/features/acquisition/components/become-expert/economics-section";
import { BecomeExpertHowItWorks } from "@/features/acquisition/components/become-expert/how-it-works";
import { BecomeExpertStandards } from "@/features/acquisition/components/become-expert/standards-section";
import { BecomeExpertApplicationForm } from "@/features/acquisition/components/become-expert/application-form";
import { BecomeExpertFaq } from "@/features/acquisition/components/become-expert/faq-section";
import { BecomeExpertFinalCta } from "@/features/acquisition/components/become-expert/final-cta-section";

export function BecomeExpertView({
  isLoggedIn,
  userEmail,
}: {
  isLoggedIn: boolean;
  userEmail: string | null;
}) {
  return (
    <div className="flex flex-1 flex-col bg-pivot-paper font-dm-sans text-pivot-ink">
      <CaptureAcquisitionVisit />
      <BecomeExpertHero />
      <BecomeExpertInvitationBand />
      <BecomeExpertBelief />
      <BecomeExpertWho />
      <BecomeExpertBenefits />
      <BecomeExpertEconomics />
      <BecomeExpertHowItWorks />
      <BecomeExpertStandards />
      <BecomeExpertApplicationForm isLoggedIn={isLoggedIn} userEmail={userEmail} />
      <BecomeExpertFaq />
      <BecomeExpertFinalCta />
    </div>
  );
}
