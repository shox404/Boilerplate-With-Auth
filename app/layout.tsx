import type { Metadata } from "next";
import LayoutProvider from "@/providers/layout-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "App",
  description: "My ultimate app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={'antialiased'}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
