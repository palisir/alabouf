import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import "./globals.css";
import { PanelProvider } from "./components/PanelContext";
import LinguiClientProvider from "./components/LinguiClientProvider";
import Map from "./components/Map";
import PanelWithContent from "./components/PanelWithContent";
import { getRestaurants } from "@/lib/contentful/restaurants";
import { getPreferredLocale, toLinguiLocale } from "@/lib/contentful/locale";
import { loadCatalog } from "@/lib/i18n";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "alabouf",
  description:
    "On a testé, on a aimé, on partage. Nos restos favoris sur une carte.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/safari-pinned-tab.svg",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contentfulLocale = await getPreferredLocale();
  const linguiLocale = toLinguiLocale(contentfulLocale);
  const [{ items: restaurants }, messages] = await Promise.all([
    getRestaurants(contentfulLocale),
    loadCatalog(linguiLocale),
  ]);

  return (
    <html
      lang={linguiLocale}
      className="m-0 p-0"
    >
      <body className={`${roboto.variable} m-0 p-0 antialiased font-sans`}>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <LinguiClientProvider locale={linguiLocale} messages={messages}>
          <PanelProvider>
            <Map restaurants={restaurants} />
            <PanelWithContent>{children}</PanelWithContent>
          </PanelProvider>
        </LinguiClientProvider>
      </body>
    </html>
  );
}
