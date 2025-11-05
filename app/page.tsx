"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { useRouter } from "next/navigation";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

        const web3authInstance = new Web3Auth({
          clientId:
            "BIwYJojwNhLFJ0-IqacUDTW1U6hoGoJrEz6KdgvokTwlUGtXaT6jdtK7lik7lJVlgz6HuSRDIn5Vh-_oOyVqvaE",
          web3AuthNetwork: "testnet",
          privateKeyProvider,
        });

        await web3authInstance.initModal();
        console.log("✅ Web3Auth inicializado");
        setWeb3auth(web3authInstance);
        setLoading(false);

        if (web3authInstance.provider) {
          console.log("🔐 Usuário já logado, redirecionando...");
          setProvider(web3authInstance.provider);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("❌ Erro ao iniciar Web3Auth:", error);
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const login = async () => {
    if (!web3auth) {
      alert("Carregando Web3Auth... tente novamente em 2 segundos.");
      return;
    }

    try {
      console.log("🔵 Abrindo modal de login...");
      const provider = await web3auth.connect();
      console.log("✅ Login realizado com sucesso!");
      setProvider(provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Erro no login:", error);
      alert("Falha no login. Tente novamente.");
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          marginBottom: "2rem",
          color: "#FFD700",
          textAlign: "center",
        }}
      >
        Bem Concreto Token (BCT)
      </h1>

      {loading ? (
        <p style={{ color: "#999" }}>Inicializando autenticação...</p>
      ) : (
        <button
          onClick={login}
          style={{
            background: "linear-gradient(145deg, #FFD700 0%, #C4A116 100%)",
            color: "#121212",
            padding: "1rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: "700",
            fontSize: "1rem",
            boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.3s ease",
          }}
          onMouseOver={(e) => {
            (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 6px 20px rgba(255, 215, 0, 0.5)";
          }}
          onMouseOut={(e) => {
            (e.target as HTMLButtonElement).style.transform = "translateY(0)";
            (e.target as HTMLButtonElement).style.boxShadow =
              "0 4px 15px rgba(255, 215, 0, 0.3)";
          }}
        >
          Entrar com Web3Auth
        </button>
      )}
    </main>
  );
}
