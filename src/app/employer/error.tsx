"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmployerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-lg border border-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-[#0F172A]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "The employer area failed to load."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Link href="/employer/dashboard">
            <Button className="w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] sm:w-auto">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
