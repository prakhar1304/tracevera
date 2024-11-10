import React, { createContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import ABI from "./contractABI.json";

// Define the types for the context value
interface Web3ContextType {
  account: string | null;
  balance: string;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
}

// Create a context with an initial empty value
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<string>("0");

  // Smart Contract Address (Polygon Testnet)
  const contractAddress = "0xA4946B1FB975De5a490db695A689489aB2feBDab";
  const contractABI = ABI;

  // Connect to MetaMask and initialize contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);

      const accounts = await _provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = _provider.getSigner();
      const _contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setContract(_contract);

      const _balance = await _provider.getBalance(accounts[0]);
      setBalance(ethers.utils.formatEther(_balance));
    } else {
      alert("Please install MetaMask");
    }
  };

  // Load initial data (can be expanded as needed)
  useEffect(() => {
    if (contract) {
      // Additional loading logic if needed
    }
  }, [contract]);

  return (
    <Web3Context.Provider value={{ account, balance, contract, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;

// import React, { createContext, useState, useEffect, ReactNode } from "react";
// import { ethers } from "ethers";
// import contractABI from "./contractABI.json";

// interface Web3ContextType {
//   account: string | null;
//   balance: string;
//   contract: ethers.Contract | null;
//   connectWallet: () => Promise<void>;
//   isConnected: boolean;
// }

// export const Web3Context = createContext<Web3ContextType>({
//   account: null,
//   balance: "0",
//   contract: null,
//   connectWallet: async () => {},
//   isConnected: false,
// });

// interface Web3ProviderProps {
//   children: ReactNode;
// }

// export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
//   const [account, setAccount] = useState<string | null>(null);
//   const [contract, setContract] = useState<ethers.Contract | null>(null);
//   const [balance, setBalance] = useState<string>("0");
//   const [isConnected, setIsConnected] = useState<boolean>(false);

//   const contractAddress = "0xA4946B1FB975De5a490db695A689489aB2feBDab";

//   const connectWallet = async () => {
//     try {
//       if (window.ethereum) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const accounts = await provider.send("eth_requestAccounts", []);
//         const signer = provider.getSigner();

//         const _contract = new ethers.Contract(
//           contractAddress,
//           contractABI,
//           signer
//         );

//         const _balance = await provider.getBalance(accounts[0]);

//         setAccount(accounts[0]);
//         setContract(_contract);
//         setBalance(ethers.utils.formatEther(_balance));
//         setIsConnected(true);
//       } else {
//         throw new Error("Please install MetaMask");
//       }
//     } catch (error) {
//       console.error("Error connecting wallet:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     // Check if already connected
//     if (window.ethereum) {
//       window.ethereum.on("accountsChanged", (accounts: string[]) => {
//         if (accounts.length > 0) {
//           setAccount(accounts[0]);
//         } else {
//           setAccount(null);
//           setIsConnected(false);
//         }
//       });
//     }
//   }, []);

//   return (
//     <Web3Context.Provider
//       value={{
//         account,
//         balance,
//         contract,
//         connectWallet,
//         isConnected,
//       }}
//     >
//       {children}
//     </Web3Context.Provider>
//   );
// };
