"use client"

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart3Icon, CalendarIcon, DollarSignIcon } from "lucide-react"

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
  {
    id: 2,
    name: "School Renovation",
    status: "completed",
    budget: 500000,
    startDate: "2022-11-01",
    contractor: "XYZ Builders",
    contractorWallet: "0x8765...4321",
    inspectorName: "Jane Smith",
    inspectorWallet: "0xijkl...mnop"
  },
  // Add more projects as needed
]

export default function ProjectsScreen() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProjects = projectsData.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const ongoingProjects = projectsData.filter(project => project.status === 'ongoing').length
  const completedProjects = projectsData.filter(project => project.status === 'completed').length
  const totalBudget = projectsData.reduce((sum, project) => sum + project.budget, 0)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Projects Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ongoingProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project List</CardTitle>
            <CardDescription>Overview of all projects</CardDescription>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'ongoing' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${project.budget.toLocaleString()}</TableCell>
                    <TableCell>{project.startDate}</TableCell>
                    <TableCell>{project.contractor}</TableCell>
                    <TableCell>
                      <Link to={`/Citizen-projects/${project.id}`} className="text-blue-500 hover:underline">
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}