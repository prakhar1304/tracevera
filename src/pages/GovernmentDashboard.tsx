import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContract } from "@/BlockChain/ContractProvider";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BarChart2,
  FileText,
  Users,
  Loader2,
  Send,
  ArrowRight,
  Calendar,
  DollarSign,
  Wallet,
  Download,
  Upload,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

// Utility function to format Ether to a more readable format
const formatEther = (balance: ethers.BigNumber): string => {
  return ethers.utils.formatEther(balance);
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    contract,
    address,
    loading,
    error,
    connectWallet,
    getAllProjects,
    governmentApproveWork,
    sendFundsToContractor,
    depositFunds,
    withdrawFunds,
    getContractBalance,
  } = useContract();

  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [fundAmount, setFundAmount] = useState<string>("");

  // Deposit Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (contract) {
        try {
          const fetchedProjects = await getAllProjects();
          setProjects(fetchedProjects);

          const balance = await getContractBalance();
          setContractBalance(balance);
        } catch (err) {
          console.error("Failed to fetch project data", err);
        }
      }
    };

    if (address) {
      fetchProjectData();
    }
  }, [contract, address]);

  const handleDeposit = async () => {
    try {
      await depositFunds(fundAmount);
      const updatedBalance = await getContractBalance();
      setContractBalance(updatedBalance);
      setFundAmount("");
      setIsDepositModalOpen(false);
    } catch (err) {
      console.error("Deposit failed", err);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawFunds(fundAmount);
      const updatedBalance = await getContractBalance();
      setContractBalance(updatedBalance);
      setFundAmount("");
      setIsWithdrawModalOpen(false);
    } catch (err) {
      console.error("Withdrawal failed", err);
    }
  };

  const handleApproveWork = async (projectId: number) => {
    try {
      await governmentApproveWork(projectId);
      // Refresh project data after approval
      const updatedProjects = await getAllProjects();
      setProjects(updatedProjects);
    } catch (err) {
      console.error("Failed to approve work:", err);
    }
  };

  const handleSendPayment = async (projectId: number, budget: string) => {
    try {
      await sendFundsToContractor(projectId, budget);
      // Refresh project data after sending payment
      const updatedProjects = await getAllProjects();
      setProjects(updatedProjects);
    } catch (err) {
      console.error("Failed to send payment:", err);
    }
  };

  const chartData = projects.map((project) => ({
    name: project.name,
    budget: parseFloat(formatEther(project.budget)),
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
        <div className="flex items-center space-x-4">
          {!address ? (
            <Button onClick={connectWallet}>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            <Badge variant="secondary">{address}</Badge>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
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
              title={`${projects.reduce(
                (sum, project) => sum + parseFloat(formatEther(project.budget)),
                0
              )} ETH`}
            >
              {projects
                .reduce(
                  (sum, project) =>
                    sum + parseFloat(formatEther(project.budget)),
                  0
                )
                .toFixed(2)}{" "}
              ETH
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
              title={`${contractBalance} ETH`}
            >
              {parseFloat(contractBalance).toFixed(8)} ETH
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <Dialog
              open={isDepositModalOpen}
              onOpenChange={setIsDepositModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!address}>
                  <Download className="mr-2 h-4 w-4" /> Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="depositAmount" className="text-right">
                      Amount (ETH)
                    </Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter amount to deposit"
                    />
                  </div>
                  <Button onClick={handleDeposit}>Confirm Deposit</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isWithdrawModalOpen}
              onOpenChange={setIsWithdrawModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!address}>
                  <Upload className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="withdrawAmount" className="text-right">
                      Amount (ETH)
                    </Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter amount to withdraw"
                    />
                  </div>
                  <Button onClick={handleWithdraw}>Confirm Withdrawal</Button>
                </div>
              </DialogContent>
            </Dialog>
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
                        title={`${formatEther(project.budget)} ETH`}
                      >
                        {formatEther(project.budget)} ETH
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{project.startingDate}</span>
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
                  {address && (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => handleApproveWork(project.id)}
                      >
                        Approve Work
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleSendPayment(
                            project.id,
                            formatEther(project.budget)
                          )
                        }
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send Payment
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Project Budgets (ETH)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(2), "ETH"]}
                  />
                  <Bar dataKey="budget" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={() => navigate("/add-project")} disabled={!address}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
};

export default Dashboard;
