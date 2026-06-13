import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerI18n } from "@/i18n/server";

export default async function AccountSuspendedPage() {
  const { t } = await getServerI18n();

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50/50 px-4 py-16">
      <Card className="max-w-md border-border/80 shadow-sm">
        <CardContent className="space-y-4 p-8 text-center">
          <h1 className="text-xl font-semibold text-[#0F172A]">
            {t("auth.accountSuspended")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("auth.accountSuspendedDesc")}
          </p>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline" className="w-full">
              {t("auth.signOut")}
            </Button>
          </form>
          <Link
            href="/contact"
            className="block text-sm font-medium text-[#2563EB] hover:underline"
          >
            {t("auth.contactSupport")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
