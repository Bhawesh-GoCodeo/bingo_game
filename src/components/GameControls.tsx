import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../utils/types';
import { useGameModes } from '../context/GameModesContext';

interface GameControlsProps {
  onReset: () => void;
  gameState: GameState;
  hasWon: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, gameState, hasWon }) => {
  const { state } = useGameModes();
  const { settings } = state;
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: settings.animationsEnabled ? 1.05 : 1 },
    tap: { scale: settings.animationsEnabled ? 0.95 : 1 }
  };
  
  return (
    <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-2">
      <motion.button
        className="btn btn-primary w-full xs:w-auto text-sm sm:text-base py-2"
        onClick={onReset}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        New Game
      </motion.button>
      
      {!hasWon && gameState.completedLines.length > 0 && (
        <motion.div
          className="text-sm sm:text-lg font-medium text-secondary text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {gameState.completedLines.length} line{gameState.completedLines.length !== 1 ? 's' : ''} completed! 
          <span className="hidden xs:inline"> {gameState.requiredLinesToWin - gameState.completedLines.length} more to win!</span>
        </motion.div>
      )}
      
      {hasWon && (
        <motion.div
          className="text-sm sm:text-lg font-medium text-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🎉 You got 5 BINGOs! 🎉
        </motion.div>
      )}
    </div>
  );
};

export default GameControls;
