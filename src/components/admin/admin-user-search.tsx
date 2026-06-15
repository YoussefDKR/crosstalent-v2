"use client";

import { AdminFilters } from "@/components/admin/admin-filters";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-provider";
import type { UserRole } from "@/types";

type AdminUserSearchProps = {
  role: UserRole | "all";
  q: string;
};

export function AdminUserSearch({ role, q }: AdminUserSearchProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <AdminFilters
        basePath="/admin/users"
        param="role"
        active={role}
        extraParams={q ? { q } : {}}
        options={[
          { label: t("admin.filterAll"), value: "all" },
          { label: t("admin.filterCandidates"), value: "candidate" },
          { label: t("admin.filterEmployers"), value: "employer" },
          { label: t("admin.filterAdmins"), value: "admin" },
        ]}
      />
      <form method="get" className="flex flex-wrap gap-2">
        {role !== "all" && <input type="hidden" name="role" value={role} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t("admin.searchPlaceholder")}
          className="h-10 min-w-[220px] flex-1 rounded-xl border border-border bg-white px-3 text-sm outline-none ring-brand-accent focus:ring-2"
        />
        <Button type="submit" variant="brand" className="h-10 rounded-xl px-4">
          {t("admin.search")}
        </Button>
      </form>
    </div>
  );
}
