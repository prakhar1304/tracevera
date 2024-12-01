import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  Calendar,
  User,
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Construction,
  Truck,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ethers } from "ethers";

import { useContract } from "@/BlockChain/ContractProvider";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/Skeleton";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getProjectDetails,
    getProjectTransactions,
    address,
    confirmContractorWork,
    governmentApproveWork,
    sendMoneyToLabor,
    sendMoneyToMaterialSupplier,
    loading,
    error,
  } = useContract();

  const [project, setProject] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [laborPaymentDialog, setLaborPaymentDialog] = useState(false);
  const [materialPaymentDialog, setMaterialPaymentDialog] = useState(false);

  // Payment form states
  const [laborName, setLaborName] = useState("");
  const [laborAddress, setLaborAddress] = useState("");
  const [laborAmount, setLaborAmount] = useState("");

  const [materialName, setMaterialName] = useState("");
  const [materialSupplierAddress, setMaterialSupplierAddress] = useState("");
  const [materialAmount, setMaterialAmount] = useState("");

  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (id) {
          const projectDetails = await getProjectDetails(parseInt(id));
          const projectTransactions = await getProjectTransactions(
            parseInt(id)
          );

          setProject(projectDetails);
          setTransactions(projectTransactions);
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        toast({
          title: "Error",
          description: "Failed to fetch project details",
          variant: "destructive",
        });
      }
    };

    fetchProjectDetails();
  }, [id, getProjectDetails, getProjectTransactions]);

  const handleConfirmWork = async () => {
    if (!project) return;

    setConfirming(true);
    try {
      await confirmContractorWork(project.id);
      const updatedProject = await getProjectDetails(project.id);
      setProject(updatedProject);
      setConfirmDialogOpen(false);
      toast({
        title: "Success",
        description: "Work confirmation submitted successfully",
      });
    } catch (err) {
      console.error("Failed to confirm work:", err);
      toast({
        title: "Error",
        description: "Failed to confirm work",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  const handleLaborPayment = async () => {
    if (!project) return;

    try {
      await sendMoneyToLabor(project.id, laborName, laborAddress, laborAmount);

      // Refresh transactions
      const updatedTransactions = await getProjectTransactions(project.id);
      setTransactions(updatedTransactions);

      // Reset form and close dialog
      setLaborName("");
      setLaborAddress("");
      setLaborAmount("");
      setLaborPaymentDialog(false);

      toast({
        title: "Success",
        description: "Payment to labor processed successfully",
      });
    } catch (err) {
      console.error("Failed to pay labor:", err);
      toast({
        title: "Error",
        description: "Failed to process labor payment",
        variant: "destructive",
      });
    }
  };

  const handleMaterialSupplierPayment = async () => {
    if (!project) return;

    try {
      await sendMoneyToMaterialSupplier(
        project.id,
        materialName,
        materialSupplierAddress,
        materialAmount
      );

      // Refresh transactions
      const updatedTransactions = await getProjectTransactions(project.id);
      setTransactions(updatedTransactions);

      // Reset form and close dialog
      setMaterialName("");
      setMaterialSupplierAddress("");
      setMaterialAmount("");
      setMaterialPaymentDialog(false);

      toast({
        title: "Success",
        description: "Payment to material supplier processed successfully",
      });
    } catch (err) {
      console.error("Failed to pay material supplier:", err);
      toast({
        title: "Error",
        description: "Failed to process material supplier payment",
        variant: "destructive",
      });
    }
  };

  // Determine user role (placeholder - you should implement actual role checking)
  const isContractor =
    project?.contractor.toLowerCase() === address.toLowerCase();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!project) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Project not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Project Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Details Card */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.details}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ... Previous project details remain the same ... */}
          </CardContent>

          {/* Action Buttons */}
          <CardFooter className="flex justify-end space-x-4">
            {isContractor && (
              <>
                <Button
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={!project.isActive}
                >
                  Confirm Work Completion
                </Button>

                {/* Labor Payment Button */}
                <Dialog
                  open={laborPaymentDialog}
                  onOpenChange={setLaborPaymentDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      <Construction className="mr-2 h-4 w-4" /> Pay Labor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pay Labor</DialogTitle>
                      <DialogDescription>
                        Process payment for labor work on this project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="laborName" className="text-right">
                          Labor Name
                        </Label>
                        <Input
                          id="laborName"
                          value={laborName}
                          onChange={(e) => setLaborName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="laborAddress" className="text-right">
                          Labor Address
                        </Label>
                        <Input
                          id="laborAddress"
                          value={laborAddress}
                          onChange={(e) => setLaborAddress(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="laborAmount" className="text-right">
                          Amount (ETH)
                        </Label>
                        <Input
                          id="laborAmount"
                          type="number"
                          value={laborAmount}
                          onChange={(e) => setLaborAmount(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setLaborPaymentDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleLaborPayment}
                        disabled={!laborName || !laborAddress || !laborAmount}
                      >
                        Process Payment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Material Supplier Payment Button */}
                <Dialog
                  open={materialPaymentDialog}
                  onOpenChange={setMaterialPaymentDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      <Truck className="mr-2 h-4 w-4" /> Pay Supplier
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pay Material Supplier</DialogTitle>
                      <DialogDescription>
                        Process payment for material supplies on this project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="materialName" className="text-right">
                          Material Name
                        </Label>
                        <Input
                          id="materialName"
                          value={materialName}
                          onChange={(e) => setMaterialName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="materialSupplierAddress"
                          className="text-right"
                        >
                          Supplier Address
                        </Label>
                        <Input
                          id="materialSupplierAddress"
                          value={materialSupplierAddress}
                          onChange={(e) =>
                            setMaterialSupplierAddress(e.target.value)
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="materialAmount" className="text-right">
                          Amount (ETH)
                        </Label>
                        <Input
                          id="materialAmount"
                          type="number"
                          value={materialAmount}
                          onChange={(e) => setMaterialAmount(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setMaterialPaymentDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleMaterialSupplierPayment}
                        disabled={
                          !materialName ||
                          !materialSupplierAddress ||
                          !materialAmount
                        }
                      >
                        Process Payment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardFooter>
        </Card>

        {/* Transactions Card */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Project Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {tx.recipientName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {ethers.utils.formatEther(tx.amount)} ETH
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* You might want to add more transaction details */}
                      {new Date(
                        tx.timestamp.toNumber() * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No transactions yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Work Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Work Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to confirm that the work for this project is
              complete? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmWork} disabled={confirming}>
              {confirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Work"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
