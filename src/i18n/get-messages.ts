import type { Locale } from "@/i18n/config";
import { ar } from "@/i18n/dictionaries/ar";
import { en } from "@/i18n/dictionaries/en";
import { fr } from "@/i18n/dictionaries/fr";
import type { Messages } from "@/i18n/dictionaries/en";

const dictionaries: Record<Locale, Messages> = {
  en,
  fr,
  ar,
};

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale] ?? en;
}
