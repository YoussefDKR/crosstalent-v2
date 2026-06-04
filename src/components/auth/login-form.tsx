"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getPostLoginPath,
  signInWithEmail,
} from "@/lib/auth/client-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";

type LoginFormProps = {
  redirectTo?: string;
  authError?: string;
};

export function LoginForm({ redirectTo, authError }: LoginFormProps) {
  const [error, setError] = useState<string | null>(authError ?? null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signInWithEmail(email, password);

    if ("error" in result) {
      setError(result.error);
      setPending(false);
      return;
    }

    const path = getPostLoginPath(result.role, redirectTo);
    // Full navigation so the marketing layout header picks up the new session.
    window.location.href = path;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          disabled={pending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={pending}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={siteConfig.links.signup}
          className="font-medium text-[#2563EB] hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
