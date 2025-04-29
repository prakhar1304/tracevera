import React, { useState } from "react";
import { useContract } from "@/BlockChain/ContractProvider";

const ContractTestPage: React.FC = () => {
  return <ContractTestComponent />;
};

const ContractTestComponent: React.FC = () => {
  const {
    connectWallet,
    disconnectWallet,
    createProject,
    depositFunds,
    withdrawFunds,
    sendFundsToContractor,
    sendMoneyToLabor,
    sendMoneyToMaterialSupplier,
    getContractBalance,
    getAllProjects,
    confirmContractorWork,
    governmentApproveWork,
    address,
    loading,
    error,
  } = useContract();

  // State for form inputs
  const [projectName, setProjectName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [contractorAddress, setContractorAddress] = useState("");
  const [budgetInEther, setBudgetInEther] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  // Specific function states
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [contractorFundAmount, setContractorFundAmount] = useState("");
  const [laborName, setLaborName] = useState("");
  const [laborAddress, setLaborAddress] = useState("");
  const [laborAmount, setLaborAmount] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialSupplierAddress, setMaterialSupplierAddress] = useState("");
  const [materialAmount, setMaterialAmount] = useState("");

  // Result and error tracking
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  // Test function to handle multiple function tests
  const runTest = async (
    testName: string,
    testFunction: () => Promise<void>
  ) => {
    try {
      await testFunction();
      setTestResults((prev) => ({
        ...prev,
        [testName]: "Success ✅",
      }));
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: `Failed: ${err.message} ❌`,
      }));
    }
  };

  // Comprehensive test suite
  const runFullTestSuite = async () => {
    // Ensure wallet is connected first
    await runTest("Wallet Connection", connectWallet);

    // Only proceed if wallet is connected
    if (address) {
      // Project Creation Test
      await runTest("Create Project", () =>
        createProject(
          projectName || "Test Project",
          projectDetails || "Test Project Details",
          contractorName || "Test Contractor",
          contractorAddress || address,
          budgetInEther || "0.1"
        )
      );

      // Fetch All Projects to get a project ID
      const projects = await getAllProjects();
      const testProjectId = projects.length > 0 ? projects[0].id : 0;
      setSelectedProjectId(testProjectId);

      // Deposit Funds Test
      await runTest("Deposit Funds", () =>
        depositFunds(depositAmount || "0.01")
      );

      // Send Funds to Contractor Test
      await runTest("Send Funds to Contractor", () =>
        sendFundsToContractor(testProjectId, contractorFundAmount || "0.05")
      );

      // Send Money to Labor Test
      await runTest("Send Money to Labor", () =>
        sendMoneyToLabor(
          testProjectId,
          laborName || "Test Labor",
          laborAddress || address,
          laborAmount || "0.02"
        )
      );

      // Send Money to Material Supplier Test
      await runTest("Send Money to Material Supplier", () =>
        sendMoneyToMaterialSupplier(
          testProjectId,
          materialName || "Test Materials",
          materialSupplierAddress || address,
          materialAmount || "0.03"
        )
      );

      // Work Confirmation Tests
      await runTest("Confirm Contractor Work", () =>
        confirmContractorWork(testProjectId)
      );
      await runTest("Government Approve Work", () =>
        governmentApproveWork(testProjectId)
      );
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contract Context Test Suite</h1>

      {/* Wallet Connection Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Wallet Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Connect Wallet
          </button>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 text-white p-2 rounded"
          >
            Disconnect Wallet
          </button>
        </div>
        {address && <p>Connected Address: {address}</p>}
      </div>

      {/* Project Creation Inputs */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Project Creation</h2>
        <input
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="border p-2 m-1"
        />
        <input
          placeholder="Project Details"
          value={projectDetails}
          onChange={(e) => setProjectDetails(e.target.value)}
          className="border p-2 m-1"
        />
      </div>

      {/* Funds Management Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Funds Management</h2>
        <input
          placeholder="Deposit Amount (Ether)"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="border p-2 m-1"
        />
        <button
          onClick={() =>
            runTest("Deposit Funds", () => depositFunds(depositAmount))
          }
          className="bg-green-500 text-white p-2 rounded m-1"
        >
          Deposit Funds
        </button>
      </div>

      {/* Fund Sending Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Fund Sending Tests</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Send to Contractor */}
          <div>
            <h3>Send to Contractor</h3>
            <input
              placeholder="Project ID"
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="border p-2 m-1"
              type="number"
            />
            <input
              placeholder="Amount (Ether)"
              value={contractorFundAmount}
              onChange={(e) => setContractorFundAmount(e.target.value)}
              className="border p-2 m-1"
            />
            <button
              onClick={() =>
                selectedProjectId !== null &&
                runTest("Send to Contractor", () =>
                  sendFundsToContractor(selectedProjectId, contractorFundAmount)
                )
              }
              className="bg-purple-500 text-white p-2 rounded m-1"
            >
              Send to Contractor
            </button>
          </div>

          {/* Send to Labor */}
          <div>
            <h3>Send to Labor</h3>
            <input
              placeholder="Labor Name"
              value={laborName}
              onChange={(e) => setLaborName(e.target.value)}
              className="border p-2 m-1"
            />
            <input
              placeholder="Labor Address"
              value={laborAddress}
              onChange={(e) => setLaborAddress(e.target.value)}
              className="border p-2 m-1"
            />
            <input
              placeholder="Amount (Ether)"
              value={laborAmount}
              onChange={(e) => setLaborAmount(e.target.value)}
              className="border p-2 m-1"
            />
            <button
              onClick={() =>
                selectedProjectId !== null &&
                runTest("Send to Labor", () =>
                  sendMoneyToLabor(
                    selectedProjectId,
                    laborName,
                    laborAddress,
                    laborAmount
                  )
                )
              }
              className="bg-indigo-500 text-white p-2 rounded m-1"
            >
              Send to Labor
            </button>
          </div>

          {/* Send to Material Supplier */}
          <div>
            <h3>Send to Material Supplier</h3>
            <input
              placeholder="Material Name"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              className="border p-2 m-1"
            />
            <input
              placeholder="Supplier Address"
              value={materialSupplierAddress}
              onChange={(e) => setMaterialSupplierAddress(e.target.value)}
              className="border p-2 m-1"
            />
            <input
              placeholder="Amount (Ether)"
              value={materialAmount}
              onChange={(e) => setMaterialAmount(e.target.value)}
              className="border p-2 m-1"
            />
            <button
              onClick={() =>
                selectedProjectId !== null &&
                runTest("Send to Material Supplier", () =>
                  sendMoneyToMaterialSupplier(
                    selectedProjectId,
                    materialName,
                    materialSupplierAddress,
                    materialAmount
                  )
                )
              }
              className="bg-teal-500 text-white p-2 rounded m-1"
            >
              Send to Supplier
            </button>
          </div>
        </div>
      </div>

      {/* Run Full Test Suite */}
      <div className="mb-4">
        <button
          onClick={runFullTestSuite}
          className="bg-green-600 text-white p-3 rounded w-full"
        >
          Run Full Test Suite
        </button>
      </div>

      {/* Test Results */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Test Results</h2>
        {Object.entries(testResults).map(([testName, result]) => (
          <div
            key={testName}
            className={`p-2 ${
              result.includes("Success") ? "bg-green-100" : "bg-red-100"
            } rounded my-1`}
          >
            {testName}: {result}
          </div>
        ))}
      </div>

      {/* Loading and Error Display */}
      {loading && <p className="text-yellow-600">Processing...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
    </div>
  );
};

export default ContractTestPage;
