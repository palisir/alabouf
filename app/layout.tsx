import type { Metadata } from "next";
import "./globals.css";
import MenuWithContent from "./components/MenuWithContent";

export const metadata: Metadata = {
  title: "alabouf",
  description:
    "On a testé, on a aimé, on partage. Nos restos favoris sur une carte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="m-0 p-0"
      data-darkreader-mode="dynamic"
      data-darkreader-scheme="dark"
    >
      <body className="m-0 p-0 antialiased">
        <MenuWithContent>{children}</MenuWithContent>
      </body>
    </html>
  );
}
