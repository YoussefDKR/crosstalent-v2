import { AdminFilters } from "@/components/admin/admin-filters";
import type { UserRole } from "@/types";

type AdminUserSearchProps = {
  role: UserRole | "all";
  q: string;
};

export function AdminUserSearch({ role, q }: AdminUserSearchProps) {
  return (
    <div className="space-y-4">
      <AdminFilters
        basePath="/admin/users"
        param="role"
        active={role}
        extraParams={q ? { q } : {}}
        options={[
          { label: "All", value: "all" },
          { label: "Candidates", value: "candidate" },
          { label: "Employers", value: "employer" },
          { label: "Admins", value: "admin" },
        ]}
      />
      <form method="get" className="flex flex-wrap gap-2">
        {role !== "all" && <input type="hidden" name="role" value={role} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or email…"
          className="h-10 min-w-[220px] flex-1 rounded-xl border border-border bg-white px-3 text-sm outline-none ring-[#2563EB] focus:ring-2"
        />
        <button
          type="submit"
          className="h-10 rounded-xl bg-[#0F172A] px-4 text-sm font-medium text-white hover:bg-[#1e293b]"
        >
          Search
        </button>
      </form>
    </div>
  );
}
