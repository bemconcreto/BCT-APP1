"use client";

import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    console.log("🟡 Iniciando carregamento do front Gemini...");

    // Cria o iframe principal
    const iframe = document.createElement("iframe");
    iframe.src = "/bct-dashboard.html";
    iframe.style.position = "fixed";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.zIndex = "9999";
    iframe.style.backgroundColor = "#121212";
    iframe.allow = "clipboard-write; fullscreen;";

    iframe.onload = () => {
      console.log("✅ Front Gemini carregado. Enviando sinal WEB3AUTH_READY...");
      iframe.contentWindow?.postMessage(
        { type: "WEB3AUTH_READY", message: "Usuário autenticado no Web3Auth" },
        "*"
      );
    };

    document.body.appendChild(iframe);

    return () => {
      console.log("🧹 Limpando iframe...");
      document.body.removeChild(iframe);
    };
  }, []);

  // Não renderiza nada no React, só o iframe cobre a tela
  return null;
}
