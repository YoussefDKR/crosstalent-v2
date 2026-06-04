"use client";

import { RoleNav } from "@/components/layout/role-nav";

/** @deprecated Use RoleNav with role="employer" via DashboardShell */
export function EmployerNav() {
  return <RoleNav role="employer" variant="bar" className="mb-8" />;
}
