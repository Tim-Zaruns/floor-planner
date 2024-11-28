/**
 * Calculate room area based on room type
 * For rectangular rooms: width * height
 * For custom rooms: Shoelace formula using points
 */
export function calculateArea(room) {
  if (!room) return 0;

  if (room.type === 'rectangular' && room.dimensions) {
    const { width, height } = room.dimensions;
    // Convert to m² (divide by 10000 to convert from cm² to m²)
    return (width * height) / 10000;
  }

  // For custom rooms, use Shoelace formula with points
  if (room.type === 'custom' && room.points?.length > 2) {
    // Create a closed polygon by adding the first point to the end if needed
    const closedPoints = [...room.points];
    if (closedPoints[0].x !== closedPoints[closedPoints.length - 1].x || 
        closedPoints[0].y !== closedPoints[closedPoints.length - 1].y) {
      closedPoints.push(closedPoints[0]);
    }

    let area = 0;
    for (let i = 0; i < closedPoints.length - 1; i++) {
      area += closedPoints[i].x * closedPoints[i + 1].y;
      area -= closedPoints[i + 1].x * closedPoints[i].y;
    }

    // Convert to m² (divide by 20000: 2 for formula, 10000 for cm² to m²)
    return Math.abs(area) / 20000;
  }

  return 0;
} 