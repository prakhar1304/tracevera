import React, { useEffect, useState } from "react";
import { useContractRead } from "@thirdweb-dev/react";

interface ProjectInfoProps {
  contractAddress: string; // Address of the deployed Secondary contract
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ contractAddress }) => {
  const [projectDetails, setProjectDetails] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [projectBudget, setProjectBudget] = useState<number | null>(null);
  const [contractorBalance, setContractorBalance] = useState<number | null>(null);
  const [contractBalance, setContractBalance] = useState<number | null>(null);

  const { data: detailsData, error: detailsError, isLoading: detailsLoading } = useContractRead({
    contractAddress,
    functionName: "projectDetails",
  });

  const { data: nameData, error: nameError, isLoading: nameLoading } = useContractRead({
    contractAddress,
    functionName: "projectName",
  });

  const { data: budgetData, error: budgetError, isLoading: budgetLoading } = useContractRead({
    contractAddress,
    functionName: "projectBudget",
  });

  const { data: balanceData, error: balanceError, isLoading: balanceLoading } = useContractRead({
    contractAddress,
    functionName: "getContractorBalance",
  });

  const { data: contractBalanceData, error: contractBalanceError, isLoading: contractBalanceLoading } = useContractRead({
    contractAddress,
    functionName: "getContractBalance",
  });

  useEffect(() => {
    if (detailsData) setProjectDetails(detailsData.toString());
  }, [detailsData]);

  useEffect(() => {
    if (nameData) setProjectName(nameData.toString());
  }, [nameData]);

  useEffect(() => {
    if (budgetData) setProjectBudget(parseFloat(budgetData.toString())); // Convert to float
  }, [budgetData]);

  useEffect(() => {
    if (balanceData) setContractorBalance(parseFloat(balanceData.toString())); // Convert to float
  }, [balanceData]);

  useEffect(() => {
    if (contractBalanceData) setContractBalance(parseFloat(contractBalanceData.toString())); // Convert to float
  }, [contractBalanceData]);

  return (
    <div>
      <h2>Project Information</h2>

      <div>
        <h3>Project Details</h3>
        {detailsLoading ? (
          <p>Loading project details...</p>
        ) : detailsError ? (
          <p style={{ color: "red" }}>Error: {detailsError.message}</p>
        ) : (
          <p>{projectDetails !== null ? projectDetails : "No project details available."}</p>
        )}
      </div>

      <div>
        <h3>Project Name</h3>
        {nameLoading ? (
          <p>Loading project name...</p>
        ) : nameError ? (
          <p style={{ color: "red" }}>Error: {nameError.message}</p>
        ) : (
          <p>{projectName !== null ? projectName : "No project name available."}</p>
        )}
      </div>

      <div>
        <h3>Project Budget</h3>
        {budgetLoading ? (
          <p>Loading project budget...</p>
        ) : budgetError ? (
          <p style={{ color: "red" }}>Error: {budgetError.message}</p>
        ) : (
          <p>{projectBudget !== null ? ${projectBudget} Ether : "No project budget available."}</p>
        )}
      </div>

      <div>
        <h3>Contractor Balance</h3>
        {balanceLoading ? (
          <p>Loading contractor balance...</p>
        ) : balanceError ? (
          <p style={{ color: "red" }}>Error: {balanceError.message}</p>
        ) : (
          <p>{contractorBalance !== null ? ${contractorBalance} Ether : "No contractor balance available."}</p>
        )}
      </div>

      <div>
        <h3>Contract Balance</h3>
        {contractBalanceLoading ? (
          <p>Loading contract balance...</p>
        ) : contractBalanceError ? (
          <p style={{ color: "red" }}>Error: {contractBalanceError.message}</p>
        ) : (
          <p>{contractBalance !== null ? ${contractBalance} Ether : "No contract balance available."}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;