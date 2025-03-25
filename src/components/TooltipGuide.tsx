import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipGuideProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  enabled?: boolean;
}

const TooltipGuide: React.FC<TooltipGuideProps> = ({ 
  children, 
  content, 
  position = 'top',
  enabled = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  if (!enabled) {
    return <>{children}</>;
  }
  
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      default:
        return 'bottom-full mb-2';
    }
  };
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onTouchStart={() => setIsVisible(true)}
      onTouchEnd={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`absolute z-50 ${getPositionStyles()} min-w-[150px] bg-white rounded-lg shadow-lg border border-gray-200`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            <div className="absolute w-2 h-2 bg-white transform rotate-45 border-gray-200">
              {position === 'top' && <div className="absolute bottom-0 left-1/2 -ml-1 border-t border-l"></div>}
              {position === 'bottom' && <div className="absolute top-0 left-1/2 -ml-1 border-b border-r"></div>}
              {position === 'left' && <div className="absolute right-0 top-1/2 -mt-1 border-l border-t"></div>}
              {position === 'right' && <div className="absolute left-0 top-1/2 -mt-1 border-r border-b"></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TooltipGuide;
