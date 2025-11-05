"use client";

import React, { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3authInstance = new Web3Auth({
          clientId: "BIwYJojwNhLFJ0-IqacUDTW1U6hoGoJrEz6KdgvokTwlUGtXaT6jdtK7lik7lJVlgz6HuSRDIn5Vh-_oOyVqvaE",
          web3AuthNetwork: "testnet",
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x89", // Polygon mainnet
            rpcTarget: "https://polygon-rpc.com",
          },
        });

        setWeb3auth(web3authInstance);
        await web3authInstance.initModal();
        setProvider(web3authInstance.provider);
      } catch (error) {
        console.error("Erro ao iniciar Web3Auth:", error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f8f8",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Bem Concreto Token</h1>
      {!provider ? (
        <button
          onClick={login}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Entrar com Web3Auth
        </button>
      ) : (
        <h3>✅ Login realizado com sucesso!</h3>
      )}
    </div>
  );
}
