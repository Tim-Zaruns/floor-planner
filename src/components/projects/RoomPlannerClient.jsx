'use client'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RoomSidebar from '@/components/room-planner/RoomSidebar'
import dynamic from 'next/dynamic'
import { z } from 'zod'
import { saveRoomPlan } from '@/app/actions/actions'

const Canvas = dynamic(() => import('@/components/canvas/shapes/index'), {
  ssr: false,
})

const roomFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  currentRoom: z.string().optional(),
  activeFurniture: z.string().optional().nullable(), // Add this field for UI state
  rooms: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'Room name is required'),
      type: z.enum(['rectangular', 'custom']),
      dimensions: z
        .object({
          width: z.number().min(100).max(2000),
          height: z.number().min(100).max(2000),
          wallThickness: z.number().min(10).max(50),
        })
        .optional(),
      walls: z
        .array(
          z.object({
            id: z.number(),
            length: z.number(),
            direction: z.enum(['up', 'down', 'left', 'right']),
          })
        )
        .optional(),
      points: z.array(
        z.object({
          x: z.number(),
          y: z.number(),
        })
      ),
      furniture: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          x: z.number(),
          y: z.number(),
          width: z.number(),
          height: z.number(),
          color: z.string().optional(),
        })
      ).optional(),
    })
  ),
})

export default function RoomPlannerClient({ initialData }) {

  const methods = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
        id: initialData.id,
        name: initialData.name,
        rooms: initialData.rooms || [],
        currentRoom: null,
    },
  })

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 min-w-0">
          <Canvas />
        </div>
        <div className="w-[400px] shrink-0 overflow-y-auto">
          <RoomSidebar onSave={saveRoomPlan} />
        </div>
      </div>
    </FormProvider>
  )
}
