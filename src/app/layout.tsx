import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/shared/app-layout";
import { CommandPalette } from "@/components/shared/command-palette";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ascension OS",
  description: "Level up your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-bg-primary text-text-primary antialiased`}>
        <AppLayout>
          {children}
        </AppLayout>
        <CommandPalette />
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
