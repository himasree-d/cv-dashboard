export const getHighestConfidenceDetection = (detections) => {
  if (!detections || detections.length === 0) return null;
  return detections.reduce((prev, current) => 
    (prev.confidence > current.confidence) ? prev : current
  );
};

export const getObjectCounts = (detections) => {
  if (!detections || detections.length === 0) return {};
  const counts = {};
  detections.forEach(d => {
    counts[d.class_name] = (counts[d.class_name] || 0) + 1;
  });
  return counts;
};

// Generate a color based on class id for consistent color coding
export const getClassColor = (classId) => {
  const hues = [0, 45, 120, 210, 280, 320]; // Map to specific hues
  const hue = hues[(classId || 0) % hues.length];
  return `hsl(${hue}, 60%, 45%)`;
};
