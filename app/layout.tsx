import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Bem Concreto Token (BCT)",
  description: "Plataforma oficial do Bem Concreto Token",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f7fb",
          color: "#333",
        }}
      >
        <header
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "15px 20px",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>🏗️ Bem Concreto Token</span>
          <nav>
            <Link href="/" style={{ color: "white", textDecoration: "none", marginRight: "15px" }}>
              Início
            </Link>
            <Link href="/buy" style={{ color: "white", textDecoration: "none" }}>
              Comprar BCT
            </Link>
          </nav>
        </header>

        <main style={{ padding: "30px", minHeight: "calc(100vh - 70px)" }}>
          {children}
        </main>

        <footer
          style={{
            backgroundColor: "#007bff",
            color: "white",
            textAlign: "center",
            padding: "10px",
          }}
        >
          <small>© {new Date().getFullYear()} Bem Concreto Token</small>
        </footer>
      </body>
    </html>
  );
}
