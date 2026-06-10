"use client";

import { useActionState } from "react";
import {
  submitContactForm,
  type ContactFormState,
} from "@/app/(marketing)/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/i18n-provider";

const initial: ContactFormState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, initial);
  const { t } = useI18n();

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {state.success}
        </p>
      )}

      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="space-y-2">
        <Label htmlFor="contact-name">{t("contact.nameOptional")}</Label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          placeholder={t("contact.yourName")}
          disabled={pending || Boolean(state.success)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">{t("contact.email")}</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("contact.emailPlaceholder")}
          required
          disabled={pending || Boolean(state.success)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">{t("contact.message")}</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder={t("contact.messagePlaceholder")}
          required
          minLength={10}
          maxLength={5000}
          disabled={pending || Boolean(state.success)}
        />
      </div>

      <Button
        type="submit"
        disabled={pending || Boolean(state.success)}
        className="h-11 w-full bg-[#2563EB] text-white hover:bg-[#1d4ed8] sm:w-auto sm:px-8"
      >
        {pending ? t("contact.sending") : t("contact.sendBtn")}
      </Button>
    </form>
  );
}
