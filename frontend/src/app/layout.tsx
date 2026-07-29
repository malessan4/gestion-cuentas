import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Core Bancario",
  description: "Dashboard para gestión de cuentas bancarias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
