import { type Messages } from "@lingui/core";

export async function loadCatalog(locale: string): Promise<Messages> {
  const { messages } = await import(`@/locales/${locale}/messages`);
  return messages;
}
