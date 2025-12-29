"use client";

import { Trans } from "@lingui/react/macro";

export default function Home() {
  return (
    <div className="text-center py-12 px-6 md:py-16 md:px-8">
      <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        <Trans id="home.tagline">We tried, we loved, we share. Our favorite restaurants on a map.</Trans>
      </p>
    </div>
  );
}
