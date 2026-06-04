import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getCurrentProfile } from "@/lib/auth/session";

/** Auth-aware header needs fresh session cookies (avoid static marketing shell). */
export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
