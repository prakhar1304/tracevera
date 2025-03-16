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

export default function ContractorDashboard() {
  const {
    address: currentAddress,
    getAllProjects,
    loading: contractLoading,
    error,
  } = useContract();

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch projects for the current contractor
  useEffect(() => {
    const fetchProjects = async () => {
      if (!currentAddress) return;

      try {
        const allProjects = await getAllProjects();
        const contractorProjects = allProjects.filter(
          (project) =>
            project.contractor.toLowerCase() === currentAddress.toLowerCase()
        );

        setProjects(contractorProjects);

        // Select first project by default if exists
        if (contractorProjects.length > 0) {
          setSelectedProject(contractorProjects[0]);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchProjects();
  }, [currentAddress, getAllProjects]);

  // Compute dashboard statistics
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter((p) => p.isActive).length;
  const totalBudget = projects.reduce(
    (sum, p) => sum + parseFloat(p.budget?.toString() || "0"),
    0
  );

  // Loading state
  if (contractLoading || isInitializing) {
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
          </CardContent>
        </Card>
      </div>
    );
  }

  // No projects state
  if (projects.length === 0) {
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Utility to format budget/balance
  const formatETHtoPOL = (ethValue: string | number) => {
    if (!ethValue) return "0.00";
    return parseFloat(ethValue.toString()).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contractor Dashboard</h1>

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
                {projects.map((project) => (
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
                      <span className="text-sm text-gray-500">
                        Budget: {formatETHtoPOL(project.budget)} POL
                      </span>
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
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">
                      Contractor Info
                    </p>
                    <p>{selectedProject.contractorName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {selectedProject.contractor}
                    </p>
                  </div>
                  <div className="col-span-2 mt-4">
                    <Button asChild>
                      <Link to={`/project/${selectedProject.id}`}>
                        View Full Project Details
                      </Link>
                    </Button>
                  </div>
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
