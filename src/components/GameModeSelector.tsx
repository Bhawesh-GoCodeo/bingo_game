import React from 'react';
import { motion } from 'framer-motion';
import { GameModeConfig } from '../utils/types';
import { useGameModes } from '../context/GameModesContext';
import TooltipGuide from './TooltipGuide';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameModeConfig) => void;
  currentMode: GameModeConfig;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode, currentMode }) => {
  const { state } = useGameModes();
  const { settings } = state;
  
  const gameModes: { mode: GameModeConfig; label: string; icon: string; description: string }[] = [
    {
      mode: { mode: 'classic' },
      label: 'Classic',
      icon: '🎮',
      description: 'Complete 5 lines at your own pace'
    },
    {
      mode: { mode: 'timed', timeLimit: 180 },
      label: 'Timed',
      icon: '⏱️',
      description: 'Complete 5 lines within 3 minutes'
    },
    {
      mode: { 
        mode: 'challenge', 
        timeLimit: 120, 
        targetLines: 3,
        difficulty: 'medium'
      },
      label: 'Challenge',
      icon: '🏆',
      description: 'Complete 3 lines within 2 minutes'
    }
  ];
  
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {gameModes.map((gameMode) => (
        <TooltipGuide
          key={gameMode.label}
          content={<div className="p-2 text-sm">{gameMode.description}</div>}
          enabled={settings.tooltipsEnabled}
        >
          <motion.button
            className={`px-3 py-2 rounded-lg font-medium ${
              currentMode.mode === gameMode.mode.mode
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => onSelectMode(gameMode.mode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">{gameMode.icon}</span>
            <span className="text-sm sm:text-base">{gameMode.label}</span>
          </motion.button>
        </TooltipGuide>
      ))}
    </motion.div>
  );
};

export default GameModeSelector;
