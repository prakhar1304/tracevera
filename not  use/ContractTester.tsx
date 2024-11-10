// contractContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import ABI from "./web.json";

const CONTRACT_ADDRESS = "0x6EBFC8bc3F21469a09b05A6FC409E9c674aEeE4A";

interface Project {
  id: number;
  name: string;
  details: string;
  contractorName: string;
  contractor: string;
  startingDate: string;
  budget: string;
  isActive: boolean;
  workConfirmed: boolean;
  workApproved: boolean;
  contractorBalance: string;
}

interface ContractContextType {
  // State
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  currentAddress: string;
  projects: Project[];
  contractBalance: string;
  loading: boolean;
  error: string;
  success: string;

  // Contract Functions
  createProject: (
    name: string,
    details: string,
    contractorName: string,
    contractorAddress: string,
    budget: string
  ) => Promise<void>;
  depositFunds: (amount: string) => Promise<void>;
  withdrawFunds: (amount: string) => Promise<void>;
  confirmWork: (projectId: number) => Promise<void>;
  approveWork: (projectId: number) => Promise<void>;
  sendPayment: (projectId: number, amount: string) => Promise<void>;
  refreshData: () => Promise<void>;
  getContractorBalance: (projectId: number) => Promise<string>;
}

const ContractContext = createContext<ContractContextType | null>(null);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    initializeEthers();
  }, []);

  const initializeEthers = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const address = await web3Signer.getAddress();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          ABI,
          web3Signer
        );

        setProvider(web3Provider);
        setSigner(web3Signer);
        setContract(contractInstance);
        setCurrentAddress(address);

        await loadContractData();
        setLoading(false);

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize");
      setLoading(false);
    }
  };

  const loadContractData = async () => {
    if (!contract) return;

    try {
      const balance = await contract.getContractBalance();
      setContractBalance(ethers.utils.formatEther(balance));

      const projectCount = await contract.getProjectCount();
      const projectsData: Project[] = [];

      for (let i = 0; i < projectCount.toNumber(); i++) {
        const project = await contract.getProjectDetails(i);
        const workConfirmed = await contract.contractorWorkDone(
          i,
          project.contractor
        );
        const workApproved = await contract.governmentApproved(
          i,
          project.contractor
        );
        const contractorBalance = await contract.getContractorBalance(i);

        projectsData.push({
          id: i,
          name: project.projectName,
          details: project.projectDetails,
          contractorName: project.contractorName,
          contractor: project.contractor,
          startingDate: new Date(
            project.startingDate.toNumber() * 1000
          ).toLocaleDateString(),
          budget: ethers.utils.formatEther(project.projectBudget),
          isActive: project.isActive,
          workConfirmed,
          workApproved,
          contractorBalance: contractorBalance.toString(),
        });
      }

      setProjects(projectsData);
    } catch (err: any) {
      setError(err.message || "Failed to load contract data");
    }
  };

  const createProject = async (
    name: string,
    details: string,
    contractorName: string,
    contractorAddress: string,
    budget: string
  ) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.createProject(
        name,
        details,
        contractorName,
        contractorAddress,
        ethers.utils.parseEther(budget)
      );
      await tx.wait();
      setSuccess("Project created successfully!");
      await loadContractData();
    } catch (err: any) {
      setError(err.message || "Failed to create project");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const depositFunds = async (amount: string) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.depositFunds({
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      setSuccess("Deposit successful!");
      await loadContractData();
    } catch (err: any) {
      setError(err.message || "Failed to deposit");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const withdrawFunds = async (amount: string) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.withdrawFunds(amount);
      await tx.wait();
      setSuccess("Withdrawal successful!");
      await loadContractData();
    } catch (err: any) {
      setError(err.message || "Failed to withdraw");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmWork = async (projectId: number) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.contractorWorkDoneConfirmation(projectId);
      await tx.wait();
      setSuccess("Work confirmed successfully!");
      await loadContractData();
    } catch (err: any) {
      setError(err.message || "Failed to confirm work");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveWork = async (projectId: number) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.governmentApproveWork(projectId);
      await tx.wait();
      setSuccess("Work approved successfully!");
      await loadContractData();
    } catch (err: any) {
      setError(err.message || "Failed to approve work");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPayment = async (projectId: number, amount: string) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      setLoading(true);
      const tx = await contract.sendFundsToContractor(
        projectId,
        ethers.utils.parseEther(amount)
      );
      await tx.wait();
      setSuccess("Payment sent successfully!");
      await loadContractData();
    } catch (err: any) {
      setError(err.message || "Failed to send payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getContractorBalance = async (projectId: number): Promise<string> => {
    if (!contract) throw new Error("Contract not initialized");
    const balance = await contract.getContractorBalance(projectId);
    return balance.toString();
  };

  const refreshData = async () => {
    await loadContractData();
  };

  const value = {
    provider,
    signer,
    contract,
    currentAddress,
    projects,
    contractBalance,
    loading,
    error,
    success,
    createProject,
    depositFunds,
    withdrawFunds,
    confirmWork,
    approveWork,
    sendPayment,
    refreshData,
    getContractorBalance,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
