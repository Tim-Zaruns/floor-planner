import { useFormContext } from 'react-hook-form'
import { useCallback, useMemo } from 'react'

export function useFurniture() {
  const { watch, setValue, getValues } = useFormContext()

  const currentRoom = watch('currentRoom')
  const rooms = watch('rooms')

  // Memoize roomIndex since it's a calculation based on watched values
  const roomIndex = useMemo(
    () => rooms?.findIndex((room) => room.id === currentRoom),
    [rooms, currentRoom]
  )

  // Watch the necessary fields
  const activeFurniture = watch('activeFurniture') // New field for selected furniture
  const furniture = roomIndex !== -1 ? watch(`rooms.${roomIndex}.furniture`) || [] : []

  const handleFurnitureChange = useCallback(
    (id, newAttrs) => {
      if (roomIndex === -1) return

      const furnitureIndex = furniture.findIndex((f) => f.id === id)
      if (furnitureIndex === -1) return

      const updatedFurniture = [...furniture]
      updatedFurniture[furnitureIndex] = {
        ...furniture[furnitureIndex],
        ...newAttrs,
      }

      setValue(`rooms.${roomIndex}.furniture`, updatedFurniture, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
    [furniture, roomIndex, setValue]
  )

  const handleFurnitureDelete = useCallback(
    (id) => {
      if (!id || roomIndex === -1) return false

      const newFurniture = furniture.filter((item) => item.id !== id)
      setValue(`rooms.${roomIndex}.furniture`, newFurniture, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setValue('activeFurniture', null)
      return true
    },
    [furniture, roomIndex, setValue]
  )

  const checkDeselect = useCallback(
    (e) => {
      if (e.target === e.target.getStage()) {
        setValue('activeFurniture', null)
      }
    },
    [setValue]
  )

  return {
    furniture,
    selectedId: activeFurniture,
    setSelectedId: (id) => setValue('activeFurniture', id),
    handleFurnitureChange,
    handleFurnitureDelete,
    checkDeselect,
    currentRoom,
    activeRoom: rooms?.find((room) => room.id === currentRoom),
  }
}
