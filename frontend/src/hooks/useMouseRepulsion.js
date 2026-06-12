import { useState, useEffect, useCallback, useRef } from 'react';

const useMouseRepulsion = (ref, maxDistance = 100, maxOffset = 6) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    // Calculate center of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from mouse to center
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < maxDistance) {
      // Repel away from mouse
      const force = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(distY, distX);
      
      // Negative angle to push away
      const moveX = -Math.cos(angle) * force * maxOffset;
      const moveY = -Math.sin(angle) * force * maxOffset;

      setOffset({ x: moveX, y: moveY });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [ref, maxDistance, maxOffset]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return { offset, handleMouseLeave };
};

export default useMouseRepulsion;
