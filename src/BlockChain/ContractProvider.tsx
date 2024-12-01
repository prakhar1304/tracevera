import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";

// Define types for better type safety
interface ProjectDetails {
  id: number;
  name: string;
  details: string;
  contractorName: string;
  contractor: string;
  startingDate: string;
  budget: ethers.BigNumber;
  isActive: boolean;
}

interface Transaction {
  recipient: string;
  recipientName: string;
  amount: ethers.BigNumber;
  transactionType: number;
  timestamp: ethers.BigNumber;
}

// Add this at the top of your file or in a separate type declarations file
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request?: (request: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (
      event: string,
      callback: (...args: any[]) => void
    ) => void;
  };
}

interface ContractContextType {
  // Blockchain connection states
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contract: Contract | null;
  address: string;

  // Application states
  loading: boolean;
  error: string | null;

  // Wallet management
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;

  // Contract interaction methods
  createProject: (
    name: string,
    details: string,
    contractorName: string,
    contractorAddress: string,
    budgetInEther: string
  ) => Promise<void>;

  depositFunds: (amountInEther: string) => Promise<void>;
  withdrawFunds: (amountInEther: string) => Promise<void>;

  // Project-specific methods
  getProjectDetails: (projectId: number) => Promise<ProjectDetails>;
  getAllProjects: () => Promise<ProjectDetails[]>;
  getProjectTransactions: (projectId: number) => Promise<Transaction[]>;

  // Financial methods
  getContractBalance: () => Promise<string>;
  getContractBalanceInWei: () => Promise<ethers.BigNumber>;
  sendFundsToContractor: (
    projectId: number,
    amountInEther: string
  ) => Promise<void>;
  sendMoneyToLabor: (
    projectId: number,
    laborName: string,
    laborAddress: string,
    amountInEther: string
  ) => Promise<void>;
  sendMoneyToMaterialSupplier: (
    projectId: number,
    materialName: string,
    supplierAddress: string,
    amountInEther: string
  ) => Promise<void>;

  // Work approval methods
  confirmContractorWork: (projectId: number) => Promise<void>;
  governmentApproveWork: (projectId: number) => Promise<void>;
}

// Utility functions for balance handling
const formatEther = (balance: ethers.BigNumber): string => {
  return ethers.utils.formatEther(balance);
};

const parseEther = (amount: string): ethers.BigNumber => {
  return ethers.utils.parseEther(amount);
};

// Contract address (replace with your deployed contract address)
const CONTRACT_ADDRESS = "0x0f20A4036a0fdfEcfCC7444B31eE76240772e2C5";

// ABI import (ensure the path is correct)
import ABI from "./web.json";

