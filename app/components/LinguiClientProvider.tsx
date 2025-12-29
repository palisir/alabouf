"use client";

import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { type Messages } from "@lingui/core";
import { type ReactNode, useEffect } from "react";

interface LinguiClientProviderProps {
  locale: string;
  messages: Messages;
  children: ReactNode;
}

// Initialize i18n synchronously before first render
function initI18n(locale: string, messages: Messages) {
  if (i18n.locale !== locale) {
    i18n.loadAndActivate({ locale, messages });
  }
}

export default function LinguiClientProvider({
  locale,
  messages,
  children,
}: LinguiClientProviderProps) {
  // Initialize on first render (safe - runs before I18nProvider mounts)
  initI18n(locale, messages);

  // Handle locale/messages changes after initial mount
  useEffect(() => {
    initI18n(locale, messages);
  }, [locale, messages]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}

