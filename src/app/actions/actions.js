'use server'

import { prisma } from '@/lib/prisma'

export async function createProject(data) {
  const project = await prisma.roomPlan.create({
    data: {
      name: data.get('name'),
    }
  })
  
  return project
}


export async function saveRoomPlan(formData) {
    // const { id, name, rooms } = formData

    console.log("formData", formData)
  
    try {
      await prisma.roomPlan.update({
        where: { id: formData.id },
        data: {
          name: formData.name,
          rooms: formData.rooms
        }
      })
  
      return { success: true }
    } catch (error) {
      console.error('Failed to save room plan:', error)
      return { success: false, error: error.message }
    }
  }