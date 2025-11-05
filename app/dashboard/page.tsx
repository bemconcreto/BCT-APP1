"use client";

import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    // injeta o script do Tailwind + Lucide + lógica principal
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    document.body.appendChild(script);

    const lucide = document.createElement("script");
    lucide.src = "https://unpkg.com/lucide@latest";
    document.body.appendChild(lucide);

    // cria o container onde o conteúdo será renderizado
    const container = document.createElement("div");
    container.innerHTML = `
      <iframe src="/bct-dashboard.html" style="border:none;width:100%;height:100vh;"></iframe>
    `;
    document.body.appendChild(container);

    return () => {
      document.body.removeChild(container);
      document.body.removeChild(script);
      document.body.removeChild(lucide);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#121212",
        color: "white",
        textAlign: "center",
        paddingTop: "20px",
      }}
    >
      <h2>Carregando Bem Concreto Token...</h2>
    </div>
  );
}
