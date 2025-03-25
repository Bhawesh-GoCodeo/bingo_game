import React from 'react';
import { motion } from 'framer-motion';
import { useGameModes } from '../context/GameModesContext';
import TooltipGuide from './TooltipGuide';

const GameSettings: React.FC = () => {
  const { state, toggleSetting } = useGameModes();
  const { settings } = state;
  
  const settingsOptions = [
    {
      key: 'soundEnabled' as const,
      label: 'Sound',
      icon: settings.soundEnabled ? '🔊' : '🔇',
      tooltip: 'Toggle sound effects'
    },
    {
      key: 'vibrationEnabled' as const,
      label: 'Vibration',
      icon: settings.vibrationEnabled ? '📳' : '📴',
      tooltip: 'Toggle vibration feedback'
    },
    {
      key: 'animationsEnabled' as const,
      label: 'Animations',
      icon: settings.animationsEnabled ? '✨' : '🚫',
      tooltip: 'Toggle animations'
    },
    {
      key: 'tooltipsEnabled' as const,
      label: 'Tooltips',
      icon: settings.tooltipsEnabled ? '💬' : '🚫',
      tooltip: 'Toggle tooltips'
    }
  ];
  
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {settingsOptions.map((option) => (
        <TooltipGuide
          key={option.key}
          content={<div className="p-2 text-sm">{option.tooltip}</div>}
          enabled={settings.tooltipsEnabled}
        >
          <motion.button
            className={`p-2 rounded-lg ${
              settings[option.key]
                ? 'bg-gray-700 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => toggleSetting(option.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">{option.icon}</span>
          </motion.button>
        </TooltipGuide>
      ))}
    </motion.div>
  );
};

export default GameSettings;
