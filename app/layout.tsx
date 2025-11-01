import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "alabouf"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="m-0 p-0" data-darkreader-mode="dynamic" data-darkreader-scheme="dark">
      <body
        className="m-0 p-0 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
