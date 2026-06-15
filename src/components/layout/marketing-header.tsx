import { Header } from "@/components/layout/header";
import { EMPLOYER_ONBOARDING_PATH } from "@/lib/auth/routes";
import { getCompanyProfileData } from "@/lib/employer/queries";
import { isEmployerCompanyComplete } from "@/lib/employer/onboarding";
import { listAppNotifications } from "@/lib/notifications/queries";
import type { Profile } from "@/types";

type MarketingHeaderProps = {
  profile: Profile | null;
};

/** Guest marketing pages — notifications when a session exists (e.g. pricing). */
export async function MarketingHeader({ profile }: MarketingHeaderProps) {
  const notifications = profile ? await listAppNotifications(profile) : [];

  let forceMarketingNav = false;
  let primaryActionHref: string | undefined;

  if (profile?.role === "employer") {
    const data = await getCompanyProfileData(profile);
    if (!isEmployerCompanyComplete(data.company)) {
      forceMarketingNav = true;
      primaryActionHref = EMPLOYER_ONBOARDING_PATH;
    }
  }

  return (
    <Header
      profile={profile}
      notifications={notifications}
      variant="marketing"
      forceMarketingNav={forceMarketingNav}
      primaryActionHref={primaryActionHref}
    />
  );
}
