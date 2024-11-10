import { ethers } from "ethers";

// export const formatBalance = (balance: string | number): string => {
//   try {
//     const cleanBalance = String(balance).replace(/\.0+$/, "");
//     return ethers.utils.formatEther(cleanBalance);
//   } catch (error) {
//     console.error("Error formatting balance:", error);
//     return "0.0";
//   }
// };

// export const parseBalance = (balance: string): string => {
//   try {
//     const cleanBalance = balance.replace(/\.0+$/, "");
//     return ethers.utils.parseEther(cleanBalance).toString();
//   } catch (error) {
//     console.error("Error parsing balance:", error);
//     throw new Error("Invalid balance format");
//   }
// };

// Utility function to safely format balance
export const formatBalance = (balance: string | number): string => {
  try {
    const balanceStr = String(balance);
    if (balanceStr.includes(".")) {
      const [whole, decimal = ""] = balanceStr.split(".");
      const cleanBalance = whole + decimal.padEnd(18, "0");
      return ethers.utils.formatEther(cleanBalance);
    }
    return ethers.utils.formatEther(balanceStr);
  } catch (error) {
    console.error("Error formatting balance:", error);
    return "0.0";
  }
};

// Utility function to safely parse balance for sending to contract
export const parseBalance = (balance: string): string => {
  try {
    const cleanBalance = balance.replace(/\.?0+$/, "");
    return ethers.utils.parseEther(cleanBalance).toString();
  } catch (error) {
    console.error("Error parsing balance:", error);
    throw new Error("Invalid balance format");
  }
};
