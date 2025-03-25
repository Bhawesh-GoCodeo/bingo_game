import React from 'react';
import { motion } from 'framer-motion';
import { BoardSize } from '../utils/types';

interface BoardSizeSelectorProps {
  currentSize: BoardSize;
  onSizeChange: (size: BoardSize) => void;
}

const BoardSizeSelector: React.FC<BoardSizeSelectorProps> = ({ currentSize, onSizeChange }) => {
  const sizes: BoardSize[] = [5, 8, 10];
  
  return (
    <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-medium text-gray-700">Board Size:</h2>
      <div className="flex gap-1 sm:gap-2">
        {sizes.map((size) => (
          <motion.button
            key={size}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
              currentSize === size
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 active:bg-gray-200'
            }`}
            onClick={() => onSizeChange(size)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {size}x{size}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default BoardSizeSelector;
