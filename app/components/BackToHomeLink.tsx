"use client";

import Link from "next/link";
import { Trans } from "@lingui/react/macro";

interface BackToHomeLinkProps {
  className?: string;
}

export default function BackToHomeLink({ className }: BackToHomeLinkProps) {
  return (
    <Link
      href="/"
      className={className ?? "text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"}
    >
      <Trans id="navigation.backToHome">← Back to home</Trans>
    </Link>
  );
}

