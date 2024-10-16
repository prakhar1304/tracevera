import { useState, useEffect } from 'react'

interface Project {
  id: string
  name: string
  status: 'ongoing' | 'completed' | 'pending'
  location: string
  progress: number
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { projects, isLoading, error }
}