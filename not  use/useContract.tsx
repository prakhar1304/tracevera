import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import BlockShareABI from "./BlockShareAbi.json";

// ABI of the smart contract (replace this with the actual ABI)
const contractABI = BlockShareABI;

const contractAddress = "0xDEA2dbD6A2AAfe25b18585709fa3D38cdC7F3A5C"; // Replace with your deployed contract address

interface ContractContextProps {
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  registerUser: (name: string) => Promise<void>;
  registerIssuer: (name: string) => Promise<void>;
  issueCertificate: (
    userAddr: string,
    uuid: string,
    hashValue: string,
    ipfsUrl: string
  ) => Promise<void>;
  invalidateCertificate: (uuid: string) => Promise<void>;
  getProfile: () => Promise<any>;
  getCertificate: (uuid: string) => Promise<any>;
}

const ContractContext = createContext<ContractContextProps | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      // Check for the window.ethereum and initialize the provider
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);
      }
    };
    init();
  }, []);

  const registerUser = async (name: string) => {
    if (contract) {
      const tx = await contract.registerUser(name);
      await tx.wait();
    }
  };

  const registerIssuer = async (name: string) => {
    if (contract) {
      const tx = await contract.registerIssuer(name);
      await tx.wait();
    }
  };

  const issueCertificate = async (
    userAddr: string,
    uuid: string,
    hashValue: string,
    ipfsUrl: string
  ) => {
    if (contract) {
      const tx = await contract.issueCertificate(
        userAddr,
        uuid,
        hashValue,
        ipfsUrl
      );
      await tx.wait();
    }
  };

  const invalidateCertificate = async (uuid: string) => {
    if (contract) {
      const tx = await contract.invalidateCertificate(uuid);
      await tx.wait();
    }
  };

  const getProfile = async () => {
    if (contract) {
      const profile = await contract.getProfile();
      return profile;
    }
  };

  const getCertificate = async (uuid: string) => {
    if (contract) {
      const certificate = await contract.getCertificate(uuid);
      return certificate;
    }
  };

  return (
    <ContractContext.Provider
      value={{
        signer,
        contract,
        registerUser,
        registerIssuer,
        issueCertificate,
        invalidateCertificate,
        getProfile,
        getCertificate,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
