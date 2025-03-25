import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PowerUp, PowerUpType } from '../utils/types';
import { isPowerUpAvailable } from '../utils/gameLogic';
import { useGameModes } from '../context/GameModesContext';
import TooltipGuide from './TooltipGuide';

interface PowerUpsProps {
  powerUps: PowerUp[];
  onUsePowerUp: (type: PowerUpType) => void;
}

const PowerUps: React.FC<PowerUpsProps> = ({ powerUps, onUsePowerUp }) => {
  const { state } = useGameModes();
  const { settings } = state;
  
  return (
    <motion.div 
      className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {powerUps.map((powerUp) => {
        const isAvailable = isPowerUpAvailable(powerUp);
        const cooldownRemaining = powerUp.lastUsed 
          ? Math.max(0, Math.ceil((powerUp.cooldown - (Date.now() - powerUp.lastUsed)) / 1000))
          : 0;
        
        return (
          <TooltipGuide
            key={powerUp.type}
            content={
              <div className="p-2 text-sm">
                <p className="font-bold">{powerUp.name}</p>
                <p>{powerUp.description}</p>
                {powerUp.usesLeft > 0 && (
                  <p className="mt-1 text-xs">Uses left: {powerUp.usesLeft}</p>
                )}
                {!isAvailable && powerUp.usesLeft > 0 && (
                  <p className="mt-1 text-xs">Cooldown: {cooldownRemaining}s</p>
                )}
              </div>
            }
            enabled={settings.tooltipsEnabled}
          >
            <motion.button
              className={`relative p-2 sm:p-3 rounded-lg ${
                isAvailable
                  ? 'bg-gradient-to-r from-primary/90 to-primary text-white shadow-md hover:from-primary hover:to-primary/90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => isAvailable && onUsePowerUp(powerUp.type)}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              disabled={!isAvailable}
            >
              <span className="text-xl sm:text-2xl">{powerUp.icon}</span>
              
              {/* Uses left indicator */}
              <AnimatePresence>
                {powerUp.usesLeft > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {powerUp.usesLeft}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Cooldown overlay */}
              <AnimatePresence>
                {!isAvailable && powerUp.usesLeft > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {cooldownRemaining}s
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </TooltipGuide>
        );
      })}
    </motion.div>
  );
};

export default PowerUps;
