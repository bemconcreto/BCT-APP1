"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
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
          clientId: "BIwYJojwNhLFJ0-IqacUDTW1U6hoGoJrEz6KdgvokTwlUGtXaT6jdtK7lik7lJVlgz6HuSRDIn5Vh-_oOyVqvaE",
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        await w3a.initModal();
        console.log("✅ Web3Auth inicializado com sucesso.");
        setWeb3auth(w3a);

        if (w3a.provider) setProvider(w3a.provider);
      } catch (e: any) {
        console.error("❌ Erro ao inicializar Web3Auth:", e);
        setErrorMsg(
          e?.message?.includes("whitelist")
            ? "Domínio não está na Whitelist. Adicione no painel Web3Auth."
            : "Falha ao inicializar o Web3Auth."
        );
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return alert("Web3Auth ainda não inicializado");
    try {
      const prov = await web3auth.connect();
      if (prov) {
        console.log("✅ Login realizado com sucesso!");
        setProvider(prov);
      }
    } catch (e) {
      console.error("❌ Erro no login:", e);
      alert("Erro ao conectar. Tente novamente.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "white",
        fontFamily: "Montserrat, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: 20 }}>
        Bem Concreto Token (BCT)
      </h1>

      {loading ? (
        <p>Carregando Web3Auth...</p>
      ) : errorMsg ? (
        <p style={{ color: "#ff6666" }}>{errorMsg}</p>
      ) : !provider ? (
        <button
          onClick={login}
          style={{
            background: "linear-gradient(145deg, #FFD700 0%, #C4A116 100%)",
            color: "#121212",
            fontWeight: "bold",
            padding: "12px 20px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(255,215,0,0.4)",
          }}
        >
          Entrar com Web3Auth
        </button>
      ) : (
        <>
          <p style={{ marginBottom: 12 }}>✅ Conectado com sucesso!</p>
          <iframe
            src="/bct-dashboard.html"
            style={{
              width: "100%",
              height: "90vh",
              border: "none",
              backgroundColor: "#121212",
            }}
          />
        </>
      )}
    </div>
  );
}
