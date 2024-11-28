export const calculateInitialPosition = (stageSize, contentWidth, contentHeight) => {
  return {
    x: (stageSize.width - contentWidth) / 2,
    y: (stageSize.height - contentHeight) / 2,
  };
};

export const calculateNewScale = (oldScale, delta, limits) => {
  const scaleBy = 1.1;
  const newScale = delta > 0 ? oldScale * scaleBy : oldScale / scaleBy;
  return Math.min(Math.max(limits.min, newScale), limits.max);
}; 