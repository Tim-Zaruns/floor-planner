import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Group } from 'react-konva'
import { Button } from '@/components/ui/button'
import RoomNew from './RoomNew'
import Furniture from './Furniture'
import { useFurniture } from '@/hooks/useFurniture'

function Canvas() {
  const containerRef = useRef(null)
  const groupRef = useRef()
  const {
    furniture,
    handleFurnitureChange,
    activeRoom,
    selectedId,
    setSelectedId,
    handleFurnitureDelete,
  } = useFurniture()

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateSize() // Initial size
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  const handleReset = () => {
    setPosition({ x: 0, y: 0 })
    setScale(1)
    if (groupRef.current) {
      groupRef.current.position({
        x: stageSize.width / 2,
        y: stageSize.height / 2,
      })
    }
  }

  const handleWheel = (e) => {
    e.evt.preventDefault()
    const stage = e.target.getStage()
    const pointer = stage.getPointerPosition()
    const scaleBy = 1.1
    const newScale = e.evt.deltaY < 0 ? scale * scaleBy : scale / scaleBy

    setPosition({
      x: pointer.x - ((pointer.x - position.x) * newScale) / scale,
      y: pointer.y - ((pointer.y - position.y) * newScale) / scale,
    })
    setScale(newScale)
  }

  const checkDeselect = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Button variant="secondary" size="sm" onClick={handleReset}>
        Reset View
      </Button>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onWheel={handleWheel}
        x={position.x}
        y={position.y}
        scale={{ x: scale, y: scale }}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {activeRoom && (
            <Group ref={groupRef} x={stageSize.width / 2} y={stageSize.height / 2} draggable>
              <RoomNew {...activeRoom} />
              {furniture.map((item) => (
                <Furniture
                  key={item.id}
                  shapeProps={item}
                  isSelected={item.id === selectedId}
                  onSelect={() => setSelectedId(item.id)}
                  onChange={(newProps) => handleFurnitureChange(item.id, newProps)}
                />
              ))}
            </Group>
          )}
        </Layer>
      </Stage>
    </div>
  )
}

export default Canvas
