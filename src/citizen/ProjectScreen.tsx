"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3Icon,
  CalendarIcon,
  DollarSignIcon,
  Loader2,
} from "lucide-react";
import { useContract } from "@/BlockChain/ContractProvider";
import type { ProjectDetails } from "@/BlockChain/ContractProvider";
import { ethers } from "ethers";

export default function ProjectsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    contract,
    address,
    loading,
    error,
    connectWallet,
    getAllProjects,
    getContractBalance,
  } = useContract();

  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [contractBalance, setContractBalance] = useState<string>("0");

  // Fetch projects and contract balance
  const refreshData = async () => {
    try {
      if (contract) {
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);

        const balance = await getContractBalance();
        setContractBalance(balance);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
  };

  // Fetch data when contract is connected
  useEffect(() => {
    if (contract) {
      refreshData();
    }
  }, [contract, refreshData]);

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate project statistics
  const ongoingProjects = projects.filter((project) => project.isActive).length;
  const completedProjects = projects.filter(
    (project) => !project.isActive
  ).length;
  const totalBudget = projects.reduce(
    (sum, project) =>
      sum + parseFloat(ethers.utils.formatEther(project.budget)),
    0
  );

  // Wallet connection screen
  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Connect Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to view project details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={connectWallet}
              className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>Connect Wallet</span>
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Public Projects Dashboard
          </h1>
          <div className="text-sm font-medium text-gray-600">
            Connected Wallet: {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <BarChart3Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {projects.length}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ongoing Projects
              </CardTitle>
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {ongoingProjects}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budget
              </CardTitle>
              <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800">
                {totalBudget.toFixed(4)} ETH
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Project Listings</CardTitle>
            <CardDescription>
              Comprehensive view of all blockchain-tracked public projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Input */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search projects by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget (ETH)</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Contractor</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={project.isActive ? "default" : "secondary"}
                          className="px-3 py-1"
                        >
                          {project.isActive ? "Active" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {parseFloat(
                          ethers.utils.formatEther(project.budget)
                        ).toFixed(4)}
                      </TableCell>
                      <TableCell>{project.startingDate}</TableCell>
                      <TableCell>
                        <div>
                          <div>{project.contractorName}</div>
                          <div className="text-xs text-gray-500">
                            {project.contractor.slice(0, 6)}...
                            {project.contractor.slice(-4)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={`${
                              project.isActive
                                ? "text-green-600 border-green-600"
                                : "text-gray-500 border-gray-500"
                            }`}
                          >
                            {project.isActive ? "In Progress" : "Completed"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/Citizen-projects/${project.id}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* No Projects State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects found. Try adjusting your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
