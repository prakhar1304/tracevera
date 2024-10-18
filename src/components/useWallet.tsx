import { useState, useEffect } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        setProvider(provider);

        const signer = provider.getSigner();
        const account = await signer.getAddress();
        setAccount(account);
      } else {
        console.log("MetaMask not detected");
      }
    };

    connectWallet();
  }, []);

  return { provider, account };
};
