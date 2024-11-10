"use client";

import { useState, useEffect, Suspense } from "react";
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
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useContract } from "@/BlockChain/ContractProvider";
import { Skeleton } from "@/components/ui/Skeleton";

const ProjectDetailContent = ({ id }) => {
  const {
    projects,
    currentAddress,
    loading,
    error,
    success,
    confirmWork,
    getContractorBalance,
    refreshData,
  } = useContract();

  const [project, setProject] = useState(null);
  const [contractorBalance, setContractorBalance] = useState("0");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        await refreshData();
        const projectData = projects.find((p) => p.id === parseInt(id));
        if (projectData) {
          setProject(projectData);
          const balance = await getContractorBalance(projectData.id);
          setContractorBalance(balance);
        }
      } catch (err) {
        console.error("Failed to load project data:", err);
      }
    };
    loadProjectData();
  }, [id, refreshData, projects, getContractorBalance]);

  const handleConfirmWork = async () => {
    console.log("Current Address:", currentAddress);
    console.log("Contractor Address:", project.contractor);

    setConfirming(true);
    try {
      await confirmWork(parseInt(id));
      await refreshData();
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error("Failed to confirm work:", err);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-64" />
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

  const isContractor =
    project.contractor.toLowerCase() === currentAddress.toLowerCase();

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Project Details</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {success && (
          <Alert className="mb-8">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.details}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Contractor Name</p>
                    <p className="text-sm text-gray-500">
                      {project.contractorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Contractor Address</p>
                    <p className="text-sm text-gray-500">
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
                    <p className="text-sm text-gray-500">
                      {project.startingDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Budget</p>
                    <p className="text-sm text-gray-500">
                      {project.budget} ETH
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Current Balance</p>
                    <p className="text-sm text-gray-500">
                      {contractorBalance} ETH
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

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Work Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle
                        className={`mr-2 h-4 w-4 ${
                          project.workConfirmed
                            ? "text-green-500"
                            : "text-gray-400"
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
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle
                        className={`mr-2 h-4 w-4 ${
                          project.workApproved
                            ? "text-green-500"
                            : "text-gray-400"
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
            <CardFooter className="flex justify-end space-x-4">
              {isContractor && !project.workConfirmed && (
                <Button
                  onClick={() => setConfirmDialogOpen(true)}
                  disabled={!project.isActive}
                >
                  Confirm Work Completion
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Project Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Government
                  </p>
                  <p className="mt-1 font-mono">
                    {`${project.government?.slice(
                      0,
                      6
                    )}...${project.government?.slice(-4)}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Inspector</p>
                  <p className="mt-1 font-mono">
                    {`${project.inspector?.slice(
                      0,
                      6
                    )}...${project.inspector?.slice(-4)}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Contractor
                  </p>
                  <p className="mt-1 font-mono">
                    {`${project.contractor?.slice(
                      0,
                      6
                    )}...${project.contractor?.slice(-4)}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
    </>
  );
};

// Main component with Suspense wrapper
export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-96 lg:col-span-2" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      }
    >
      <ProjectDetailContent id={id} />
    </Suspense>
  );
}
