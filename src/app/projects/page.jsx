import { prisma } from '@/lib/prisma'
import { ProjectsTableClient } from '@/components/projects/ProjectsTableClient'
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
      <ProjectsTableClient initialProjects={projects} />
    </div>
  )
}
