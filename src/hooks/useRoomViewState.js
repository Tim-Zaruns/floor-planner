import { useState, useEffect, useRef, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

/**
 * Custom hook to manage canvas view states for multiple rooms
 * Handles zooming, panning, and position memory for each room
 *
 * @param {Object} stageSize - The canvas container dimensions
 * @param {number} stageSize.width - Container width
 * @param {number} stageSize.height - Container height
 */
export default function useRoomViewState(stageSize) {
  // Reference to the Konva Group containing the room and furniture
  const groupRef = useRef()

  // Access to the form context to watch current room changes
  const { watch } = useFormContext()
  const currentRoom = watch('currentRoom')

  // Store view states for all rooms
  // Format: {
  //   roomId1: { position: {x, y}, scale: number, groupPosition: {x, y} },
  //   roomId2: { position: {x, y}, scale: number, groupPosition: {x, y} },
  // }
  const [roomViewStates, setRoomViewStates] = useState({})

  // Default view state for new rooms
  const defaultView = {
    position: { x: 0, y: 0 }, // Stage position (for panning)
    scale: 1, // Zoom level
    groupPosition: {
      // Room group position (for dragging)
      x: stageSize.width / 2, // Center horizontally
      y: stageSize.height / 2, // Center vertically
    },
  }

  // Calculate current view state with memoization to prevent unnecessary recalculations
  const currentView = useMemo(() => {
    if (!currentRoom) return defaultView

    // Return existing room state or create new centered state
    return roomViewStates[currentRoom] ?? {
      ...defaultView,
      groupPosition: {
        x: stageSize.width / 2,
        y: stageSize.height / 2,
      },
    }
  }, [currentRoom, roomViewStates, stageSize.width, stageSize.height])

  // Update group position when switching rooms
  useEffect(() => {
    if (!groupRef.current || !currentRoom) return
    groupRef.current.position(currentView.groupPosition)
  }, [currentRoom, currentView.groupPosition])

  // Initialize new room state when switching to an unseen room
  useEffect(() => {
    if (currentRoom && !roomViewStates[currentRoom]) {
      setRoomViewStates(prev => ({
        ...prev,
        [currentRoom]: {
          ...defaultView,
          groupPosition: {
            x: stageSize.width / 2,
            y: stageSize.height / 2,
          },
        },
      }))
    }
  }, [currentRoom, stageSize])

  /**
   * Handle mouse wheel events for zooming
   * Zooms towards/away from the mouse pointer position
   */
  const handleWheel = (e) => {
    e.evt.preventDefault()
    if (!currentRoom) return

    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()
    const scaleBy = 1.1 // Zoom factor per wheel tick

    // Calculate new scale based on wheel direction
    const newScale =
      e.evt.deltaY < 0
        ? currentView.scale * scaleBy // Zoom in
        : currentView.scale / scaleBy // Zoom out

    // Calculate new position to keep the point under mouse cursor in the same position
    const newPosition = {
      x: pointer.x - ((pointer.x - currentView.position.x) * newScale) / currentView.scale,
      y: pointer.y - ((pointer.y - currentView.position.y) * newScale) / currentView.scale,
    }

    // Update the room's view state
    setRoomViewStates(prev => ({
      ...prev,
      [currentRoom]: {
        ...prev[currentRoom],
        position: newPosition,
        scale: newScale,
      },
    }))
  }

  /**
   * Handle the end of a group drag operation
   * Saves the new position in the room's state
   */
  const handleDragEnd = (e) => {
    if (!currentRoom) return

    const newPosition = e.target.position()
    setRoomViewStates(prev => ({
      ...prev,
      [currentRoom]: {
        ...prev[currentRoom],
        groupPosition: newPosition,
      },
    }))
  }

  /**
   * Reset the current room's view to the default centered position
   */
  const resetView = () => {
    if (!currentRoom) return

    // Directly set group position
    if (groupRef.current) {
      groupRef.current.position({
        x: stageSize.width / 2,
        y: stageSize.height / 2,
      })
    }

    // Reset the room's state to default
    setRoomViewStates(prev => ({
      ...prev,
      [currentRoom]: {
        ...defaultView,
        groupPosition: {
          x: stageSize.width / 2,
          y: stageSize.height / 2,
        },
      },
    }))
  }

  return {
    currentView, // Current room's view state
    groupRef, // Reference to the Konva Group
    handleWheel, // Zoom handler
    handleDragEnd, // Drag end handler
    resetView, // Reset view handler
  }
}
