'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteProject } from '@/app/actions/actions'

export function ProjectsTableClient({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects)

  const handleDelete = async (projectId) => {
    try {
      const result = await deleteProject(projectId)
      if (result.success) {
        // Update local state only after successful server action
        setProjects(projects.filter(project => project.id !== projectId))
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>{project.id}</TableCell>
            <TableCell>{project.name}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href={`/projects/${project.id}`}>View</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
