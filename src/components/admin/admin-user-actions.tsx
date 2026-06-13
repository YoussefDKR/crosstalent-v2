"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  adminBanUser,
  adminExtendEmployerTrial,
  adminUnbanUser,
  adminUpdateEmployerSubscription,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-provider";
import type { AdminUserProfile } from "@/lib/admin/types";

type AdminUserActionsProps = {
  data: AdminUserProfile;
};

export function AdminUserActions({ data }: AdminUserActionsProps) {
  const { t } = useI18n();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const { profile, subscription } = data;
  const isEmployer = profile.role === "employer";
  const isAdmin = profile.role === "admin";

  function run(action: () => Promise<{ error?: string; success?: string }>) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
        return;
      }
      setMessage(result.success ?? t("admin.saving"));
      router.refresh();
    });
  }

  if (isAdmin) {
    return null;
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="space-y-6 p-6">
        <h2 className="font-semibold text-[#0F172A]">{t("admin.userActionsTitle")}</h2>

        {profile.is_banned && profile.ban_reason && (
          <p className="text-sm text-red-700">
            Suspended: {profile.ban_reason}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {profile.is_banned ? (
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => run(() => adminUnbanUser(profile.id))}
            >
              {t("admin.unbanUser")}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="text-red-600 hover:text-red-700"
              disabled={pending}
              onClick={() => {
                if (!window.confirm(t("admin.banConfirm"))) return;
                run(() => adminBanUser(profile.id));
              }}
            >
              {t("admin.banUser")}
            </Button>
          )}
        </div>

        {isEmployer && (
          <>
            <div className="border-t border-border/60 pt-6">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                {t("admin.extendTrial")}
              </h3>
              <form
                className="mt-3 flex flex-wrap items-end gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const days = Number(fd.get("extraDays"));
                  run(() => adminExtendEmployerTrial(profile.id, days));
                }}
              >
                <div>
                  <label className="text-xs text-muted-foreground">
                    {t("admin.extendTrialDays")}
                  </label>
                  <Input
                    name="extraDays"
                    type="number"
                    min={1}
                    max={365}
                    defaultValue={30}
                    className="mt-1 w-28"
                  />
                </div>
                <Button type="submit" variant="outline" disabled={pending}>
                  {t("admin.extendTrialBtn")}
                </Button>
              </form>
            </div>

            <div className="border-t border-border/60 pt-6">
              <h3 className="text-sm font-semibold text-[#0F172A]">
                {t("admin.subscriptionOverride")}
              </h3>
              {subscription?.stripe_subscription_id && (
                <p className="mt-2 text-xs text-amber-700">
                  {t("admin.stripeManagedWarning")}
                </p>
              )}
              <form
                className="mt-3 grid gap-3 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  run(() =>
                    adminUpdateEmployerSubscription(profile.id, {
                      planId: String(fd.get("planId")),
                      status: String(fd.get("status")),
                      trialEndsAt: String(fd.get("trialEndsAt") || "") || null,
                    })
                  );
                }}
              >
                <div>
                  <label className="text-xs text-muted-foreground">
                    {t("admin.planLabel")}
                  </label>
                  <select
                    name="planId"
                    className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
                    defaultValue={subscription?.plan_id ?? "starter"}
                  >
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    {t("admin.statusLabel")}
                  </label>
                  <select
                    name="status"
                    className="mt-1 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
                    defaultValue={subscription?.status ?? "inactive"}
                  >
                    <option value="inactive">inactive</option>
                    <option value="trialing">trialing</option>
                    <option value="active">active</option>
                    <option value="past_due">past_due</option>
                    <option value="canceled">canceled</option>
                    <option value="unpaid">unpaid</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">
                    {t("admin.trialEndsLabel")}
                  </label>
                  <Input
                    name="trialEndsAt"
                    type="datetime-local"
                    className="mt-1"
                    defaultValue={
                      subscription?.trial_ends_at
                        ? subscription.trial_ends_at.slice(0, 16)
                        : ""
                    }
                  />
                </div>
                <Button type="submit" disabled={pending} className="sm:col-span-2 w-fit">
                  {t("admin.saveSubscription")}
                </Button>
              </form>
            </div>
          </>
        )}

        {message && <p className="text-sm text-green-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </CardContent>
    </Card>
  );
}
