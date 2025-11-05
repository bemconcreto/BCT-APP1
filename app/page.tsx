"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import Web3 from "web3";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(true);

  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;
  const rpcUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC!;

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig: {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0x89",
              rpcTarget: rpcUrl,
            },
          },
        });

        const w3a = new Web3Auth({
          clientId,
          web3AuthNetwork: "sapphire_mainnet",
          privateKeyProvider,
        });

        await w3a.initModal();
        setWeb3auth(w3a);

        if (w3a.provider) {
          setProvider(w3a.provider);
          await fetchUserData(w3a.provider);
        }
      } catch (e) {
        console.error("❌ Erro ao inicializar Web3Auth:", e);
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
        setProvider(prov);
        await fetchUserData(prov);
      }
    } catch (e) {
      console.error("❌ Erro no login:", e);
    }
  };

  const fetchUserData = async (prov: IProvider) => {
    const web3 = new Web3(prov as any);
    const accounts = await web3.eth.getAccounts();
    const addr = accounts[0];
    setAddress(addr);

    const bal = await web3.eth.getBalance(addr);
    setBalance(web3.utils.fromWei(bal, "ether"));
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
        <p>⏳ Carregando...</p>
      ) : !provider ? (
        <button
          onClick={login}
          style={{
            background: "linear-gradient(145deg, #FFD700 0%, #C4A116 100%)",
            color: "#121212",
            padding: "12px 20px",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
          }}
        >
          Entrar com Web3Auth
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>✅ Autenticado com sucesso!</p>
          <p>
            <b>Endereço:</b> {address}
          </p>
          <p>
            <b>Saldo (MATIC):</b> {balance}
          </p>
        </div>
      )}
    </div>
  );
}
