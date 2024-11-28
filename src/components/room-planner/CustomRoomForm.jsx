import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import { X } from 'lucide-react'
import { useState } from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

export function CustomRoomForm({ roomIndex }) {
  const { watch, setValue } = useFormContext()
  const walls = watch(`rooms.${roomIndex}.walls`) || []

  // Local state for new wall input
  const [newWall, setNewWall] = useState({
    length: '',
    direction: 'right',
  })

  const handleAddWall = () => {
    if (!newWall.length) return

    const length = Number(newWall.length)
    const wall = {
      id: Date.now(),
      length,
      direction: newWall.direction,
    }

    // Add wall to walls array
    const updatedWalls = [...walls, wall]
    setValue(`rooms.${roomIndex}.walls`, updatedWalls)

    // Calculate and update points
    const currentPoints = watch(`rooms.${roomIndex}.points`) || [{ x: 0, y: 0 }]
    const lastPoint = currentPoints[currentPoints.length - 1]
    let newPoint = { x: lastPoint.x, y: lastPoint.y }

    switch (wall.direction) {
      case 'right':
        newPoint.x += length
        break
      case 'left':
        newPoint.x -= length
        break
      case 'down':
        newPoint.y += length
        break
      case 'up':
        newPoint.y -= length
        break
    }

    setValue(`rooms.${roomIndex}.points`, [...currentPoints, newPoint])

    // Reset input
    setNewWall({ length: '', direction: 'right' })
  }

  const handleDeleteWall = (index) => {
    const newWalls = walls.filter((_, i) => i !== index)
    setValue(`rooms.${roomIndex}.walls`, newWalls)

    // Recalculate points
    const points = [{ x: 0, y: 0 }]
    newWalls.forEach((wall) => {
      const lastPoint = points[points.length - 1]
      let newPoint = { x: lastPoint.x, y: lastPoint.y }

      switch (wall.direction) {
        case 'right':
          newPoint.x += wall.length
          break
        case 'left':
          newPoint.x -= wall.length
          break
        case 'down':
          newPoint.y += wall.length
          break
        case 'up':
          newPoint.y -= wall.length
          break
      }
      points.push(newPoint)
    })

    setValue(`rooms.${roomIndex}.points`, points)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormItem>
          <FormLabel>Wall Length (cm)</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="10"
              placeholder="Enter wall length"
              value={newWall.length}
              onChange={(e) => setNewWall((prev) => ({ ...prev, length: e.target.value }))}
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Direction</FormLabel>
          <Select
            value={newWall.direction}
            onValueChange={(value) => setNewWall((prev) => ({ ...prev, direction: value }))}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="right">Right →</SelectItem>
              <SelectItem value="down">Down ↓</SelectItem>
              <SelectItem value="left">Left ←</SelectItem>
              <SelectItem value="up">Up ↑</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        <Button type="button" className="w-full" onClick={handleAddWall}>
          Add Wall
        </Button>
      </div>

      {/* Walls List */}
      {walls.length > 0 && (
        <div className="space-y-2">
          <FormLabel>Walls</FormLabel>
          <div className="border rounded-lg">
            {walls.map((wall, index) => (
              <div
                key={wall.id}
                className="flex items-center justify-between p-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <DragHandleDots2Icon className="h-5 w-5 text-gray-500" />
                  <span>
                    {wall.length}cm {getDirectionSymbol(wall.direction)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteWall(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getDirectionSymbol(direction) {
  switch (direction) {
    case 'right':
      return '→'
    case 'down':
      return '↓'
    case 'left':
      return '←'
    case 'up':
      return '↑'
    default:
      return ''
  }
}
