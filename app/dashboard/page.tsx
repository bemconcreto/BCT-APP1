"use client";

import { useEffect, useRef } from "react";

export default function Dashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log("✅ Front carregado, enviando sinal WEB3AUTH_READY...");
      iframe.contentWindow?.postMessage(
        { type: "WEB3AUTH_READY", message: "Usuário autenticado no Web3Auth" },
        "*"
      );
    };

    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/bct-dashboard.html"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        backgroundColor: "#121212",
      }}
      allow="clipboard-write; fullscreen"
    />
  );
}
