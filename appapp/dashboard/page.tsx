"use client";

import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = "/bct-dashboard.html";
    iframe.style.width = "100%";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.display = "block";
    iframe.style.overflow = "hidden";
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
      <h2 style={{ marginBottom: "1rem" }}>Carregando Bem Concreto Token...</h2>
      <p style={{ fontSize: "0.9rem", color: "#888" }}>Aguarde um momento</p>
    </div>
  );
}
