import React from 'react';
import { motion } from 'framer-motion';
import { BingoCellData } from '../utils/types';
import { useGameModes } from '../context/GameModesContext';

interface BingoCellProps {
  cell: BingoCellData;
  onClick: () => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  size: 5 | 8 | 10;
}

const BingoCell: React.FC<BingoCellProps> = ({ 
  cell, 
  onClick, 
  onTouchStart, 
  onTouchEnd, 
  size 
}) => {
  const { value, isMarked, isFreeSpace, isWinningCell, winningLineIndices, isRevealed } = cell;
  const { state } = useGameModes();
  const { settings, isWildcardActive } = state;
  
  // Determine cell size based on board size
  const getCellSize = () => {
    switch (size) {
      case 5: return 'h-12 sm:h-16 md:h-20';
      case 8: return 'h-9 sm:h-12 md:h-14';
      case 10: return 'h-7 sm:h-10 md:h-12';
      default: return 'h-12 sm:h-16 md:h-20';
    }
  };
  
  // Determine cell class based on state
  const getCellClass = () => {
    if (isWildcardActive) return 'bingo-cell bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300 border-2 border-yellow-400';
    if (isWinningCell) return 'bingo-cell bingo-cell-winning';
    if (isMarked) return 'bingo-cell bingo-cell-marked';
    if (isFreeSpace) return 'bingo-cell bingo-cell-free';
    if (isRevealed) return 'bingo-cell bg-blue-100 hover:bg-blue-200 active:bg-blue-300 border-2 border-blue-300';
    return 'bingo-cell bg-white hover:bg-gray-100 active:bg-gray-200 border-2 border-gray-200';
  };
  
  // Animation variants
  const variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      ...(isWinningCell && settings.animationsEnabled ? { 
        y: [0, -5, 0],
        transition: { 
          y: { repeat: Infinity, duration: 1, repeatType: 'reverse' } 
        }
      } : {})
    },
    tap: { scale: 0.95 },
    revealed: {
      scale: [1, 1.1, 1],
      borderColor: ['#93C5FD', '#3B82F6', '#93C5FD'],
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div
      className={`${getCellClass()} ${getCellSize()}`}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      initial="initial"
      animate={isRevealed && settings.animationsEnabled ? "revealed" : "animate"}
      whileTap={settings.animationsEnabled ? "tap" : undefined}
      variants={variants}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      aria-pressed={isMarked}
    >
      {isFreeSpace ? (
        <span className="text-sm sm:text-lg font-bold">FREE</span>
      ) : (
        <span className={`text-xs sm:text-sm md:text-lg ${isMarked || isWinningCell || isRevealed ? 'font-bold' : ''}`}>
          {value}
        </span>
      )}
      
      {isWinningCell && winningLineIndices.length > 0 && (
        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center bg-accent rounded-full text-white text-xs font-bold">
          {winningLineIndices.length}
        </div>
      )}
      
      {isWildcardActive && (
        <motion.div
          className="absolute inset-0 bg-yellow-400 bg-opacity-20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

export default BingoCell;
