import React, { useEffect, useState } from "react";
import { useContractService } from "./useContractService";

const ContractComponent = () => {
  const {
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
  } = useContractService();

  // State for contract and contractor balances
  const [contractBalance, setContractBalance] = useState<string | null>(null);
  const [contractorBalance, setContractorBalance] = useState<string | null>(
    null
  );

  // Fetch balances when the component mounts
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const contractBal = await getContractBalance();
        const contractorBal = await getContractorBalance();
        setContractBalance(contractBal);
        setContractorBalance(contractorBal);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      }
    };

    fetchBalances();
  }, [getContractBalance, getContractorBalance]);

  const handleSetContractor = () => {
    // Example: Replace with UI inputs
    setContractor("0x1234...abcd", "John Doe");
  };

  const handleSetProjectDetails = () => {
    // Example: Replace with UI inputs
    setProjectDetails("New Project", "Building Construction", "10");
  };

  const handleDepositFunds = () => {
    // Example: Replace with UI inputs
    depositFunds("5");
  };

  const handleConfirmInspection = () => {
    confirmInspection();
  };

  const handleConfirmWorkDone = () => {
    confirmWorkDone();
  };

  return (
    <div>
      <h1>Contract Details</h1>
      <p>Government: {contractState?.government}</p>
      <p>Inspector: {contractState?.inspector}</p>
      <p>Contractor: {contractState?.contractor}</p>
      <p>Contractor Name: {contractState?.contractorName}</p>
      <p>Project Name: {contractState?.projectName}</p>
      <p>Project Details: {contractState?.projectDetails}</p>
      <p>Project Budget: {contractState?.projectBudget.toString()} Wei</p>
      <p>Contract Balance: {contractBalance} ETH</p>
      <p>Contractor Balance: {contractorBalance} ETH</p>

      {isGovernment && (
        <div>
          <button onClick={handleSetContractor}>Set Contractor</button>
          <button onClick={handleSetProjectDetails}>Set Project Details</button>
          <button onClick={handleDepositFunds}>Deposit Funds</button>
        </div>
      )}

      {isInspector && (
        <button onClick={handleConfirmInspection}>Confirm Inspection</button>
      )}

      {isContractor && (
        <button onClick={handleConfirmWorkDone}>Confirm Work Done</button>
      )}
    </div>
  );
};

export default ContractComponent;
