import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  Calendar,
  User,
  Wallet,
  Info,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useContract } from "@/BlockChain/ContractProvider";

export default function DetailedProjectScreen() {
  const { id } = useParams();
  const {
    projects,
    loading,
    error,
    isConnected,
    connectWallet,
    getContractorBalance,
  } = useContract();
  const [contractorBalance, setContractorBalance] = useState("0");

  const project = projects.find((p) => p.id === Number(id));

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && project) {
        const balance = await getContractorBalance(project.id);
        setContractorBalance(balance);
      }
    };
    fetchBalance();
  }, [isConnected, project]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view project details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl mb-4">Project not found</h2>
        <Link to="/CitizenProject">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const completionPercentage = project.workConfirmed
    ? project.workApproved
      ? 100
      : 75
    : project.isActive
    ? 50
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/CitizenProject">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <CardDescription>Project ID: {project.id}</CardDescription>
              </div>
              <Badge variant={project.isActive ? "default" : "secondary"}>
                {project.isActive ? "Active" : "Completed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-2xl font-bold">
                    {parseFloat(project.budget).toFixed(4)} ETH
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-lg">{project.startingDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contractor</p>
                  <p className="text-lg">{project.contractorName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contractor Balance</p>
                  <p className="text-lg">{contractorBalance} ETH</p>
                </div>
              </div>

              <div className="col-span-2">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Project Details</h3>
                  <p className="text-gray-600">{project.details}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Progress</h3>
                  <Progress value={completionPercentage} className="mb-2" />
                  <p className="text-sm text-gray-500">
                    {completionPercentage}% Complete
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Current project milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Project Started</span>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <span>Work Confirmation</span>
                </div>
                {project.workConfirmed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  <span>Government Approval</span>
                </div>
                {project.workApproved ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-300" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
