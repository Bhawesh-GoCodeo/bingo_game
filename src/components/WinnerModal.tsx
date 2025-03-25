import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../utils/types';
import { useGameModes } from '../context/GameModesContext';

interface WinnerModalProps {
  isOpen: boolean;
  gameState: GameState;
  onClose: () => void;
  onNewGame: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isOpen, gameState, onClose, onNewGame }) => {
  const { state } = useGameModes();
  const { settings, gameMode, timeLeft } = state;

  console.log(" WinnerModal state", state);
  
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  useEffect(() => {
    return () => {
      // Cleanup function
      if ('vibrate' in navigator) {
        navigator.vibrate(0); // Stop any ongoing vibration
      }
    };
  }, []);

  if (gameState.completedLines.length < gameState.requiredLinesToWin) return null;

  // Count the types of winning lines
  const countLineTypes = () => {
    const counts = {
      row: 0,
      column: 0,
      diagonal: 0
    };
    
    gameState.completedLines.forEach(line => {
      counts[line.type]++;
    });
    
    return counts;
  };
  
  const lineCounts = countLineTypes();
  
  // Calculate score based on game mode
  const calculateScore = () => {
    let baseScore = gameState.completedLines.length * 100;
    
    if (gameMode.mode === 'timed' && timeLeft !== null) {
      // Bonus points for time left
      baseScore += timeLeft * 5;
    }
    
    if (gameMode.mode === 'challenge') {
      // Bonus points for challenge mode
      baseScore *= 1.5;
    }
    
    return Math.floor(baseScore);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full mx-2"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={handleModalClick}
          >
            <div className="text-center">
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold text-primary mb-2"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                BINGO!
              </motion.h2>
              
              <motion.div
                className="text-4xl sm:text-6xl mb-3 sm:mb-4"
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.8,
                  times: [0, 0.5, 0.8, 1]
                }}
              >
                🎉🎊🎉
              </motion.div>
              
              <p className="text-base sm:text-lg text-gray-700 mb-2">
                You completed {gameState.completedLines.length} lines!
              </p>
              
              {(gameMode.mode === 'timed' || gameMode.mode === 'challenge') && (
                <motion.div
                  className="text-xl font-bold text-accent mb-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Score: {calculateScore()}
                </motion.div>
              )}
              
              <div className="bg-gray-100 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <p className="font-medium text-gray-800 text-sm sm:text-base">Your winning lines:</p>
                <ul className="text-left mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 text-sm sm:text-base">
                  {lineCounts.row > 0 && (
                    <li className="text-secondary">
                      ✓ {lineCounts.row} Row{lineCounts.row !== 1 ? 's' : ''}
                    </li>
                  )}
                  {lineCounts.column > 0 && (
                    <li className="text-primary">
                      ✓ {lineCounts.column} Column{lineCounts.column !== 1 ? 's' : ''}
                    </li>
                  )}
                  {lineCounts.diagonal > 0 && (
                    <li className="text-accent">
                      ✓ {lineCounts.diagonal} Diagonal{lineCounts.diagonal !== 1 ? 's' : ''}
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center">
                <motion.button
                  className="btn btn-primary text-sm sm:text-base"
                  onClick={onNewGame}
                  whileHover={settings.animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={settings.animationsEnabled ? { scale: 0.95 } : {}}
                >
                  New Game
                </motion.button>
                
                <motion.button
                  className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm sm:text-base"
                  onClick={onClose}
                  whileHover={settings.animationsEnabled ? { scale: 1.05 } : {}}
                  whileTap={settings.animationsEnabled ? { scale: 0.95 } : {}}
                >
                  Continue Playing
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerModal;
