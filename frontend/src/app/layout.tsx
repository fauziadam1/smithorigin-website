import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AlertProvider } from "./components/ui/alert";
import { ConfirmProvider } from "./components/ui/confirm";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Smith Origin Official Website",
    template: "%s | Smith Origin",
  },
  description:
    "Smith Origin adalah website resmi untuk informasi produk, komunitas, dan update terbaru Smith Origin.",
  keywords: [
    "Smith Origin",
    "Gaming Gear",
    "Community",
    "Forum Gaming",
    "Official Website",
    "Smithorigin",
    "SmithOrigin",
    "Smith Origin Official Website"
  ],
  authors: [{ name: "Smith Origin Dev" }],
  creator: "Smith Origin",
  metadataBase: new URL("https://smithorigin.com"),

  icons: {
    icon: "/LogoMain.png",
    apple: "/LogoMain.png",
  },

  openGraph: {
    title: "Smith Origin Official Website",
    description:
      "Website resmi Smith Origin untuk produk, komunitas, dan informasi terbaru.",
    url: "https://smithorigin.com",
    siteName: "Smith Origin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smith Origin",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Smith Origin Official Website",
    description:
      "Website resmi Smith Origin untuk produk dan komunitas gaming.",
    images: ["/ogimage.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} scroll-smooth`}>
      <body>
        <AlertProvider>
          <ConfirmProvider>{children}</ConfirmProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
