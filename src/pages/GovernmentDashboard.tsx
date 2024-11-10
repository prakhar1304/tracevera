import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContract } from "@/BlockChain/ContractProvider";
import { formatBalance, parseBalance } from "@/utils/formatUtils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PlusCircle,
  Wallet,
  BarChart2,
  FileText,
  Users,
  Loader2,
  CheckCircle2,
  XCircle,
  Send,
  ArrowRight,
  Calendar,
  DollarSign,
} from "lucide-react";
import ConnectWalletButton from "@/components/ConnectWallet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    contractBalance,
    loading,
    error,
    success,
    isConnected,
    refreshData,
    approveWork,
    sendPayment,
  } = useContract();

  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected]);

  const handleApproveWork = async (projectId: number) => {
    try {
      await approveWork(projectId);
      await refreshData();
    } catch (err) {
      console.error("Failed to approve work:", err);
    }
  };

  const handleSendPayment = async (projectId: number, budget: string) => {
    try {
      const amountInWei = parseBalance(budget);
      await sendPayment(projectId, amountInWei);
      await refreshData();
    } catch (err) {
      console.error("Failed to send payment:", err);
    }
  };

  const chartData = projects.map((project) => ({
    name: project.name,
    budget: parseFloat(formatBalance(project.budget)),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const activeProjects = projects.filter((p) => p.isActive);
  const completedProjects = projects.filter((p) => !p.isActive);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Government Project Dashboard</h1>
        <div className="w-48">
          <ConnectWalletButton />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
            <p className="text-sm text-muted-foreground">
              Active: {activeProjects.length} | Completed:{" "}
              {completedProjects.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-xl font-bold truncate"
              title={`${formatBalance(
                projects.reduce(
                  (sum, project) => sum + parseFloat(project.budget),
                  0
                )
              )} POL`}
            >
              {formatBalance(
                projects.reduce(
                  (sum, project) => sum + parseFloat(project.budget),
                  0
                )
              )}{" "}
              POL
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contract Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-xl font-bold truncate"
              title={`${formatBalance(contractBalance)} POL`}
            >
              {formatBalance(contractBalance)} POL
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                projects.filter((p) => p.workConfirmed && !p.workApproved)
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="projects" className="px-4 py-2">
            <FileText className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="chart" className="px-4 py-2">
            <BarChart2 className="mr-2 h-4 w-4" />
            Budget Chart
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant={project.isActive ? "default" : "secondary"}>
                      {project.isActive ? "Active" : "Completed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="truncate" title={project.contractorName}>
                        {project.contractorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span
                        className="truncate"
                        title={`${formatBalance(project.budget)} POL`}
                      >
                        {formatBalance(project.budget)} POL
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{project.startingDate}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span>Work Confirmed:</span>
                        {project.workConfirmed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Work Approved:</span>
                        {project.workApproved ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/gov-project/${project.id}`)}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {project.workConfirmed && !project.workApproved && (
                    <Button
                      className="w-full"
                      onClick={() => handleApproveWork(project.id)}
                    >
                      Approve Work
                    </Button>
                  )}
                  {project.workConfirmed && project.workApproved && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleSendPayment(
                          project.id,
                          formatBalance(project.budget)
                        )
                      }
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Payment
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Project Budgets (POL)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value: number) =>
                      formatBalance(String(value))
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatBalance(String(value)),
                      "POL",
                    ]}
                  />
                  <Bar dataKey="budget" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={() => navigate("/add-project")} disabled={!isConnected}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
};

export default Dashboard;
