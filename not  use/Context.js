import { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Secondary from './abi.json'; // Import the ABI

// Set up the context
const ContractContext = createContext();

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [contractorBalance, setContractorBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  // Contract address (from Polygon testnet deployment)
  const contractAddress = '0xa140748aF4bdc5B57aE023DA228267F023b5F38d'; // Replace with your contract's deployed address

  // Load ethers.js provider and signer
  const loadProvider = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        const newSigner = newProvider.getSigner();
        setSigner(newSigner);
        const userAddress = await newSigner.getAddress();
        setAddress(userAddress);

        // Initialize contract
        const contractInstance = new ethers.Contract(contractAddress, Secondary.abi, newSigner);
        setContract(contractInstance);

        // Fetch contract balances
        await fetchBalances(contractInstance);
      } else {
        console.error('MetaMask is not installed!');
      }
    } catch (error) {
      console.error('Error loading provider:', error);
    }
  };

  // Fetch balances from the contract
  const fetchBalances = async (contractInstance) => {
    try {
      const contractorBal = await contractInstance.getContractorBalance();
      const contractBal = await contractInstance.getContractBalance();
      setContractorBalance(ethers.utils.formatEther(contractorBal)); // Convert from Wei to Ether
      setContractBalance(ethers.utils.formatEther(contractBal)); // Convert from Wei to Ether
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  // Function to deposit funds (government only)
  const depositFunds = async (amountInEther) => {
    try {
      const tx = await contract.depositFunds({
        value: ethers.utils.parseEther(amountInEther), // Convert to Wei
      });
      await tx.wait();
      await fetchBalances(contract); // Update balances after transaction
    } catch (error) {
      console.error('Error depositing funds:', error);
    }
  };

  // Function to withdraw funds (government only)
  const withdrawFunds = async (amountInEther) => {
    try {
      const tx = await contract.withdrawFunds(ethers.utils.parseEther(amountInEther));
      await tx.wait();
      await fetchBalances(contract); // Update balances after withdrawal
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  // Function to send funds to contractor (inspector/government)
  const sendFundsToContractor = async (amountInEther) => {
    try {
      const tx = await contract.sendFundsToContractor(ethers.utils.parseEther(amountInEther));
      await tx.wait();
      await fetchBalances(contract); // Update balances after sending funds
    } catch (error) {
      console.error('Error sending funds to contractor:', error);
    }
  };

  // Contractor work done confirmation
  const contractorWorkDoneConfirmation = async () => {
    try {
      const tx = await contract.contractorWorkDoneConfirmation();
      await tx.wait();
    } catch (error) {
      console.error('Error confirming work done by contractor:', error);
    }
  };

  // Inspector work done confirmation
  const inspectorWorkDoneConfirmation = async () => {
    try {
      const tx = await contract.inspectorWorkDoneConfirmation();
      await tx.wait();
    } catch (error) {
      console.error('Error confirming work done by inspector:', error);
    }
  };

  // Initialize provider and contract on component mount
  useEffect(() => {
    loadProvider();
  }, []);

  return (
    <ContractContext.Provider
      value={{
        address,
        contractorBalance,
        contractBalance,
        depositFunds,
        withdrawFunds,
        sendFundsToContractor,
        contractorWorkDoneConfirmation,
        inspectorWorkDoneConfirmation,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
