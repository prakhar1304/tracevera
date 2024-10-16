import { useState, useEffect } from 'react'

interface Milestone {
  description: string
  completed: boolean
  completionDate?: string
}

interface InspectorApproval {
  inspector: string
  
  date: string
  comments: string
}

interface Document {
  name: string
  url: string
}

interface Transaction {
  from: string
  to: string
  amount: number
  date: string
}

interface Project {
  id: string
  name: string
  status: 'ongoing' | 'completed' | 'pending'
  location: string
  budget: number
  contractor: string
  startDate: string
  estimatedCompletion: string
  progress: number
  milestones: Milestone[]
  inspectorApprovals: InspectorApproval[]
  documents: Document[]
  transactions: Transaction[]
}

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch project details')
        }
        const data = await response.json()
        setProject(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id])

  return { project, isLoading, error }
}