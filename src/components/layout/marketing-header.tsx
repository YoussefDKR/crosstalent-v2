import { Header } from "@/components/layout/header";
import { listAppNotifications } from "@/lib/notifications/queries";
import type { Profile } from "@/types";

type MarketingHeaderProps = {
  profile: Profile | null;
};

/** Guest marketing pages — notifications when a session exists (e.g. pricing). */
export async function MarketingHeader({ profile }: MarketingHeaderProps) {
  const notifications = profile
    ? await listAppNotifications(profile)
    : [];

  return <Header profile={profile} notifications={notifications} />;
}
