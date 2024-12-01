import { z } from 'zod'

export const roomFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  currentRoom: z.string().optional(),
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
            length: z.number().min(10),
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
    })
  ),
})
