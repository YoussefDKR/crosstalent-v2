"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signUp, type AuthActionState } from "@/app/(auth)/actions";
import { RoleSelector } from "@/components/auth/role-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import type { UserRole } from "@/types";

const initialState: AuthActionState = {};

type SignupFormProps = {
  defaultRole?: UserRole;
};

export function SignupForm({ defaultRole = "candidate" }: SignupFormProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="role" value={role} />

      {state.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </div>
      )}

      {state.success && (
        <div
          role="status"
          className="rounded-lg border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-3 text-sm text-[#047857]"
        >
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <Label>I am signing up as</Label>
        <RoleSelector
          value={role}
          onChange={setRole}
          disabled={pending || !!state.success}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="Your full name"
          required
          disabled={pending || !!state.success}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          disabled={pending || !!state.success}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
          minLength={8}
          disabled={pending || !!state.success}
        />
      </div>

      <Button
        type="submit"
        disabled={pending || !!state.success}
        className="h-10 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8]"
      >
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms and Privacy Policy. Role cannot be
        changed after registration.
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={siteConfig.links.login}
          className="font-medium text-[#2563EB] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
