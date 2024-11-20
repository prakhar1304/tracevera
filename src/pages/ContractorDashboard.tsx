"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3Icon, DollarSignIcon, CalendarIcon } from "lucide-react";
import { useContract } from "@/BlockChain/ContractProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import Loader from "@/components/loader/Index";

export default function ContractorDashboard() {
  const {
    projects,
    loading: contractLoading,
    currentAddress,
    error,
    refreshData,
    getContractorBalance,
  } = useContract();

  const [selectedProject, setSelectedProject] = useState(null);
  const [projectBalances, setProjectBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Current Address:", currentAddress);
    console.log("All Projects:", projects);
  }, [currentAddress, projects]);

  // Initial data load
  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        console.log("Starting initial data load...");
        await refreshData();

        if (mounted) {
          console.log("After refresh - Projects:", projects);
          console.log("After refresh - Current Address:", currentAddress);

          if (projects && projects.length > 0 && currentAddress) {
            // Filter projects for current contractor
            const contractorProjects = projects.filter((project) => {
              const match =
                project.contractor.toLowerCase() ===
                currentAddress.toLowerCase();
              console.log("Comparing:", {
                projectContractor: project.contractor.toLowerCase(),
                currentAddress: currentAddress.toLowerCase(),
                isMatch: match,
              });
              return match;
            });

            console.log("Filtered Contractor Projects:", contractorProjects);

            if (contractorProjects.length > 0) {
              setSelectedProject(contractorProjects[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        if (mounted) {
          setDataInitialized(true);
        }
      }
    };

    if (currentAddress) {
      loadInitialData();
    }

    return () => {
      mounted = false;
    };
  }, [refreshData, currentAddress, projects]);

  // Load project balances
  useEffect(() => {
    let mounted = true;

    const loadProjectBalances = async () => {
      if (!projects.length || !currentAddress) {
        console.log("Skipping balance load - no projects or address");
        return;
      }

      setLoadingBalances(true);
      try {
        const contractorProjects = projects.filter(
          (p) => p.contractor.toLowerCase() === currentAddress.toLowerCase()
        );

        const balancePromises = contractorProjects.map((project) =>
          getContractorBalance(project.id)
        );

        // Use Promise.all to fetch all balances simultaneously
        const balances = await Promise.all(balancePromises);

        const balancesMap = contractorProjects.reduce((acc, project, index) => {
          acc[project.id] = balances[index];
          return acc;
        }, {});

        setProjectBalances(balancesMap);
      } catch (err) {
        console.error("Failed to load project balances:", err);
      } finally {
        if (mounted) {
          setLoadingBalances(false);
        }
      }
    };

    loadProjectBalances();

    return () => {
      mounted = false;
    };
  }, [projects, currentAddress, getContractorBalance]);

  // Filter projects for current contractor with debugging
  const contractorProjects = projects.filter((project) => {
    if (!currentAddress || !project.contractor) {
      console.log("Missing address or contractor:", {
        currentAddress,
        projectContractor: project.contractor,
      });
      return false;
    }
    const match =
      project.contractor.toLowerCase() === currentAddress.toLowerCase();
    console.log("Project filter check:", {
      projectId: project.id,
      projectContractor: project.contractor.toLowerCase(),
      currentAddress: currentAddress.toLowerCase(),
      isMatch: match,
    });
    return match;
  });

  console.log("Filtered Contractor Projects:", contractorProjects);

  const totalProjects = contractorProjects.length;
  const ongoingProjects = contractorProjects.filter((p) => p.isActive).length;
  const totalBudget = contractorProjects.reduce(
    (sum, p) => sum + parseFloat(p.budget || 0),
    0
  );

  // Loading state
  if (contractLoading || !dataInitialized) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96 lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={refreshData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No projects state
  if (contractorProjects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Contractor Dashboard</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500 mb-4">
                No projects found for your address
              </p>
              <p className="text-sm text-gray-400">
                Connected Address: {currentAddress}
              </p>
              <Button onClick={refreshData} className="mt-4">
                Refresh Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatETHtoPOL = (ethValue) => {
    if (!ethValue) return "0.00";
    return parseFloat(ethValue).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* <Loader visible={true} /> */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contractor Dashboard</h1>

        {/* Debug Info */}
        <div className="mb-4 p-4 bg-gray-200 rounded">
          <p className="text-sm">Connected Address: {currentAddress}</p>
          <p className="text-sm">Total Projects Found: {totalProjects}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budget
              </CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatETHtoPOL(totalBudget)} POL
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Your assigned projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractorProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedProject?.id === project.id
                        ? "bg-primary/10"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <h3 className="font-semibold">{project.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <Badge
                        variant={project.isActive ? "default" : "secondary"}
                      >
                        {project.isActive ? "Active" : "Completed"}
                      </Badge>
                      {loadingBalances ? (
                        <Skeleton className="h-4 w-24" />
                      ) : (
                        <span className="text-sm text-gray-500">
                          Balance:{" "}
                          {formatETHtoPOL(projectBalances[project.id] || "0")}{" "}
                          POL
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedProject ? (
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>{selectedProject.name}</CardTitle>
                <CardDescription>{selectedProject.details}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge
                      variant={
                        selectedProject.isActive ? "default" : "secondary"
                      }
                    >
                      {selectedProject.isActive ? "Active" : "Completed"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Start Date
                    </p>
                    <p>{selectedProject.startingDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p>{formatETHtoPOL(selectedProject.budget)} POL</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Current Balance
                    </p>
                    {loadingBalances ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <p>
                        {formatETHtoPOL(
                          projectBalances[selectedProject.id] || "0"
                        )}{" "}
                        POL
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Work Status
                    </p>
                    <div className="mt-2 space-y-2">
                      <Badge
                        variant={
                          selectedProject.workConfirmed
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedProject.workConfirmed
                          ? "Work Confirmed"
                          : "Work Not Confirmed"}
                      </Badge>
                      <Badge
                        variant={
                          selectedProject.workApproved ? "default" : "secondary"
                        }
                      >
                        {selectedProject.workApproved
                          ? "Work Approved"
                          : "Pending Approval"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button asChild>
                    <Link to={`/project/${selectedProject.id}`}>
                      View Full Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="col-span-1 lg:col-span-2">
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-gray-500">
                  Select a project to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
