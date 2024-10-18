import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./abi.json"; // Replace with your actual ABI JSON file

const CONTRACT_ADDRESS = "0x5cEc471cD8a53895C1DBB5aD59Fb3B48D1ce8921"; // Replace with your contract address

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

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
    };

    initProvider();
  }, []);

  return { contract, provider, signer };
};

export const SecondaryContract = () => {
  const { contract } = useContract();
  const [projectName, setProjectName] = useState("");
  const [contractorBalance, setContractorBalance] = useState<number | null>(
    null
  );

  const setProjectNameHandler = async (name: string) => {
    if (!contract) return;
    try {
      const tx = await contract.setProjectName(name);
      await tx.wait();
      console.log("Project name set successfully:", name);
    } catch (error) {
      console.error("Error setting project name:", error);
    }
  };

  const getContractorBalanceHandler = async () => {
    if (!contract) return;
    try {
      const balance = await contract.getContractorBalance();
      setContractorBalance(parseFloat(ethers.utils.formatEther(balance)));
    } catch (error) {
      console.error("Error getting contractor balance:", error);
    }
  };

  const depositFundsHandler = async (amountInEther: string) => {
    if (!contract || !provider) return;
    try {
      const tx = await contract.depositFunds({
        value: ethers.utils.parseEther(amountInEther),
      });
      await tx.wait();
      console.log("Funds deposited:", amountInEther);
    } catch (error) {
      console.error("Error depositing funds:", error);
    }
  };

  return (
    <div>
      <h2>Secondary Contract Interactions</h2>

      <div>
        <h3>Set Project Name</h3>
        <input
          type="text"
          placeholder="Enter Project Name"
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button onClick={() => setProjectNameHandler(projectName)}>
          Set Name
        </button>
      </div>

      <div>
        <h3>Get Contractor Balance</h3>
        <button onClick={getContractorBalanceHandler}>Get Balance</button>
        {contractorBalance !== null && <p>Balance: {contractorBalance} ETH</p>}
      </div>

      <div>
        <h3>Deposit Funds</h3>
        <input type="text" placeholder="Amount in Ether" />
        <button onClick={() => depositFundsHandler("1")}>Deposit 1 ETH</button>
      </div>
    </div>
  );
};
