import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { PanelProvider } from "./components/PanelContext";
import Map from "./components/Map";
import PanelWithContent from "./components/PanelWithContent";
import { getRestaurants } from "@/lib/contentful/restaurants";

export const metadata: Metadata = {
  title: "alabouf",
  description:
    "On a testé, on a aimé, on partage. Nos restos favoris sur une carte.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { items: restaurants } = await getRestaurants();

  return (
    <html
      lang="en"
      className="m-0 p-0"
      data-darkreader-mode="dynamic"
      data-darkreader-scheme="dark"
    >
      <body className="m-0 p-0 antialiased">
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src="https://umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <PanelProvider>
          <Map restaurants={restaurants} />
          <PanelWithContent>{children}</PanelWithContent>
        </PanelProvider>
      </body>
    </html>
  );
}
