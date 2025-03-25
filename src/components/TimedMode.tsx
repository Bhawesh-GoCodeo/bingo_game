import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameModes } from '../context/GameModesContext';
import { timerWarningFeedback } from '../utils/SensoryFeedback';

const TimedMode: React.FC = () => {
  const { state } = useGameModes();
  const { timeLeft, gameMode, settings } = state;
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    if (timeLeft === null || !gameMode.timeLimit) return 100;
    return (timeLeft / gameMode.timeLimit) * 100;
  };
  
  // Get color based on time left
  const getTimeColor = (): string => {
    if (timeLeft === null) return 'text-gray-700';
    if (timeLeft <= 10) return 'text-red-600';
    if (timeLeft <= 30) return 'text-orange-500';
    return 'text-primary';
  };
  
  // Provide warning feedback when time is running low
  useEffect(() => {
    if (timeLeft === 10 || timeLeft === 5) {
      timerWarningFeedback(settings);
    }
  }, [timeLeft, settings]);
  
  if (gameMode.mode !== 'timed' || timeLeft === null) {
    return null;
  }
  
  return (
    <motion.div 
      className="mb-4 px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-600">Time Remaining:</span>
        <span className={`text-lg font-bold ${getTimeColor()}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
      
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${
            timeLeft <= 10 
              ? 'bg-red-500' 
              : timeLeft <= 30 
                ? 'bg-orange-500' 
                : 'bg-primary'
          }`}
          initial={{ width: '100%' }}
          animate={{ 
            width: `${getProgressPercentage()}%` 
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default TimedMode;
