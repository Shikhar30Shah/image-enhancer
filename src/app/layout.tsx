import type { Metadata } from "next";
import { Raleway, Bitcount_Prop_Single } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

const bitcountPropSingle = Bitcount_Prop_Single({
  variable: "--font-bitcount-prop-single",
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
      <body
        className={`${raleway.variable} ${bitcountPropSingle.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
