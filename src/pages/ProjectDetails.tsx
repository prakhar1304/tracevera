"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Calendar, User, Wallet, Info, ArrowRight } from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)

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
      transactions: [
        { id: 1, date: '2023-01-15', type: 'Fund Request', amount: 200000, recipient: 'Project Fund' },
        { id: 2, date: '2023-02-01', type: 'Labor Payment', amount: 50000, recipient: 'Construction Team A' },
        { id: 3, date: '2023-02-15', type: 'Material Purchase', amount: 100000, recipient: 'ABC Suppliers Inc.' },
        { id: 4, date: '2023-03-01', type: 'Labor Payment', amount: 60000, recipient: 'Construction Team B' },
        { id: 5, date: '2023-03-15', type: 'Material Purchase', amount: 80000, recipient: 'XYZ Materials Ltd.' },
      ]
    }
    setProject(mockProject)
  }, [id])

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  const handleRequestFund = () => {
    console.log('Requesting fund...')
    // Implement fund request logic here
  }

  const handlePayLabor = () => {
    console.log('Paying labor...')
    // Implement labor payment logic here
  }

  const handlePaySupplier = () => {
    console.log('Paying material supplier...')
    // Implement supplier payment logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Details</h1>
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
          <CardFooter className="flex justify-between">
            <Button onClick={handleRequestFund}>Request Fund</Button>
            <Button onClick={handlePayLabor}>Pay Labor</Button>
            <Button onClick={handlePaySupplier}>Pay Material Supplier</Button>
          </CardFooter>
        </Card>
        <Card className="col-span-1">
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
                  <TableHead>Recipient</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.recipient}</TableCell>
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
  )
}