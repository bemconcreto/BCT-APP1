"use client";

import { useEffect, useRef, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

export default function Dashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // 1️⃣ Inicializa o Web3Auth ao montar a página
  useEffect(() => {
    const init = async () => {
      try {
        setInitLoading(true);
        setInitError(null);

        console.log("🟡 Inicializando Web3Auth...");

        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0x89", // Polygon Mainnet
              rpcTarget: "https://polygon-rpc.com",
            },
          },
        });

        const w3a = new Web3Auth({
          clientId:
            "BIwYJojwNhLFJ0-IqacUDTW1U6hoGoJrEz6KdgvokTwlUGtXaT6jdtK7lik7lJVlgz6HuSRDIn5Vh-_oOyVqvaE",
          web3AuthNetwork: "sapphire_devnet", // Devnet conforme seu painel
          privateKeyProvider,
        });

        await w3a.initModal();
        console.log("✅ Web3Auth inicializado com sucesso.");

        setWeb3auth(w3a);

        if (w3a.provider) {
          setProvider(w3a.provider);
          postReadyToIframe();
        }

        setInitLoading(false);
      } catch (err: any) {
        console.error("❌ Erro ao inicializar Web3Auth:", err);
        const msg =
          String(err?.message || "")
            .toLowerCase()
            .includes("whitelist") ||
          String(err?.message || "").toLowerCase().includes("configuration")
            ? "Domínio não está na Whitelist do Web3Auth. Adicione o domínio do app no painel e salve."
            : "Falha ao iniciar o Web3Auth. Verifique o clientId e a rede (Devnet/Mainnet).";
        setInitError(msg);
        setInitLoading(false);
      }
    };

    init();
  }, []);

  // 2️⃣ Envia sinal ao iframe quando carregado
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      console.log("📨 Iframe carregado.");
      if (provider) postReadyToIframe();
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [provider]);

  // 3️⃣ Função para avisar o front Gemini que o login está OK
  const postReadyToIframe = () => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;
    iframeWindow.postMessage(
      { type: "WEB3AUTH_READY", message: "Usuário autenticado no Web3Auth" },
      "*"
    );
  };

  // 4️⃣ Função de login com espera garantida
  const handleLogin = async () => {
    try {
      // Aguarda até 5 segundos o Web3Auth estar pronto
      if (!web3auth) {
        console.warn("⏳ Aguardando Web3Auth ficar pronto...");
        for (let i = 0; i < 10; i++) {
          await new Promise((r) => setTimeout(r, 500));
          if (web3auth) break;
        }
      }

      if (!web3auth) {
        alert(
          "O Web3Auth ainda está inicializando. Aguarde alguns segundos e tente novamente."
        );
        return;
      }

      console.log("🚀 Abrindo modal de login do Web3Auth...");
      const prov = await web3auth.connect();

      if (prov) {
        console.log("✅ Login concluído!");
        setProvider(prov);
        postReadyToIframe();
      } else {
        alert("Não foi possível conectar ao Web3Auth. Tente novamente.");
      }
    } catch (err) {
      console.error("❌ Erro ao fazer login:", err);
      alert("Falha ao autenticar. Veja o console para detalhes.");
    }
  };

  // 5️⃣ Interface
  return (
    <>
      {/* IFRAME do Front Gemini - cobre a tela toda */}
      <iframe
        ref={iframeRef}
        src="/bct-dashboard.html"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          border: "none",
          backgroundColor: "#121212",
        }}
        allow="clipboard-write; fullscreen"
      />

      {/* BOTÃO DE LOGIN */}
      {!provider && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "flex-end",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {initError ? (
            <div
              style={{
                background: "#2a2a2a",
                border: "1px solid #DD5555",
                color: "#FFCCCC",
                padding: "10px 12px",
                borderRadius: 10,
                maxWidth: 320,
                fontSize: 13,
              }}
            >
              <b>Erro na autenticação</b>
              <div style={{ marginTop: 6 }}>{initError}</div>
            </div>
          ) : initLoading ? (
            <div
              style={{
                background: "#2a2a2a",
                color: "#CCCCCC",
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 13,
              }}
            >
              Inicializando Web3Auth…
            </div>
          ) : (
            <button
              onClick={handleLogin}
              style={{
                background: "linear-gradient(145deg, #FFD700 0%, #C4A116 100%)",
                color: "#121212",
                padding: "12px 18px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 6px 18px rgba(255, 215, 0, 0.35)",
                cursor: "pointer",
                border: "none",
              }}
            >
              Entrar com Web3Auth
            </button>
          )}
        </div>
      )}
    </>
  );
}
