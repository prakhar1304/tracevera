"use client"

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart3Icon, DollarSignIcon, CalendarIcon } from "lucide-react"

export default function ContractorDashboard() {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project A', status: 'ongoing', budget: 100000, spent: 50000, progress: 50, description: 'This is Project A', location: 'City A', startDate: '2023-01-01', endDate: '2023-12-31' },
    { id: 3, name: 'Project C', status: 'ongoing', budget: 150000, spent: 75000, progress: 50, description: 'This is Project C', location: 'City C', startDate: '2023-03-01', endDate: '2024-02-29' },
  ]);

  const [selectedProject, setSelectedProject] = useState(projects[0])

  const totalProjects = projects.length
  const ongoingProjects = projects.filter(p => p.status === 'ongoing').length
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Contractor Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
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
                      selectedProject.id === project.id ? 'bg-primary/10' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.location}</p>
                    <Progress value={project.progress} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>{selectedProject.name}</CardTitle>
              <CardDescription>{selectedProject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p>{selectedProject.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedProject.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p>{selectedProject.startDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p>{selectedProject.endDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Budget</p>
                  <p>${selectedProject.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Spent</p>
                  <p>${selectedProject.spent.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Progress</p>
                  <Progress value={selectedProject.progress} className="mt-2" />
                  <p className="text-sm text-gray-500 mt-1">{selectedProject.progress}% Complete</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <Link to={`/project/${selectedProject.id}`}>View Full Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}