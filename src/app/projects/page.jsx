import { prisma } from '@/lib/prisma'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog'

export default async function ProjectsPage() {
  const projects = await prisma.roomPlan.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="py-10 max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border rounded-lg">
          <p className="text-muted-foreground mb-4">No projects found</p>
        </div>
      ) : (
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
                  <Button variant="ghost" asChild>
                    <Link
                      className="text-sm font-medium text-muted-foreground"
                      href={`/projects/${project.id}`}
                    >
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
