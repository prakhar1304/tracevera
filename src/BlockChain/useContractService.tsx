import { ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const CONTRACT_ADDRESS = "0x5cEc471cD8a53895C1DBB5aD59Fb3B48D1ce8921";

// Contract state interface
export interface ContractState {
  government: string;
  inspector: string;
  contractor: string;
  contractorName: string;
  projectName: string;
  projectDetails: string;
  projectBudget: ethers.BigNumber;
}

export const useContractService = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contractState, setContractState] = useState<ContractState | null>(
    null
  );
  const [isGovernment, setIsGovernment] = useState(false);
  const [isInspector, setIsInspector] = useState(false);
  const [isContractor, setIsContractor] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;

    const initProvider = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const signer = web3Provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      setProvider(web3Provider);
      setSigner(signer);
      setContract(contract);

      // Load initial contract state
      await loadContractState(contract, signer);
    };

    initProvider();
  }, []);

  const loadContractState = async (
    contract: ethers.Contract,
    signer: ethers.Signer
  ) => {
    try {
      const address = await signer.getAddress();
      const state: ContractState = {
        government: await contract.government(),
        inspector: await contract.inspector(),
        contractor: await contract.contractor(),
        contractorName: await contract.contractorName(),
        projectName: await contract.projectName(),
        projectDetails: await contract.projectDetails(),
        projectBudget: await contract.projectBudget(),
      };

      setContractState(state);
      setIsGovernment(state.government.toLowerCase() === address.toLowerCase());
      setIsInspector(state.inspector.toLowerCase() === address.toLowerCase());
      setIsContractor(state.contractor.toLowerCase() === address.toLowerCase());
    } catch (error) {
      console.error("Error loading contract state:", error);
    }
  };

  // Government Functions
  const setContractor = async (address: string, name: string) => {
    if (!contract || !isGovernment) return;
    const tx = await contract.setContractor(address, name);
    await tx.wait();
    await loadContractState(contract, signer!);
  };

  const setProjectDetails = async (
    name: string,
    details: string,
    budgetInEther: string
  ) => {
    if (!contract || !isGovernment) return;
    const tx1 = await contract.setProjectName(name);
    await tx1.wait();
    const tx2 = await contract.setProjectDetails(details);
    await tx2.wait();
    const tx3 = await contract.setProjectBudget(
      ethers.utils.parseEther(budgetInEther)
    );
    await tx3.wait();
    await loadContractState(contract, signer!);
  };

  const depositFunds = async (amountInEther: string) => {
    if (!contract || !isGovernment) return;
    const tx = await contract.depositFunds({
      value: ethers.utils.parseEther(amountInEther),
    });
    await tx.wait();
  };

  // Inspector Functions
  const confirmInspection = async () => {
    if (!contract || !isInspector) return;
    const tx = await contract.inspectorWorkDoneConfirmation();
    await tx.wait();
  };

  // Contractor Functions
  const confirmWorkDone = async () => {
    if (!contract || !isContractor) return;
    const tx = await contract.contractorWorkDoneConfirmation();
    await tx.wait();
  };

  // View Functions
  const getContractBalance = async () => {
    if (!contract) return "0";
    const balance = await contract.getContractBalance();
    return ethers.utils.formatEther(balance);
  };

  const getContractorBalance = async () => {
    if (!contract) return "0";
    const balance = await contract.getContractorBalance();
    return ethers.utils.formatEther(balance);
  };

  return {
    contract,
    provider,
    signer,
    contractState,
    isGovernment,
    isInspector,
    isContractor,
    setContractor,
    setProjectDetails,
    depositFunds,
    confirmInspection,
    confirmWorkDone,
    getContractBalance,
    getContractorBalance,
  };
};
