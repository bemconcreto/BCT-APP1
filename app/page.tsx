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
  const [initError, setInitError] = useState<string | null>(null);
  const router = useRouter();

  // tenta iniciar, e se falhar por whitelist mostra o motivo
  const initWeb3Auth = async () => {
    try {
      setLoading(true);
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

      const instance = new Web3Auth({
        clientId:
          "BIeIO0GBl1lBAmFNLr1vUx5mp1iwNOz5B-plE8T8IOCpwm2fmEJPNp-L7qZXc-3X9rGaVsStf4Nq2oCJ-Tf1oW4",
        web3AuthNetwork: "sapphire_devnet",
        privateKeyProvider,
      });

      await instance.initModal();
      setWeb3auth(instance);
      setLoading(false);

      if (instance.provider) {
        setProvider(instance.provider);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("❌ initModal error:", err);
      // Mensagens mais claras para os casos comuns
      const msg =
        String(err?.message || "")
          .toLowerCase()
          .includes("configuration")
          || String(err?.message || "")
            .toLowerCase()
            .includes("whitelist")
          ? "Domínio não está na Whitelist do Web3Auth. Adicione o domínio atual no painel e salve."
          : "Falha ao iniciar o Web3Auth. Verifique o clientId e a rede.";
      setInitError(msg);
      setLoading(false);
      setWeb3auth(null);
    }
  };

  useEffect(() => {
    initWeb3Auth();
    // opcional: uma segunda tentativa automática depois de 2s
    const t = setTimeout(() => {
      if (!web3auth && !provider) initWeb3Auth();
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    if (!web3auth) {
      alert("Autenticação ainda carregando. Ajuste a whitelist no Web3Auth e recarregue a página.");
      return;
    }
    try {
      const prov = await web3auth.connect();
      setProvider(prov);
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ login error:", err);
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
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1rem",
          color: "#FFD700",
        }}
      >
        Bem Concreto Token (BCT)
      </h1>

      {loading ? (
        <p style={{ color: "#aaa" }}>Inicializando autenticação…</p>
      ) : (
        <>
          {initError && (
            <div
              style={{
                background: "#2a2a2a",
                border: "1px solid #DD5555",
                color: "#FFCCCC",
                padding: "12px 16px",
                borderRadius: 8,
                marginBottom: 16,
                maxWidth: 560,
              }}
            >
              <b>Erro na inicialização:</b> {initError}
              <div style={{ marginTop: 8, fontSize: 13, color: "#bbb" }}>
                Certifique-se de adicionar: <br />
                <code>https://bct-app-1-e4gbp0ql6-bem-concretos-projects.vercel.app</code>
                <br />
                em <i>Configuration → Whitelist URLs</i> no painel do Web3Auth.
              </div>
            </div>
          )}

          <button
            onClick={login}
            disabled={!web3auth}
            style={{
              background: "linear-gradient(145deg, #FFD700 0%, #C4A116 100%)",
              color: "#121212",
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "1rem",
              boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
              cursor: web3auth ? "pointer" : "not-allowed",
              opacity: web3auth ? 1 : 0.5,
            }}
          >
            Entrar com Web3Auth
          </button>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={initWeb3Auth}
              style={{
                background: "transparent",
                border: "1px solid #444",
                color: "#ccc",
                padding: "8px 12px",
                borderRadius: 8,
                fontSize: 14,
              }}
            >
              Recarregar autenticação
            </button>
          </div>
        </>
      )}
    </main>
  );
}
