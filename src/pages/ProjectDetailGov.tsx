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

// Utility function to format balance
const formatBalance = (value: string | ethers.BigNumber): string => {
  try {
    // Convert BigNumber to string if needed
    const stringValue = ethers.BigNumber.isBigNumber(value)
      ? ethers.utils.formatEther(value)
      : value;

    // Parse and format the value
    const number = parseFloat(stringValue);
    if (isNaN(number)) return "0";
    return number.toFixed(4).replace(/\.?0+$/, "");
  } catch (error) {
    console.error("Error formatting balance:", error);
    return "0";
  }
};

export default function ProjectDetailGov() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for dialogs and inputs
  const [fundAmount, setFundAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Use the contract context
  const {
    contract,
    loading,
    error,
    depositFunds,
    governmentApproveWork,
    sendFundsToContractor,
    getProjectDetails,
  } = useContract();

  // State to store project details
  const [project, setProject] = useState<any>(null);

  // Fetch project details on component mount and when contract changes
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (contract && id) {
        try {
          const projectDetails = await getProjectDetails(parseInt(id));
          setProject(projectDetails);
        } catch (err) {
          console.error("Failed to fetch project details:", err);
        }
      }
    };

    fetchProjectDetails();
  }, [contract, id, getProjectDetails]);

  // Handle deposit funds
  const handleDeposit = async () => {
    try {
      await depositFunds(fundAmount);
      setFundAmount("");
      setDialogOpen(false);
      // Optionally refetch project details
      await getProjectDetails(parseInt(id));
    } catch (err) {
      console.error("Failed to deposit funds:", err);
    }
  };

  // Handle work approval
  const handleApproveWork = async () => {
    try {
      await governmentApproveWork(parseInt(id));
      // Refetch project details to update status
      await getProjectDetails(parseInt(id));
    } catch (err) {
      console.error("Failed to approve work:", err);
    }
  };

  // Handle sending payment to contractor
  // const handleSendPayment = async () => {
  //   if (!project || !paymentAmount) return;

  //   try {
  //     // Send funds to contractor
  //     await sendFundsToContractor(parseInt(id), paymentAmount);

  //     setPaymentAmount("");
  //     setPaymentDialogOpen(false);

  //     // Refetch project details
  //     await getProjectDetails(parseInt(id));
  //   } catch (err) {
  //     console.error("Failed to send payment:", err);
  //   }
  // };

  const handleSendPayment = async () => {
    if (!project || !paymentAmount) return;
  
    try {
      // Send funds to contractor
      // Note the changes here:
      // 1. Use sendFundsToContractor method from the contract context
      // 2. Ensure project.id is used
      // 3. Convert paymentAmount to string if needed
      await sendFundsToContractor(project.id, paymentAmount.toString());
  
      setPaymentAmount("");
      setPaymentDialogOpen(false);
  
      // Refetch project details
      const updatedProject = await getProjectDetails(project.id);
      setProject(updatedProject);
    } catch (err) {
      console.error("Failed to send payment:", err);
      // Optionally, you might want to set an error state or show a toast
    }
  };

  // Render loading state
  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Render project details
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button and title */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Project Details</h1>
      </div>

      {/* Error handling */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details Card */}
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
                {/* Contractor Details */}
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

                {/* Financial Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Financial Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Project Budget</p>
                        <p className="text-sm text-muted-foreground">
                          {formatBalance(project.budget)} MATIC
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline Card */}
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
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {/* Deposit Funds Dialog */}
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

              {/* Send Payment Dialog */}
              <Dialog
                open={paymentDialogOpen}
                onOpenChange={setPaymentDialogOpen}
              >
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
                      Enter the amount in ETH to send to the contractor.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="paymentAmount" className="text-right">
                        Amount (ETH)
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
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSendPayment}>Confirm Payment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Approve Work Button */}
              <Button onClick={handleApproveWork}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Work
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Project Status Card */}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
