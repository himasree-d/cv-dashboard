export const formatTime = (timeInSeconds) => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return "00:00.0";
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const fraction = Math.floor((timeInSeconds % 1) * 10);
  
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}.${fraction}`;
};

export const formatConfidence = (score) => {
  if (score === undefined || score === null) return "0.00";
  return score.toFixed(2);
};
