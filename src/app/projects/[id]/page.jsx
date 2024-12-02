import { prisma } from '@/lib/prisma'
import RoomPlannerClient from '@/components/projects/RoomPlannerClient'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
// Optional loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    Loading project...
  </div>
)

export default async function ProjectPage({ params }) {
  const { id } = await params

  const project = await prisma.roomPlan.findUnique({
    where: { id: id },
  })

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <Suspense fallback={<Loading />}>
      <RoomPlannerClient initialData={project} />
    </Suspense>
  )
}
