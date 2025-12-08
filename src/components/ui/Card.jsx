// src/components/ui/Card.jsx
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -8, rotateX: 2 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        card-3d
        p-6
        ${glow ? 'glow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;