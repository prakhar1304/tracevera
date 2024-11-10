import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContract } from "@/BlockChain/ContractProvider";
import { ethers } from "ethers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Calendar,
  User,
  Wallet,
  Info,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  Send,
  Clock,
  FileText,
} from "lucide-react";

// Updated utility function for balance formatting
const formatBalance = (value) => {
  try {
    // If value is already a string, remove any trailing decimals
    if (typeof value === "string") {
      // Remove trailing zeros and decimal point if necessary
      value = value.replace(/\.?0+$/, "");
    }

    // If the value is a BigNumber, convert it to string
    if (ethers.BigNumber.isBigNumber(value)) {
      return ethers.utils.formatEther(value);
    }

    // For regular numbers or cleaned strings, format to 4 decimal places
    const number = parseFloat(value);
    if (isNaN(number)) return "0";
    return number.toFixed(4).replace(/\.?0+$/, "");
  } catch (error) {
    console.error("Error formatting balance:", error);
    return "0";
  }
};

// Helper function to convert MATIC to Wei
const convertToWei = (value) => {
  try {
    if (!value || value === "") return ethers.BigNumber.from(0);
    // Remove any trailing zeros and decimal point
    const cleanValue = value.toString().replace(/\.?0+$/, "");
    return ethers.utils.parseEther(cleanValue);
  } catch (error) {
    console.error("Error converting to Wei:", error);
    return ethers.BigNumber.from(0);
  }
};

export default function ProjectDetailGov() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fundAmount, setFundAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    projects,
    loading,
    error,
    success,
    depositFunds,
    approveWork,
    sendPayment,
    refreshData,
    isConnected,
  } = useContract();
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const project = projects.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected, id]);

  const handleDeposit = async () => {
    try {
      await depositFunds(fundAmount);
      setFundAmount("");
      setDialogOpen(false);
      await refreshData();
    } catch (err) {
      console.error("Failed to deposit funds:", err);
    }
  };

  const handleApproveWork = async () => {
    try {
      await approveWork(parseInt(id));
      await refreshData();
    } catch (err) {
      console.error("Failed to approve work:", err);
    }
  };

  const handleSendPayment = async () => {
    if (!project || !paymentAmount) return;
    try {
      const amount = parseFloat(paymentAmount);
      const contractorBalanceInEther = ethers.utils.formatEther(
        project.contractorBalance
      );
      const remainingBudget =
        parseFloat(project.budget) - parseFloat(contractorBalanceInEther);

      if (amount <= 0) {
        throw new Error("Payment amount must be greater than 0");
      }
      if (amount > remainingBudget) {
        throw new Error("Payment amount cannot exceed remaining budget");
      }

      // Convert payment amount to proper format
      const formattedAmount = formatBalance(paymentAmount);
      await sendPayment(parseInt(id), formattedAmount);
      setPaymentAmount("");
      setPaymentDialogOpen(false);
      await refreshData();
    } catch (err) {
      console.error("Failed to send payment:", err);
    }
  };

  const renderSendPaymentButton = () => {
    if (project.workConfirmed && project.workApproved) {
      const contractorBalanceInEther = ethers.utils.formatEther(
        project.contractorBalance
      );
      const remainingBudget = formatBalance(
        parseFloat(project.budget) - parseFloat(contractorBalanceInEther)
      );

      return (
        <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Payment</DialogTitle>
              <DialogDescription>
                Enter the amount in MATIC to send to the contractor. Maximum
                available: {remainingBudget} MATIC
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentAmount" className="text-right">
                  Amount (MATIC)
                </Label>
                <Input
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0.0"
                  className="col-span-3"
                  type="number"
                  step="0.0001"
                  min="0"
                  max={remainingBudget}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSendPayment}>Confirm Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
    return null;
  };

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Project Details</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {project.details}
                  </CardDescription>
                </div>
                <Badge
                  variant={project.isActive ? "default" : "secondary"}
                  className="text-sm"
                >
                  {project.isActive ? "Active" : "Completed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contractor Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Contractor Name</p>
                        <p className="text-sm text-muted-foreground">
                          {project.contractorName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Wallet Address</p>
                        <p className="text-sm text-muted-foreground">
                          {`${project.contractor.slice(
                            0,
                            6
                          )}...${project.contractor.slice(-4)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Financial Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Project Budget</p>
                        <p
                          className="text-sm text-muted-foreground truncate"
                          title={`${formatBalance(project.budget)} MATIC`}
                        >
                          {formatBalance(project.budget)} MATIC
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          Contractor Balance
                        </p>
                        <p
                          className="text-sm text-muted-foreground truncate"
                          title={`${formatBalance(
                            ethers.utils.formatEther(project.contractorBalance)
                          )} MATIC`}
                        >
                          {formatBalance(
                            ethers.utils.formatEther(project.contractorBalance)
                          )}{" "}
                          MATIC
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {project.startingDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Project Duration</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Deposit Funds
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                    <DialogDescription>
                      Enter the amount in MATIC to deposit into the contract.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fundAmount" className="text-right">
                        Amount (MATIC)
                      </Label>
                      <Input
                        id="fundAmount"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="0.0"
                        className="col-span-3"
                        type="number"
                        step="0.0001"
                        min="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleDeposit}>Confirm Deposit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {project.workConfirmed && !project.workApproved && (
                <Button onClick={handleApproveWork}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Work
                </Button>
              )}

              {renderSendPaymentButton()}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Project Active:</span>
                  {project.isActive ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Completed</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Work Confirmed:</span>
                  {project.workConfirmed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Work Approved:</span>
                  {project.workApproved ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Current Balance:</p>
                  <p
                    className="text-2xl font-bold truncate"
                    title={`${formatBalance(
                      ethers.utils.formatEther(project.contractorBalance)
                    )} MATIC`}
                  >
                    {formatBalance(
                      ethers.utils.formatEther(project.contractorBalance)
                    )}{" "}
                    MATIC
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Budget:</p>
                  <p
                    className="text-2xl font-bold truncate"
                    title={`${formatBalance(project.budget)} MATIC`}
                  >
                    {formatBalance(project.budget)} MATIC
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
