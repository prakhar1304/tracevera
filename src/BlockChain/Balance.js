import { ethers } from "ethers";

// The contract address
const CONTRACT_ADDRESS = "0x0f20A4036a0fdfEcfCC7444B31eE76240772e2C5";

// RPC URL for the network (replace with your RPC endpoint if needed)
const RPC_URL = "https://rpc-amoy.polygon.technology/";

const getContractBalance = async () => {
  try {
    // Initialize a provider (works outside the browser)
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Get the contract balance
    const balanceInWei = await provider.getBalance(CONTRACT_ADDRESS);

    // Convert balance from Wei to Ether
    const balanceInEther = ethers.utils.formatEther(balanceInWei);

    // Log the balance to the console
    console.log(`Contract Balance: ${balanceInEther} ETH`);
    console.log(`Contract Balance in wei: ${balanceInWei} ETH`);
  } catch (err) {
    console.error("Error fetching contract balance:", err);
  }
};

// Call the function to fetch and log the balance
getContractBalance();
