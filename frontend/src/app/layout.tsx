import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientStuff from "./ClientStuff";
import Link from "next/link";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "3D Blu Rays",
  description: "A simple app to manage 3D Blu Rays",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.sidebar}>
          <Link href={`/`}>
            <h1>Home</h1>
          </Link>
          <Link href={`/series`}>
            <h1>Series</h1>
          </Link>
          <Link href={`/add`}>
            <h1>Add</h1>
          </Link>
          <Link href={`/ultraHD`}>
            <h1>4K Films</h1>
          </Link>
          <Link href={`/steelbooks`}>
            <h1>Steelbook Films</h1>
          </Link>
          {/* TODO Add other links */}
        </div>
        <ClientStuff>{children}</ClientStuff>
      </body>
    </html>
  );
}
