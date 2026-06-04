"use client";

import { RoleNav } from "@/components/layout/role-nav";

/** @deprecated Use RoleNav with role="candidate" via DashboardShell */
export function CandidateNav() {
  return <RoleNav role="candidate" variant="bar" className="mb-8" />;
}
