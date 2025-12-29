import { i18n, type Messages } from "@lingui/core";

export type { Messages };

export async function loadCatalog(locale: string): Promise<Messages> {
  const { messages } = await import(`@/locales/${locale}/messages`);
  return messages;
}

export function getI18nInstance(locale: string, messages: Messages) {
  i18n.loadAndActivate({ locale, messages });
  return i18n;
}

