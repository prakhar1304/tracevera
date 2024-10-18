"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Calendar,
  User,
  Wallet,
  Info,
  ArrowRight,
} from "lucide-react";
import { useContractService } from "../BlockChain/useContractService";
import { ethers } from "ethers";

export default function ProjectDetail() {
  const { id } = useParams();
  const {
    contractState,
    isContractor,
    getContractBalance,
    getContractorBalance,
    confirmWorkDone,
  } = useContractService();

  const [contractBalance, setContractBalance] = useState("0");
  const [contractorBalance, setContractorBalance] = useState("0");

  useEffect(() => {
    const fetchBalances = async () => {
      const balance = await getContractBalance();
      const contractorBal = await getContractorBalance();
      setContractBalance(balance);
      setContractorBalance(contractorBal);
    };
    fetchBalances();
  }, [getContractBalance, getContractorBalance]);

  if (!contractState) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  const handleConfirmWorkDone = async () => {
    if (!isContractor) {
      alert("Only the contractor can confirm work done");
      return;
    }
    await confirmWorkDone();
    // Refresh balances after confirming work
    const balance = await getContractBalance();
    const contractorBal = await getContractorBalance();
    setContractBalance(balance);
    setContractorBalance(contractorBal);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Details</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{contractState.projectName}</CardTitle>
            <CardDescription>{contractState.projectDetails}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor</p>
                  <p className="text-sm text-gray-500">
                    {contractState.contractorName}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Wallet Address</p>
                  <p className="text-sm text-gray-500">{`${contractState.contractor.slice(
                    0,
                    6
                  )}...${contractState.contractor.slice(-4)}`}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Project Budget</p>
                  <p className="text-sm text-gray-500">
                    {ethers.utils.formatEther(contractState.projectBudget)} ETH
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contract Balance</p>
                  <p className="text-sm text-gray-500">{contractBalance} ETH</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor Balance</p>
                  <p className="text-sm text-gray-500">
                    {contractorBalance} ETH
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleConfirmWorkDone} disabled={!isContractor}>
              Confirm Work Done
            </Button>
          </CardFooter>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Project Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Government</p>
                <p>{`${contractState.government.slice(
                  0,
                  6
                )}...${contractState.government.slice(-4)}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Inspector</p>
                <p>{`${contractState.inspector.slice(
                  0,
                  6
                )}...${contractState.inspector.slice(-4)}`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contractor</p>
                <p>{`${contractState.contractor.slice(
                  0,
                  6
                )}...${contractState.contractor.slice(-4)}`}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
