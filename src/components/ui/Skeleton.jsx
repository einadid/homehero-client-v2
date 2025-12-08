// src/components/ui/Skeleton.jsx
const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-light-300 dark:bg-dark-100',
    card: 'bg-light-100 dark:bg-dark-200 border border-light-400 dark:border-dark-100',
    text: 'bg-light-300 dark:bg-dark-100 rounded',
    circle: 'bg-light-300 dark:bg-dark-100 rounded-full',
    image: 'bg-light-300 dark:bg-dark-100',
  };

  return (
    <div className={`animate-pulse ${variants[variant]} ${className}`} />
  );
};

export default Skeleton;