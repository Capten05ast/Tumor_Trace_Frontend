

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TextCursor = ({
  text = '⚪️',
  delay = 0.5,
  spacing = 100,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.3,
  removalInterval = 30,
  maxPoints = 3
}) => {
  const [trail, setTrail] = useState([]);
  const lastMoveTimeRef = useRef(Date.now());
  const idCounter = useRef(0);

  const handleMouseMove = e => {
    // Get the scroll position from the window
    const scrollY = window.scrollY;

    // Mouse coordinates are relative to the viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Add scroll position to the Y coordinate to get the position relative to the document
    const documentY = mouseY + scrollY;

    setTrail(prev => {
      let newTrail = [...prev];
      if (newTrail.length === 0) {
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: documentY,
          angle: 0,
          ...(randomFloat && {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5
          })
        });
      } else {
        const last = newTrail[newTrail.length - 1];
        const dx = mouseX - last.x;
        const dy = documentY - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= spacing) {
          let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
          if (rawAngle > 90) rawAngle -= 180;
          else if (rawAngle < -90) rawAngle += 180;
          const computedAngle = followMouseDirection ? rawAngle : 0;
          const steps = Math.floor(distance / spacing);
          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / distance;
            const newX = last.x + dx * t;
            const newY = last.y + dy * t;
            newTrail.push({
              id: idCounter.current++,
              x: newX,
              y: newY,
              angle: computedAngle,
              ...(randomFloat && {
                randomX: Math.random() * 10 - 5,
                randomY: Math.random() * 10 - 5,
                randomRotate: Math.random() * 10 - 5
              })
            });
          }
        }
      }
      if (newTrail.length > maxPoints) {
        newTrail = newTrail.slice(newTrail.length - maxPoints);
      }
      return newTrail;
    });
    lastMoveTimeRef.current = Date.now();
  };

  useEffect(() => {
    // Attach listener to the window
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    // Your component's return statement remains the same.
    <div className="absolute inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {trail.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 1, x: 0, y: 0, rotate: item.angle }}
            animate={{
              opacity: 1,
              scale: 1,
              x: randomFloat ? [0, item.randomX || 0, 0] : 0,
              y: randomFloat ? [0, item.randomY || 0, 0] : 0,
              rotate: randomFloat ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] : item.angle
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              opacity: { duration: exitDuration, ease: 'easeOut', delay },
              ...(randomFloat && {
                x: {
                  duration: 2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'mirror'
                },
                y: {
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'mirror'
                },
                rotate: {
                  duration: 1,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'mirror'
                }
              })
            }}
            className="absolute select-none whitespace-nowrap text-xl"
            style={{ left: item.x, top: item.y }}
          >
            {text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TextCursor;
