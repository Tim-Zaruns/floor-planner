'use client'
import dynamic from 'next/dynamic'
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import RoomSidebar from '@/components/room-planner/RoomSidebar'
import { z } from "zod"

const Canvas = dynamic(() => import('@/components/canvas/shapes/index'), {
  ssr: false
})

const roomFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  currentRoom: z.string().optional(),
  rooms: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Room name is required"),
    type: z.enum(['rectangular', 'custom']),
    dimensions: z.object({
      width: z.number().min(100).max(2000),
      height: z.number().min(100).max(2000),
      wallThickness: z.number().min(10).max(50)
    }).optional(),
    walls: z.array(z.object({
      id: z.number(),
      length: z.number().min(10),
      direction: z.enum(['up', 'down', 'left', 'right'])
    })).optional(),
    points: z.array(z.object({
      x: z.number(),
      y: z.number()
    }))
  }))
})

export default function RoomPlanner() {
  const methods = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      rooms: [],
      currentRoom: null
    }
  })

  const { watch } = methods
  const rooms = watch('rooms') || []
  const currentRoom = watch('currentRoom')
  const currentRoomData = rooms.find(room => room.id === currentRoom)

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen">
        <div className="flex-1">
          <Canvas 
            roomData={currentRoomData}
          />
        </div>
        <RoomSidebar />
      </div>
    </FormProvider>
  )
}
