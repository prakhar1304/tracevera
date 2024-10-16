"use client"

import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Calendar, User, Wallet, Info, ArrowDownIcon } from 'lucide-react'

interface Project {
  id: number
  name: string
  status: 'ongoing' | 'completed'
  budget: number
  startDate: string
  contractor: string
  contractorWallet: string
  inspectorName: string
  inspectorWallet: string
}

interface Transaction {
  id: number
  type: 'labor' | 'material'
  amount: number
  date: string
  description: string
}

const projectsData: Project[] = [
  {
    id: 1,
    name: "Highway Construction",
    status: "ongoing",
    budget: 1000000,
    startDate: "2023-01-15",
    contractor: "ABC Construction",
    contractorWallet: "0x1234...5678",
    inspectorName: "John Doe",
    inspectorWallet: "0xabcd...efgh"
  },
  // Add more projects as needed
]

const transactionsData: Transaction[] = [
  { id: 1, type: 'labor', amount: 50000, date: '2023-02-01', description: 'Worker payments' },
  { id: 2, type: 'material', amount: 100000, date: '2023-02-15', description: 'Concrete supply' },
  // Add more transactions as needed
]

export default function DetailedProjectScreen() {
  const { id } = useParams<{ id: string }>()
  const project = projectsData.find(p => p.id === Number(id))

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>
  }

  const totalSpent = transactionsData.reduce((sum, transaction) => sum + transaction.amount, 0)
  const remainingFunds = project.budget - totalSpent
  const completionPercentage = (totalSpent / project.budget) * 100

  const laborSpent = transactionsData
    .filter(t => t.type === 'labor')
    .reduce((sum, t) => sum + t.amount, 0)
  const materialSpent = transactionsData
    .filter(t => t.type === 'material')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{project.name}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Overview of the project information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Info className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={project.status === 'ongoing' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
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
                <Calendar className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-gray-500">{project.startDate}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor</p>
                  <p className="text-sm text-gray-500">{project.contractor}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Contractor Wallet</p>
                  <p className="text-sm text-gray-500">{project.contractorWallet}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Inspector</p>
                  <p className="text-sm text-gray-500">{project.inspectorName}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Inspector Wallet</p>
                  <p className="text-sm text-gray-500">{project.inspectorWallet}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium mb-2">Project Progress</p>
                <Progress value={completionPercentage} className="w-full" />
                <p className="text-sm text-gray-500 mt-1">{completionPercentage.toFixed(2)}% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Overview of project finances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Funds Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Remaining Funds</p>
                <p className="text-2xl font-bold">${remainingFunds.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsData.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Badge variant={transaction.type === 'labor' ? 'default' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowDownIcon className="mr-2" />
            Fund Transfer Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Government to Contractor */}
              <rect x="50" y="50" width="150" height="60" rx="5" fill="#e2e8f0" />
              <text x="125" y="80" textAnchor="middle" className="text-sm font-medium">Government</text>
              <text x="125" y="100" textAnchor="middle" className="text-xs">${project.budget.toLocaleString()}</text>
              
              <line x1="200" y1="80" x2="300" y2="80" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Contractor */}
              <rect x="300" y="50" width="150" height="60" rx="5" fill="#bfdbfe" />
              <text x="375" y="80" textAnchor="middle" className="text-sm font-medium">Contractor</text>
              <text x="375" y="100" textAnchor="middle" className="text-xs">${project.budget.toLocaleString()}</text>
              
              {/* Contractor to Labor */}
              <line x1="450" y1="60" x2="550" y2="30" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Contractor to Material Suppliers */}
              <line x1="450" y1="100" x2="550" y2="130" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" />
              
              {/* Labor */}
              <rect x="550" y="0" width="150" height="60" rx="5" fill="#bbf7d0" />
              <text x="625" y="30" textAnchor="middle" className="text-sm font-medium">Labor</text>
              <text x="625" y="50" textAnchor="middle" className="text-xs">${laborSpent.toLocaleString()}</text>
              
              {/* Material Suppliers */}
              <rect x="550" y="100" width="150" height="60" rx="5" fill="#fde68a" />
              <text x="625" y="130" textAnchor="middle" className="text-sm font-medium">Material Suppliers</text>
              <text x="625" y="150" textAnchor="middle" className="text-xs">${materialSpent.toLocaleString()}</text>
              
              {/* Arrow definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}