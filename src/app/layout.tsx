import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skip",
  description: "an indie game with frogs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Skip</title>
        <link
          rel="stylesheet"
          href="https://use.typekit.net/dlv5kjy.css"
        ></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
