import type { Messages } from "@/i18n/dictionaries/en";

type InterpolationValues = Record<string, string | number>;

function resolvePath(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

export function createTranslator(messages: Messages) {
  return function t(key: string, values?: InterpolationValues): string {
    const template = resolvePath(messages, key) ?? key;
    if (!values) return template;
    return template.replace(/\{(\w+)\}/g, (_, token: string) =>
      String(values[token] ?? `{${token}}`)
    );
  };
}

export type Translator = ReturnType<typeof createTranslator>;
