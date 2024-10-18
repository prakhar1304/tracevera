"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3Icon,
  BuildingIcon,
  CheckCircleIcon,
  DollarSignIcon,
  Loader2Icon,
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
import { Label } from "@/components/ui/label";

import { useContractService } from "../BlockChain/useContractService";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

export default function GovDashboard() {
  const { toast } = useToast();
  const {
    contractState,
    isGovernment,
    setContractor,
    setProjectDetails,
    depositFunds,
    getContractBalance,
    getContractorWorkDoneStatus,
    getInspectorWorkDoneStatus,
  } = useContractService();

  const [loading, setLoading] = useState(true);
  const [contractBalance, setContractBalance] = useState("0");
  const [projects, setProjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    details: "",
    contractorName: "",
    walletAddress: "",
    budget: "",
    startingDate: "",
  });

  // Load contract data
  useEffect(() => {
    loadContractData();
  }, [contractState]);

  const loadContractData = async () => {
    try {
      if (contractState) {
        const balance = await getContractBalance();
        setContractBalance(balance);

        // For demonstration, creating a project object from contract state
        // In a real application, you'd likely have multiple projects stored in a separate storage solution
        const project = {
          id: 1,
          name: contractState.projectName,
          details: contractState.projectDetails,
          contractor: contractState.contractor,
          contractorName: contractState.contractorName,
          budget: ethers.utils.formatEther(contractState.projectBudget),
          spent: await getContractBalance(),
          status: await getProjectStatus(contractState.contractor),
          progress: await calculateProgress(contractState.contractor),
        };

        setProjects([project]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading contract data:", error);
      toast({
        title: "Error",
        description: "Failed to load contract data",
        variant: "destructive",
      });
    }
  };

  const getProjectStatus = async (contractorAddress) => {
    const contractorConfirmed = await getContractorWorkDoneStatus(
      contractorAddress
    );
    const inspectorConfirmed = await getInspectorWorkDoneStatus(
      contractorAddress
    );
    return contractorConfirmed && inspectorConfirmed ? "completed" : "ongoing";
  };

  const calculateProgress = async (contractorAddress) => {
    const contractorConfirmed = await getContractorWorkDoneStatus(
      contractorAddress
    );
    const inspectorConfirmed = await getInspectorWorkDoneStatus(
      contractorAddress
    );

    if (contractorConfirmed && inspectorConfirmed) return 100;
    if (contractorConfirmed) return 50;
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Set contractor first
      await setContractor(newProject.walletAddress, newProject.contractorName);

      // Then set project details
      await setProjectDetails(
        newProject.name,
        newProject.details,
        newProject.budget
      );

      // Deposit initial funds if needed
      if (newProject.budget) {
        await depositFunds(newProject.budget);
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      // Reload contract data
      await loadContractData();

      // Reset form and close dialog
      setNewProject({
        name: "",
        details: "",
        contractorName: "",
        walletAddress: "",
        budget: "",
        startingDate: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isGovernment) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You must be the government address to access this dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2Icon className="h-8 w-8 animate-spin mx-auto" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const totalProjects = projects.length;
  const ongoingProjects = projects.filter((p) => p.status === "ongoing").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.budget), 0);
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Government Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ongoing Projects
            </CardTitle>
            <BuildingIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Projects
            </CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contract Balance
            </CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(contractBalance).toFixed(2)} ETH
            </div>
            <Progress
              value={(totalSpent / totalBudget) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-8">Create New Project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter the details for the new project. Click submit when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">
                  Details
                </Label>
                <Input
                  id="details"
                  name="details"
                  value={newProject.details}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contractorName" className="text-right">
                  Contractor
                </Label>
                <Input
                  id="contractorName"
                  name="contractorName"
                  value={newProject.contractorName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="walletAddress" className="text-right">
                  Wallet
                </Label>
                <Input
                  id="walletAddress"
                  name="walletAddress"
                  value={newProject.walletAddress}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                  placeholder="0x..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Budget (ETH)
                </Label>
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  step="0.01"
                  value={newProject.budget}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startingDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startingDate"
                  name="startingDate"
                  type="date"
                  value={newProject.startingDate}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                Status:{" "}
                <Badge
                  variant={
                    project.status === "ongoing" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Contractor:</span>
                  <span className="font-medium">{project.contractorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium">{project.budget} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Spent:</span>
                  <span className="font-medium">{project.spent} ETH</span>
                </div>
                <Progress value={project.progress} />
                <div className="text-sm text-muted-foreground text-right">
                  {project.progress}% Complete
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to={`/gov-project/${project.id}`}>View Details</Link>
              </Button>
              {project.status === "ongoing" && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Send Funds
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
