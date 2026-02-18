import { useEffect, useState, useRef } from 'react';

export const useFPS = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef<number | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    // The callback receives a precise timestamp from the engine
    const loop = (timestamp: number) => {
      if (lastTime.current === null) {
        lastTime.current = timestamp;
      }

      frameCount.current++;
      const delta = timestamp - lastTime.current;

      // Update FPS calculation every 1 second (1000ms)
      if (delta >= 1000) {
        const calculatedFps = Math.round((frameCount.current * 1000) / delta);
        setFps(calculatedFps);
        
        // Reset counters
        frameCount.current = 0;
        lastTime.current = timestamp;
      }

      // Continue the loop
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return fps;
};