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
import {
  DollarSign,
  Calendar,
  User,
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Send,
  Truck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  const [laborDialogOpen, setLaborDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Labor Payment State
  const [laborName, setLaborName] = useState("");
  const [laborAddress, setLaborAddress] = useState("");
  const [laborAmount, setLaborAmount] = useState("");

  // Material Supplier Payment State
  const [materialName, setMaterialName] = useState("");
  const [materialAddress, setMaterialAddress] = useState("");
  const [materialAmount, setMaterialAmount] = useState("");

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
        description: "Failed to confirm work. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  const handleSendToLabor = async () => {
    if (!project) return;

    try {
      await sendMoneyToLabor(project.id, laborName, laborAddress, laborAmount);

      // Refresh transactions
      const updatedTransactions = await getProjectTransactions(project.id);
      setTransactions(updatedTransactions);

      setLaborDialogOpen(false);
      toast({
        title: "Success",
        description: "Payment to labor sent successfully",
      });

      // Reset form
      setLaborName("");
      setLaborAddress("");
      setLaborAmount("");
    } catch (err) {
      console.error("Failed to send money to labor:", err);
      toast({
        title: "Error",
        description: "Failed to send payment to labor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendToMaterialSupplier = async () => {
    if (!project) return;

    try {
      await sendMoneyToMaterialSupplier(
        project.id,
        materialName,
        materialAddress,
        materialAmount
      );

      // Refresh transactions
      const updatedTransactions = await getProjectTransactions(project.id);
      setTransactions(updatedTransactions);

      setMaterialDialogOpen(false);
      toast({
        title: "Success",
        description: "Payment to material supplier sent successfully",
      });

      // Reset form
      setMaterialName("");
      setMaterialAddress("");
      setMaterialAmount("");
    } catch (err) {
      console.error("Failed to send money to material supplier:", err);
      toast({
        title: "Error",
        description:
          "Failed to send payment to material supplier. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGovernmentApproveWork = async () => {
    if (!project) return;

    setConfirming(true);
    try {
      await governmentApproveWork(project.id);
      const updatedProject = await getProjectDetails(project.id);
      setProject(updatedProject);
      toast({
        title: "Success",
        description: "Work approved successfully",
      });
    } catch (err) {
      console.error("Failed to approve work:", err);
      toast({
        title: "Error",
        description: "Failed to approve work. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  // Determine user role
  const isContractor =
    project?.contractor.toLowerCase() === address.toLowerCase();
  const isGovernment = false; // You'll need to implement logic to determine this

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Information Sections */}
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor Name</p>
                  <p className="text-sm text-muted-foreground">
                    {project.contractorName}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor Address</p>
                  <p className="text-sm text-muted-foreground">
                    {`${project.contractor.slice(
                      0,
                      6
                    )}...${project.contractor.slice(-4)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {project.startingDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-sm text-muted-foreground">
                    {ethers.utils.formatEther(project.budget)} ETH
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={project.isActive ? "default" : "secondary"}>
                    {project.isActive ? "Active" : "Completed"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Work Status Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Work Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`mr-2 h-4 w-4 ${
                        project.workConfirmed
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>Work Confirmation</span>
                  </div>
                  <Badge
                    variant={project.workConfirmed ? "success" : "secondary"}
                  >
                    {project.workConfirmed ? "Confirmed" : "Not Confirmed"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle
                      className={`mr-2 h-4 w-4 ${
                        project.workApproved
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span>Work Approval</span>
                  </div>
                  <Badge
                    variant={project.workApproved ? "success" : "secondary"}
                  >
                    {project.workApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Action Buttons */}
          <CardFooter className="flex justify-end space-x-4">
            {isContractor && !project.workConfirmed && (
              <>
                <Button
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={!project.isActive}
                >
                  Confirm Work Completion
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setLaborDialogOpen(true)}
                  disabled={!project.isActive}
                >
                  <Send className="mr-2 h-4 w-4" /> Pay Labor
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setMaterialDialogOpen(true)}
                  disabled={!project.isActive}
                >
                  <Truck className="mr-2 h-4 w-4" /> Pay Material Supplier
                </Button>
              </>
            )}

            {isGovernment && project.workConfirmed && !project.workApproved && (
              <Button onClick={handleGovernmentApproveWork} variant="default">
                Approve Work
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Project Transactions Card */}
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

      {/* Confirmation Dialog */}
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

      {/* Labor Payment Dialog */}
      <Dialog open={laborDialogOpen} onOpenChange={setLaborDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment to Labor</DialogTitle>
            <DialogDescription>
              Provide details to send payment to a labor worker
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
            <Button variant="outline" onClick={() => setLaborDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendToLabor}
              disabled={!laborName || !laborAddress || !laborAmount}
            >
              Send Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Supplier Payment Dialog */}
      <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment to Material Supplier</DialogTitle>
            <DialogDescription>
              Provide details to send payment to a material supplier
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialName" className="text-right">
                Supplier Name
              </Label>
              <Input
                id="materialName"
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materialAddress" className="text-right">
                Supplier Address
              </Label>
              <Input
                id="materialAddress"
                value={materialAddress}
                onChange={(e) => setMaterialAddress(e.target.value)}
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
              onClick={() => setMaterialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendToMaterialSupplier}
              disabled={!materialName || !materialAddress || !materialAmount}
            >
              Send Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
