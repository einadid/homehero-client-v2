// src/components/3d/AnimatedBackground.jsx
import { motion } from 'framer-motion';

const AnimatedBackground = ({ variant = 'default' }) => {
  const shapes = [
    { size: 'w-72 h-72', position: 'top-20 -left-20', delay: 0 },
    { size: 'w-96 h-96', position: 'top-40 right-0', delay: 0.5 },
    { size: 'w-64 h-64', position: 'bottom-20 left-1/4', delay: 1 },
    { size: 'w-80 h-80', position: '-bottom-20 -right-20', delay: 1.5 },
  ];

  const floatingElements = [...Array(15)].map((_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Large Blurred Shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.size} ${shape.position} rounded-full bg-primary-500/5 blur-3xl`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Mesh Pattern */}
      <div className="absolute inset-0 bg-mesh opacity-30" />

      {/* Floating Particles */}
      {floatingElements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-primary-500/20"
          style={{
            width: el.size,
            height: el.size,
            left: `${el.x}%`,
            top: `${el.y}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid Lines (subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;