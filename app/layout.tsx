import "./globals.css";
import React from "react";

export const metadata = {
  title: "Bem Concreto Token",
  description: "Aplicativo oficial do Bem Concreto Token (BCT)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
