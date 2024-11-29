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

export default function ProjectsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    projects,
    contractBalance,
    loading,
    error,
    isConnected,
    connectWallet,
    refreshData,
  } = useContract();

  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ongoingProjects = projects.filter((project) => project.isActive).length;
  const completedProjects = projects.filter(
    (project) => !project.isActive
  ).length;
  const totalBudget = projects.reduce(
    (sum, project) => sum + parseFloat(project.budget),
    0
  );

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
            <button
              onClick={connectWallet}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Connect Wallet
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Public Projects Overview</h1>
          <div className="text-sm text-gray-500">
            Contract Balance: {parseFloat(contractBalance).toFixed(4)} ETH
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
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
                {totalBudget.toFixed(4)} ETH
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project List</CardTitle>
            <CardDescription>
              Live blockchain data of all public projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget (ETH)</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Contractor</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={project.isActive ? "default" : "secondary"}
                        >
                          {project.isActive ? "Active" : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {parseFloat(project.budget).toFixed(4)}
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
                            variant={
                              project.workConfirmed ? "success" : "default"
                            }
                          >
                            {project.workConfirmed
                              ? "Work Confirmed"
                              : "In Progress"}
                          </Badge>
                          {project.workConfirmed && (
                            <Badge
                              variant={
                                project.workApproved ? "success" : "default"
                              }
                            >
                              {project.workApproved
                                ? "Approved"
                                : "Pending Approval"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/Citizen-projects/${project.id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View Details
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
