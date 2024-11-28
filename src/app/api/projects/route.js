import { NextResponse } from 'next/server'
import { prisma } from '@prisma/client'

export async function POST(request) {
  const data = await request.json()
  
  const project = await prisma.roomPlan.create({
    data: {
      name: data.name,
      rooms: {
        create: data.rooms
      }
    }
  })
  
  return NextResponse.json(project)
}

export async function PUT(request) {
  const data = await request.json()
  
  // Delete existing rooms
  await prisma.room.deleteMany({
    where: { roomPlanId: data.id }
  })
  
  // Update project with new rooms
  const project = await prisma.roomPlan.update({
    where: { id: data.id },
    data: {
      name: data.name,
      rooms: {
        create: data.rooms
      }
    }
  })
  
  return NextResponse.json(project)
} 