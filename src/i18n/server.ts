import { getLocale } from "@/i18n/get-locale";
import { getMessages } from "@/i18n/get-messages";
import { createTranslator } from "@/i18n/translate";
import type { Locale } from "@/i18n/config";

export async function getServerI18n() {
  const locale = await getLocale();
  const messages = getMessages(locale);
  return {
    locale,
    messages,
    t: createTranslator(messages),
  };
}

export type ServerI18n = {
  locale: Locale;
  messages: ReturnType<typeof getMessages>;
  t: ReturnType<typeof createTranslator>;
};
