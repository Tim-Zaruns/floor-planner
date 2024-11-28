import { Group, Line, Rect } from 'react-konva';
import { SCALE } from '../constants';

function RoomNew({ type, dimensions, isSelected, points, walls }) {
  if (type === 'rectangular' && dimensions) {
    const { width, height, wallThickness } = dimensions;
    const scaledWidth = width * SCALE;
    const scaledHeight = height * SCALE;
    
    return (
      <Group>
        <Rect
          width={scaledWidth}
          height={scaledHeight}
          offsetX={scaledWidth / 2}
          offsetY={scaledHeight / 2}
          stroke={isSelected ? "#0066cc" : "#333"}
          strokeWidth={isSelected ? 3 : 2}
          fill="#fff"
        />
        <Rect
          width={(width - 2 * wallThickness) * SCALE}
          height={(height - 2 * wallThickness) * SCALE}
          offsetX={(width - 2 * wallThickness) * SCALE / 2}
          offsetY={(height - 2 * wallThickness) * SCALE / 2}
          stroke={isSelected ? "#0066cc" : "#333"}
          strokeWidth={1}
          fill="#fff"
        />
      </Group>
    );
  }

  // For custom rooms
  if (type === 'custom' && points?.length > 0) {
    const linePoints = points.flatMap(point => [
      point.x * SCALE,
      point.y * SCALE
    ]);

    return (
      <Group>
        <Line
          points={linePoints}
          stroke={isSelected ? "#0066cc" : "#333"}
          strokeWidth={isSelected ? 3 : 2}
          closed={points.length > 2}
          fill={points.length > 2 ? "#fff" : undefined}
        />
      </Group>
    );
  }

  return null;
}

export default RoomNew; 