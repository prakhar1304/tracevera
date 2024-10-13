"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Calendar, User, Wallet, Info, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectDetailGov() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [fundAmount, setFundAmount] = useState('')
  const [inspectionResult, setInspectionResult] = useState('')

  useEffect(() => {
    // In a real application, you would fetch the project details from your API or smart contract here
    // For this example, we'll use mock data
    const mockProject = {
      id: parseInt(id),
      name: `Highway Expansion Project ${id}`,
      details: 'Expansion of the main highway to reduce traffic congestion and improve transportation infrastructure.',
      contractorName: 'John Doe Construction Co.',
      walletAddress: '0x1234567890123456789012345678901234567890',
      budget: 1000000,
      spent: 450000,
      startingDate: '2023-01-01',
      endDate: '2024-06-30',
      status: 'ongoing',
      progress: 45,
      inspector: {
        name: 'Jane Smith',
        lastInspection: '2023-05-15',
        report: 'All work is proceeding according to plan. No issues found.'
      },
      transactions: [
        { id: 1, date: '2023-01-15', type: 'Fund Request', amount: 200000, recipient: 'Project Fund', status: 'Approved' },
        { id: 2, date: '2023-02-01', type: 'Labor Payment', amount: 50000, recipient: 'Construction Team A', status: 'Completed' },
        { id: 3, date: '2023-02-15', type: 'Material Purchase', amount: 100000, recipient: 'ABC Suppliers Inc.', status: 'Completed' },
        { id: 4, date: '2023-03-01', type: 'Labor Payment', amount: 60000, recipient: 'Construction Team B', status: 'Completed' },
        { id: 5, date: '2023-03-15', type: 'Material Purchase', amount: 80000, recipient: 'XYZ Materials Ltd.', status: 'Completed' },
      ]
    }
    setProject(mockProject)
  }, [id])

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const handleGiveFund = () => {
    console.log(`Giving fund of $${fundAmount}...`)
    // Implement fund giving logic here
    setFundAmount('')
  }

  const handleConfirmWorkDone = () => {
    console.log('Confirming work done...')
    // Implement work confirmation logic here
    setInspectionResult('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Government Project Oversight</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>{project.details}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor</p>
                  <p className="text-sm text-gray-500">{project.contractorName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Wallet Address</p>
                  <p className="text-sm text-gray-500">{`${project.walletAddress.slice(0, 6)}...${project.walletAddress.slice(-4)}`}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-sm text-gray-500">${project.budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Spent</p>
                  <p className="text-sm text-gray-500">${project.spent.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-gray-500">{project.startingDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-gray-500">{project.endDate}</p>
                </div>
              </div>
              <div className="flex items-center col-span-2">
                <Info className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant="outline" className="mt-1">
                    {project.status}
                  </Badge>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium mb-2">Progress</p>
                <Progress value={project.progress} className="w-full" />
                <p className="text-sm text-gray-500 mt-1">{project.progress}% Complete</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Give Fund</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Give Fund</DialogTitle>
                    <DialogDescription>Enter the amount to fund this project.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fundAmount" className="text-right">Amount</Label>
                      <Input
                        id="fundAmount"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleGiveFund}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Confirm Work Done</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Work Completion</DialogTitle>
                    <DialogDescription>Enter the inspection result to confirm work completion.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="inspectionResult" className="text-right">Result</Label>
                      <Input
                        id="inspectionResult"
                        value={inspectionResult}
                        onChange={(e) => setInspectionResult(e.target.value)}
                        placeholder="Enter inspection result"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleConfirmWorkDone}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
        <div className="col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Inspector Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{project.inspector.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Last Inspection:</span>
                  <span>{project.inspector.lastInspection}</span>
                </div>
                <div>
                  <p className="font-medium mb-1">Report:</p>
                  <p className="text-sm text-gray-500">{project.inspector.report}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {project.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {transaction.status === 'Approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : transaction.status === 'Pending' ? (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}