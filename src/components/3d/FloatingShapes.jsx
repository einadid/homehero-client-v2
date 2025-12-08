// src/components/3d/FloatingShapes.jsx
import { motion } from 'framer-motion';

const FloatingShapes = () => {
  const shapes = [
    {
      type: 'cube',
      size: 60,
      position: { top: '15%', left: '10%' },
      color: 'bg-primary-500',
      delay: 0,
    },
    {
      type: 'sphere',
      size: 40,
      position: { top: '25%', right: '15%' },
      color: 'bg-accent-cyan',
      delay: 0.5,
    },
    {
      type: 'pyramid',
      size: 50,
      position: { bottom: '30%', left: '5%' },
      color: 'bg-accent-emerald',
      delay: 1,
    },
    {
      type: 'torus',
      size: 45,
      position: { bottom: '20%', right: '10%' },
      color: 'bg-accent-amber',
      delay: 1.5,
    },
    {
      type: 'cube',
      size: 35,
      position: { top: '60%', left: '20%' },
      color: 'bg-accent-rose',
      delay: 2,
    },
  ];

  const Cube = ({ size, color }) => (
    <div
      className="relative preserve-3d"
      style={{ width: size, height: size }}
    >
      <motion.div
        className={`absolute inset-0 ${color}/80 rounded-lg shadow-lg`}
        style={{ transform: 'translateZ(20px)' }}
        animate={{ rotateY: 360, rotateX: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className={`absolute inset-0 ${color}/60 rounded-lg`}
        style={{ transform: 'translateZ(-20px)' }}
      />
    </div>
  );

  const Sphere = ({ size, color }) => (
    <motion.div
      className={`${color}/70 rounded-full shadow-xl`}
      style={{ width: size, height: size }}
      animate={{
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 20px rgba(14, 165, 233, 0.3)',
          '0 0 40px rgba(14, 165, 233, 0.5)',
          '0 0 20px rgba(14, 165, 233, 0.3)',
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  );

  const Pyramid = ({ size, color }) => (
    <motion.div
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid`,
      }}
      className={`${color.replace('bg-', 'border-b-')}/70`}
      animate={{ rotateY: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    />
  );

  const Torus = ({ size, color }) => (
    <motion.div
      className={`${color}/60 rounded-full border-8 border-current`}
      style={{ width: size, height: size }}
      animate={{ rotateX: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    />
  );

  const getShape = (type, size, color) => {
    switch (type) {
      case 'cube':
        return <Cube size={size} color={color} />;
      case 'sphere':
        return <Sphere size={size} color={color} />;
      case 'pyramid':
        return <Pyramid size={size} color={color} />;
      case 'torus':
        return <Torus size={size} color={color} />;
      default:
        return <Sphere size={size} color={color} />;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={shape.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.6,
            scale: 1,
            y: [0, -30, 0],
          }}
          transition={{
            opacity: { delay: shape.delay, duration: 0.5 },
            scale: { delay: shape.delay, duration: 0.5 },
            y: {
              delay: shape.delay,
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {getShape(shape.type, shape.size, shape.color)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingShapes;