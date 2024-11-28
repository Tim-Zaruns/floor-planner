import { useRef, useEffect } from 'react'
import { Rect, Transformer, Text } from 'react-konva'
import { SCALE } from '../constants'

function Furniture({ shapeProps, isSelected, onSelect, onChange }) {
  const shapeRef = useRef()
  const trRef = useRef()

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  const handleDragEnd = (e) => {
    const newPosition = {
      ...shapeProps,
      x: e.target.x() / SCALE,
      y: e.target.y() / SCALE,
    }
    onChange(newPosition)
  }

  return (
    <>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        x={shapeProps.x * SCALE}
        y={shapeProps.y * SCALE}
        width={shapeProps.width * SCALE}
        height={shapeProps.height * SCALE}
        fill={shapeProps.color || '#ddd'}
        draggable
        onDragEnd={handleDragEnd}
        onTransformEnd={(e) => {
          const node = shapeRef.current // Get the current shape

          // When you resize with the transformer, Konva applies scaling
          const scaleX = node.scaleX() // How much it was stretched horizontally
          const scaleY = node.scaleY() // How much it was stretched vertically

          // Reset the scaling back to 1 (normal)
          node.scaleX(1)
          node.scaleY(1)

          // Update the actual width and height instead of using scale
          onChange({
            ...shapeProps,
            x: node.x() / SCALE, // New position
            y: node.y() / SCALE,
            // New width = original width × how much it was stretched
            width: Math.max(5, (node.width() * scaleX) / SCALE),
            // New height = original height × how much it was stretched
            height: Math.max(5, (node.height() * scaleY) / SCALE),
          })
        }}
      />
      <Text
        x={shapeProps.x * SCALE}
        y={shapeProps.y * SCALE - 10}
        width={shapeProps.width * SCALE}
        text={shapeProps.label || ''}
        align="center"
        fontSize={10}
        fill="#000"
        stroke="#000"
        strokeWidth={0.5}
        listening={false}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 * SCALE || Math.abs(newBox.height) < 5 * SCALE) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export default Furniture
