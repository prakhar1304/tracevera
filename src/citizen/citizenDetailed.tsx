import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from 'lucide-react'
import { useProject } from './components/useProject'
import FundFlowChart from '../components/FundFlowChart'

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const { project, isLoading, error } = useProject(id || '')
  const [showFundFlow, setShowFundFlow] = useState(false)

  if (isLoading) return <div>Loading project details...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!project) return <div>Project not found</div>

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
        <Button onClick={() => setShowFundFlow(!showFundFlow)}>
          {showFundFlow ? 'Hide' : 'Show'} Fund Flow
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{project.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Budget:</strong> ${project.budget.toLocaleString()}</p>
          <p><strong>Contractor:</strong> {project.contractor}</p>
          <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
          <p><strong>Estimated Completion:</strong> {new Date(project.estimatedCompletion).toLocaleDateString()}</p>

          <div>
            <h3 className="text-xl font-semibold mb-2">Project Progress</h3>
            <Progress value={project.progress} className="w-full" />
            <p className="text-center mt-2">{project.progress}% Complete</p>
          </div>

          {showFundFlow && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Fund Flow</h3>
              <FundFlowChart transactions={project.transactions} />
            </div>
          )}

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="milestones">
              <AccordionTrigger>Milestones</AccordionTrigger>
              <AccordionContent>
                {project.milestones.map((milestone, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>{milestone.description}</strong></p>
                    <p>Status: {milestone.completed ? 'Completed' : 'Pending'}</p>
                    {milestone.completed && <p>Completion Date: {new Date(milestone.completionDate).toLocaleDateString()}</p>}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="inspections">
              <AccordionTrigger>Inspector Approvals</AccordionTrigger>
              <AccordionContent>
                {project.inspectorApprovals.map((approval, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>{approval.inspector}</strong> - {new Date(approval.date).toLocaleDateString()}</p>
                    <p>{approval.comments}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="documents">
              <AccordionTrigger>Documents and Reports</AccordionTrigger>
              <AccordionContent>
                {project.documents.map((doc, index) => (
                  <div key={index} className="mb-2">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {doc.name}
                    </a>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}