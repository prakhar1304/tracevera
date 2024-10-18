import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractABI from "./contractABI.json";

// Define your contract address here
const CONTRACT_ADDRESS = "0x5cEc471cD8a53895C1DBB5aD59Fb3B48D1ce8921";

// Contract state interface
interface ContractState {
  government: string;
  inspector: string;
  contractor: string;
  contractorName: string;
  projectName: string;
  projectDetails: string;
  projectBudget: ethers.BigNumber;
}

const SecondaryContractComponent: React.FC = () => {
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
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [contractorBalance, setContractorBalance] = useState<string>("0");

  // Initialize contract and provider
  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum) return;

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

    initContract();
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

      // Load balances
      await updateBalances(contract);
    } catch (error) {
      console.error("Error loading contract state:", error);
    }
  };

  const updateBalances = async (contract: ethers.Contract) => {
    if (!contract) return;
    const contractBalance = await contract.getContractBalance();
    const contractorBalance = await contract.getContractorBalance();

    setContractBalance(ethers.utils.formatEther(contractBalance));
    setContractorBalance(ethers.utils.formatEther(contractorBalance));
  };

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
    await updateBalances(contract);
  };

  const withdrawFunds = async (amountInEther: string) => {
    if (!contract || !isGovernment) return;
    const tx = await contract.withdrawFunds(
      ethers.utils.parseEther(amountInEther)
    );
    await tx.wait();
    await updateBalances(contract);
  };

  const sendFundsToContractor = async (amountInEther: string) => {
    if (!contract || !isGovernment) return;
    const tx = await contract.sendFundsToContractor(
      ethers.utils.parseEther(amountInEther)
    );
    await tx.wait();
    await updateBalances(contract);
  };

  const confirmInspection = async () => {
    if (!contract || !isInspector) return;
    const tx = await contract.inspectorWorkDoneConfirmation();
    await tx.wait();
  };

  const confirmWorkDone = async () => {
    if (!contract || !isContractor) return;
    const tx = await contract.contractorWorkDoneConfirmation();
    await tx.wait();
  };

  return (
    <div>
      <h2>Contractor Dashboard</h2>

      {/* Example UI elements for interaction */}
      <button
        onClick={() => setContractor("0xContractorAddress", "Contractor Name")}
      >
        Set Contractor
      </button>

      <button
        onClick={() =>
          setProjectDetails("ProjectName", "ProjectDetails", "ProjectBudget")
        }
      >
        Set Project Details
      </button>

      <button onClick={() => depositFunds("1")}>Deposit 1 ETH</button>
      <button onClick={() => withdrawFunds("1")}>Withdraw 1 ETH</button>
      <button onClick={() => sendFundsToContractor("1")}>
        Send 1 ETH to Contractor
      </button>

      {isInspector && (
        <button onClick={confirmInspection}>Confirm Inspection</button>
      )}
      {isContractor && (
        <button onClick={confirmWorkDone}>Confirm Work Done</button>
      )}

      <div>
        <h3>Contract State:</h3>
        <pre>{JSON.stringify(contractState, null, 2)}</pre>
      </div>

      <div>
        <h3>Balances:</h3>
        <p>Contract Balance: {contractBalance} ETH</p>
        <p>Contractor Balance: {contractorBalance} ETH</p>
      </div>
    </div>
  );
};

export default SecondaryContractComponent;
