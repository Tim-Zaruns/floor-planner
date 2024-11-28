'use client'

import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RectangularRoomForm } from './RectangularRoomForm'
import { CustomRoomForm } from './CustomRoomForm'
import { calculateArea } from '@/lib/utils/roomCalculations'
import { Input } from '@/components/ui/input'
import { Trash2, Save, Plus } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { saveRoomPlan } from '@/app/actions/actions'
import { useToast } from '@/hooks/use-toast'
import { useFurniture } from '@/hooks/useFurniture'

function RoomSidebar() {
  const { getValues, formState, trigger, control, setValue } = useFormContext()
  const { furniture, handleFurnitureChange, selectedId, handleFurnitureDelete } = useFurniture()
  const rooms = getValues('rooms') || []
  const currentRoom = getValues('currentRoom')
  const currentRoomData = rooms.find((room) => room.id === currentRoom)
  const currentRoomIndex = rooms.findIndex((room) => room.id === currentRoom)
  const { toast } = useToast()

  // Get selected furniture data
  const selectedFurniture = furniture.find((f) => f.id === selectedId)

  useEffect(() => {
    console.log('selectedId in sidebar:', selectedId)
  }, [selectedId])

  // Project actions
  const handleSaveProject = async () => {
    const isValid = await trigger()

    // Add detailed error logging
    if (!isValid) {
      console.error('Form validation failed')
      console.log('Validation errors:', formState.errors)
      // Optional: Log specific field errors
      Object.entries(formState.errors).forEach(([field, error]) => {
        console.log(`${field}:`, error.message)
        // If nested fields have errors
        if (error.type === 'object' && error.fields) {
          console.log(`${field} nested errors:`, error.fields)
        }
      })
      return
    }

    const formValues = getValues()

    try {
      const result = await saveRoomPlan(formValues)
      if (!result.success) {
        throw new Error(result.error)
      } else {
        toast({
          title: 'Project saved',
          description: 'Your project has been saved successfully',
        })
      }
      // Optional: Show success toast/message
    } catch (error) {
      console.error('Failed to save project:', error)
      // Optional: Show error toast/message
    }
  }

  const handleAddRectangularRoom = () => {
    const newRoom = {
      id: Date.now().toString(),
      name: `Room ${rooms.length + 1}`,
      type: 'rectangular',
      dimensions: {
        width: 500,
        height: 400,
        wallThickness: 20,
      },
      // Add points for rectangular room
      points: [
        { x: 0, y: 0 },
        { x: 500, y: 0 },
        { x: 500, y: 400 },
        { x: 0, y: 400 },
      ],
    }
    console.log('Adding new room:', newRoom)
    const updatedRooms = [...rooms, newRoom]
    setValue('rooms', updatedRooms)
    setValue('currentRoom', newRoom.id)
  }

  const handleAddCustomRoom = () => {
    const newRoom = {
      id: Date.now().toString(),
      name: `Room ${rooms.length + 1}`,
      type: 'custom',
      walls: [],
      points: [{ x: 0, y: 0 }],
    }
    const updatedRooms = [...rooms, newRoom]
    setValue('rooms', updatedRooms)
    setValue('currentRoom', newRoom.id)
  }

  const handleDeleteRoom = (roomId) => {
    const newRooms = rooms.filter((room) => room.id !== roomId)
    setValue('rooms', newRooms)
    if (currentRoom === roomId) {
      setValue('currentRoom', null)
    }
  }

  const getRoomArea = (room) => {
    if (!room) return 0
    return calculateArea(room)
  }

  const handleAddFurniture = () => {
    const roomIndex = rooms.findIndex((r) => r.id === currentRoom)
    if (roomIndex === -1) return

    const newFurniture = {
      id: Date.now().toString(),
      type: 'furniture',
      label: 'New Furniture',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      color: '#ddd',
    }

    const currentFurniture = getValues(`rooms.${roomIndex}.furniture`) || []
    setValue(`rooms.${roomIndex}.furniture`, [...currentFurniture, newFurniture])
  }

  // Add handler for furniture label change
  const handleLabelChange = (e) => {
    if (!selectedFurniture) return

    handleFurnitureChange({
      ...selectedFurniture,
      label: e.target.value,
    })
  }

  return (
    <div className="w-[400px] h-screen border-l p-6 overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle>Room Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="project">
              <AccordionTrigger>Project Settings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProject} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Project
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Room List with Areas */}
          <div className="flex gap-2 flex-wrap mb-4">
            {rooms.map((room) => (
              <Badge
                key={room.id}
                variant={currentRoom === room.id ? 'default' : 'outline'}
                className="cursor-pointer group relative"
                onClick={() => setValue('currentRoom', room.id)}
              >
                {room.name} ({getRoomArea(room).toFixed(2)}m²)
                <button
                  className="ml-2 opacity-0 group-hover:opacity-100 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteRoom(room.id)
                  }}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>

          {/* Add Room Buttons */}
          <div className="flex flex-col gap-2 mb-6">
            <Button onClick={handleAddRectangularRoom}>Add Rectangular Room</Button>
            <Button onClick={handleAddCustomRoom}>Add Custom Room</Button>
          </div>

          {/* Room Editor with Area Display */}
          {currentRoomData && (
            <div className="space-y-4">
              {/* Room Name Input with Delete Button */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`rooms.${currentRoomIndex}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Name</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteRoom(currentRoomData.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Area Display */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Room Area</div>
                <div className="text-2xl font-bold">
                  {getRoomArea(currentRoomData).toFixed(2)}m²
                </div>
              </div>

              {currentRoomData.type === 'rectangular' && (
                <RectangularRoomForm roomIndex={currentRoomIndex} />
              )}
              {currentRoomData.type === 'custom' && <CustomRoomForm roomIndex={currentRoomIndex} />}

              {/* Add Furniture Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Furniture</h3>
                <Button onClick={handleAddFurniture} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Furniture
                </Button>
              </div>
            </div>
          )}

          {/* Selected Furniture Editor */}
          {selectedId && (
            <div className="space-y-4 mt-4">
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Selected Furniture</h3>
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          value={furniture.find(f => f.id === selectedId)?.label || ''}
                          onChange={(e) => handleFurnitureChange(selectedId, { label: e.target.value })}
                          placeholder="Furniture name"
                        />
                      </FormControl>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleFurnitureDelete(selectedId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RoomSidebar
