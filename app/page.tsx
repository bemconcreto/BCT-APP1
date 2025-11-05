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

  // 1) Inicializa o Web3Auth no PAI (Next.js)
  useEffect(() => {
    const init = async () => {
      try {
        setInitLoading(true);
        setInitError(null);

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
          web3AuthNetwork: "sapphire_devnet", // Devnet (o seu painel mostrou Devnet/Mainnet)
          privateKeyProvider,
        });

        await w3a.initModal();
        setWeb3auth(w3a);

        // Se já estiver logado, segura o provider e avisa o iframe
        if (w3a.provider) {
          setProvider(w3a.provider);
          postReadyToIframe();
        }

        setInitLoading(false);
      } catch (err: any) {
        console.error("❌ Web3Auth init error:", err);
        const msg =
          String(err?.message || "")
            .toLowerCase()
            .includes("whitelist") || String(err?.message || "").toLowerCase().includes("configuration")
            ? "Domínio não está na Whitelist do Web3Auth. Adicione seu domínio exato no Dashboard → Configuration → Whitelist URLs."
            : "Falha ao iniciar o Web3Auth. Verifique o clientId e a rede (Devnet/Mainnet).";
        setInitError(msg);
        setInitLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Envia sinal para o iframe quando ele estiver carregado
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      // se o usuário já estiver logado, avisa o iframe
      if (provider) postReadyToIframe();
    };

    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [provider]);

  // 3) Função que avisa o front Gemini que o login está OK
  const postReadyToIframe = () => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow) return;
    iframeWindow.postMessage(
      { type: "WEB3AUTH_READY", message: "Usuário autenticado no Web3Auth" },
      "*"
    );
  };

  // 4) Ação do botão de login
  const handleLogin = async () => {
    try {
      if (!web3auth) {
        alert("Autenticação ainda inicializando. Aguarde 2 segundos e tente novamente.");
        return;
      }
      const prov = await web3auth.connect();
      if (prov) {
        setProvider(prov);
        postReadyToIframe(); // avisa o iframe que agora está tudo pronto
      } else {
        alert("Não foi possível obter o provider. Tente novamente.");
      }
    } catch (err) {
      console.error("❌ login error:", err);
      alert("Erro ao fazer login. Veja o console para detalhes.");
    }
  };

  // 5) UI: iframe em tela cheia + botão fixo de login por cima
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

      {/* Botão de login fixo (só aparece se não tiver provider) */}
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