const ContractContext = createContext<ContractContextType | null>(null);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Wallet Connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected");
      return;
    }

    try {
      setLoading(true);
      // Request account access
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const web3Provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const web3Signer = web3Provider.getSigner();
      const userAddress = await web3Signer.getAddress();

      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        web3Signer
      );

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setAddress(userAddress);
    } catch (err: any) {
      setError(err.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAddress("");
  };

  // Create Project
  const createProject = async (
    name: string,
    details: string,
    contractorName: string,
    contractorAddress: string,
    budgetInEther: string
  ) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.createProject(
        name,
        details,
        contractorName,
        contractorAddress,
        parseEther(budgetInEther)
      );
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Project creation failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get Contract Balance (in Ether)
  const getContractBalance = async (): Promise<string> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      // Use provider instead of contract method to get balance
      const balance = await provider?.getBalance(CONTRACT_ADDRESS);

      if (!balance) throw new Error("Could not fetch balance");

      console.log("balance in eth ", formatEther(balance));
      // console.log("balance in wei:", balance);
      return formatEther(balance);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contract balance");
      throw err;
    }
  };

  // Get Contract Balance (in Wei)
  const getContractBalanceInWei = async (): Promise<ethers.BigNumber> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      return await contract.getContractBalance();
    } catch (err: any) {
      setError(err.message || "Failed to fetch contract balance");
      throw err;
    }
  };

  // Deposit Funds
  const depositFunds = async (amountInEther: string) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.depositFunds({
        value: parseEther(amountInEther),
      });
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Deposit failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Withdraw Funds
  const withdrawFunds = async (amountInEther: string) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.withdrawFunds(parseEther(amountInEther));
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Withdrawal failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get Project Details
  const getProjectDetails = async (
    projectId: number
  ): Promise<ProjectDetails> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const project = await contract.getProjectDetails(projectId);
      return {
        id: projectId,
        name: project.projectName,
        details: project.projectDetails,
        contractorName: project.contractorName,
        contractor: project.contractor,
        startingDate: new Date(
          project.startingDate.toNumber() * 1000
        ).toLocaleDateString(),
        budget: project.projectBudget,
        isActive: project.isActive,
      };
    } catch (err: any) {
      setError(err.message || "Failed to fetch project details");
      throw err;
    }
  };

  // Get All Projects
  const getAllProjects = async (): Promise<ProjectDetails[]> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const projectCount = await contract.getProjectCount();
      const projects: ProjectDetails[] = [];

      for (let i = 0; i < projectCount.toNumber(); i++) {
        const project = await getProjectDetails(i);
        projects.push(project);
      }

      return projects;
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
      throw err;
    }
  };

  // Get Project Transactions
  const getProjectTransactions = async (
    projectId: number
  ): Promise<Transaction[]> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      return await contract.getProjectTransactions(projectId);
    } catch (err: any) {
      setError(err.message || "Failed to fetch project transactions");
      throw err;
    }
  };

  // Send Funds to Contractor
  const sendFundsToContractor = async (
    projectId: number,
    amountInEther: string
  ) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      console.log(amountInEther);
      const tx = await contract.sendFundsToContractor(
        projectId,
        parseEther(amountInEther)
      );
      console.log(parseEther(amountInEther));
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Failed to send funds to contractor");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send Money to Labor
  const sendMoneyToLabor = async (
    projectId: number,
    laborName: string,
    laborAddress: string,
    amountInEther: string
  ) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      console.log(amountInEther);
      console.log("check 2", parseEther(amountInEther));

      const gasLimit = 500000;

      const tx = await contract.sendMoneyToLabor(
        projectId,
        laborName,
        laborAddress,
        parseEther(amountInEther),
        { gasLimit: gasLimit }
      );
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Failed to send money to labor");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send Money to Material Supplier
  const sendMoneyToMaterialSupplier = async (
    projectId: number,
    materialName: string,
    supplierAddress: string,
    amountInEther: string
  ) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.sendMoneyToMaterialSupplier(
        projectId,
        materialName,
        supplierAddress,
        parseEther(amountInEther)
      );
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Failed to send money to material supplier");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Confirm Contractor Work
  const confirmContractorWork = async (projectId: number) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.contractorWorkDoneConfirmation(projectId);
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Failed to confirm contractor work");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Government Approve Work
  const governmentApproveWork = async (projectId: number) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.governmentApproveWork(projectId);
      await tx.wait();
    } catch (err: any) {
      setError(err.message || "Failed to approve work");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Event listener for wallet changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        connectWallet();
      }
    };

    if (window.ethereum) {
      (window as any).ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  const contextValue: ContractContextType = {
    provider,
    signer,
    contract,
    address,
    loading,
    error,

    connectWallet,
    disconnectWallet,

    createProject,
    depositFunds,
    withdrawFunds,

    getProjectDetails,
    getAllProjects,
    getProjectTransactions,

    getContractBalance,
    getContractBalanceInWei,
    sendFundsToContractor,
    sendMoneyToLabor,
    sendMoneyToMaterialSupplier,

    confirmContractorWork,
    governmentApproveWork,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook for using the contract context
export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error(
      "useContractContext must be used within a ContractProvider"
    );
  }
  return context;
};

export default ContractContext;
