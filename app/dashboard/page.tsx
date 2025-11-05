"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cria o iframe para carregar o front-end Gemini
    const iframe = document.createElement("iframe");
    iframe.src = "/bct-dashboard.html";
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.overflow = "hidden";

    // Quando o front terminar de carregar, atualiza o estado
    iframe.onload = () => {
      setIsLoaded(true);

      // Envia um sinal para o front dentro do iframe
      iframe.contentWindow?.postMessage(
        { type: "WEB3AUTH_READY", message: "Usuário autenticado no Web3Auth" },
        "*"
      );
    };

    document.body.appendChild(iframe);

    return () => {
      document.body.removeChild(iframe);
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#FFD700",
        fontFamily: "Montserrat, sans-serif",
        flexDirection: "column",
      }}
    >
      {isLoaded ? (
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>
          ✅ Interface carregada. Você já está autenticado.
        </p>
      ) : (
        <>
          <h2 style={{ marginBottom: "1rem" }}>
            CARREGANDO BEM CONCRETO TOKEN...
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#888" }}>
            Aguardando inicialização segura do painel
          </p>
        </>
      )}
    </div>
  );
}
