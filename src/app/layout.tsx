import type { Metadata } from "next";
import "./globals.css";
import InstallPrompt from "./components/InstallPrompt";
import { IosInstallGuide } from "./components/IosInstallGuide";
import Script from "next/script";

export const metadata: Metadata = {
  title: "HeleMåneden",
  description: "Daglig oversikt over forbruk og trygg bruk",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  icons: {
    apple: "/images/icon-color-192.png",
    icon: [
      { url: "/images/icon-color-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-color-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nb">
      <body>
        {children}

        <InstallPrompt />
        <IosInstallGuide />

        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>

      </body>
    </html>
  );
}
