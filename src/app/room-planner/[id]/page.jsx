import { redirect } from 'next/navigation'
import { prisma } from '@prisma/client'
// import RoomPlannerClient from '@/components/room-planner/RoomPlannerClient'

export default async function RoomPlannerPage({ params }) {
  let projectData = {
    name: 'New Project',
    rooms: [],
    currentRoom: null
  }

  if (params.id !== 'create') {
    const project = await prisma.roomPlan.findUnique({
      where: { id: params.id },
      include: { rooms: true }
    })
    
    if (!project) {
      redirect('/room-planner/create')
    }

    projectData = {
      id: project.id,
      name: project.name,
      rooms: project.rooms,
      currentRoom: null
    }
  }

  return "123"
}
