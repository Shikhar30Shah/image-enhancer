import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DP Maker",
  description: "Tool to create display pictures for social media platforms.",
  icons: {
    icon: [{
      href: "/dp-logo.png",
      url: "/dp-logo.png",
    }]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head >
        <link href="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module" rel="stylesheet" />
      </head>
      <body
        className={`${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
