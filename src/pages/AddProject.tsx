import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

import { useContract } from "@/BlockChain/ContractProvider";

export default function AddProject() {
  const navigate = useNavigate();
  const { createProject, loading, error, address, connectWallet, provider } =
    useContract();

  const [formData, setFormData] = useState({
    projectName: "",
    contractorName: "",
    walletAddress: "",
    projectDetails: "",
    budget: "",
  });

  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected
    setWalletConnected(!!address);
  }, [address]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error("Failed to connect wallet", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Ethereum address
    if (!ethers.utils.isAddress(formData.walletAddress)) {
      alert("Invalid Ethereum address");
      return;
    }

    try {
      // Check wallet balance before creating project
      if (provider) {
        const balance = await provider.getBalance(address);
        const etherBalance = ethers.utils.formatEther(balance);

        if (Number(etherBalance) < Number(formData.budget)) {
          alert("Insufficient funds in wallet");
          return;
        }
      }

      // Create project
      await createProject(
        formData.projectName,
        formData.projectDetails,
        formData.contractorName,
        formData.walletAddress,
        formData.budget
      );

      // Navigate to home or projects page after successful creation
      navigate("/");
    } catch (err: any) {
      console.error("Project creation failed:", err);

      // More specific error handling
      if (err.message.includes("user rejected")) {
        alert("Transaction was rejected by the user");
      } else if (err.message.includes("insufficient funds")) {
        alert("Insufficient funds for transaction");
      } else {
        alert(`Failed to create project: ${err.message}`);
      }
    }
  };

  const isFormValid = () => {
    return (
      formData.projectName &&
      formData.contractorName &&
      formData.walletAddress &&
      formData.projectDetails &&
      formData.budget &&
      Number(formData.budget) > 0 &&
      walletConnected
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Wallet Connection Alert */}
          {!walletConnected && (
            <Alert variant="default" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wallet Not Connected</AlertTitle>
              <AlertDescription>
                Please connect your wallet to create a project
                <div className="mt-2">
                  <Button onClick={handleConnectWallet}>Connect Wallet</Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="projectName"
                className="text-sm font-medium text-gray-700"
              >
                Project Name
              </label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className="w-full"
                required
                disabled={!walletConnected}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contractorName"
                className="text-sm font-medium text-gray-700"
              >
                Contractor Name
              </label>
              <Input
                id="contractorName"
                value={formData.contractorName}
                onChange={handleInputChange}
                placeholder="Enter contractor name"
                className="w-full"
                required
                disabled={!walletConnected}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="walletAddress"
                className="text-sm font-medium text-gray-700"
              >
                Contractor Wallet Address
              </label>
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={handleInputChange}
                placeholder="Enter contractor's Ethereum address"
                className="w-full"
                required
                pattern="^0x[a-fA-F0-9]{40}$"
                title="Please enter a valid Ethereum address"
                disabled={!walletConnected}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="projectDetails"
                className="text-sm font-medium text-gray-700"
              >
                Project Details
              </label>
              <Textarea
                id="projectDetails"
                value={formData.projectDetails}
                onChange={handleInputChange}
                placeholder="Enter detailed project description"
                className="w-full min-h-[100px]"
                required
                disabled={!walletConnected}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="budget"
                className="text-sm font-medium text-gray-700"
              >
                Budget (ETH)
              </label>
              <Input
                id="budget"
                type="number"
                step="0.001"
                min="0"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter project budget in ETH"
                className="w-full"
                required
                disabled={!walletConnected}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
