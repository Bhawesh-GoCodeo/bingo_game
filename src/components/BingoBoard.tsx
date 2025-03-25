import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BingoCell from './BingoCell';
import { BoardSize, BingoBoard as BingoBoardType, WinningLine, GameState } from '../utils/types';
import { checkForWinningLines, markWinningCells, updateGameState, isGameWon } from '../utils/gameLogic';
import { useGameModes } from '../context/GameModesContext';
import { winFeedback } from '../utils/SensoryFeedback';

interface BingoBoardProps {
  board: BingoBoardType;
  size: BoardSize;
  gameState: GameState;
  onBoardChange: (newBoard: BingoBoardType) => void;
  onGameStateChange: (newGameState: GameState) => void;
  onWin: () => void;
}

const BingoBoard: React.FC<BingoBoardProps> = ({ 
  board, 
  size, 
  gameState,
  onBoardChange, 
  onGameStateChange,
  onWin 
}) => {
  const { state, markCellAction } = useGameModes();
  const { settings, isWildcardActive } = state;
  
  // Get the appropriate grid class based on board size
  const getGridClass = () => {
    switch (size) {
      case 5: return 'grid-board-5';
      case 8: return 'grid-board-8';
      case 10: return 'grid-board-10';
      default: return 'grid-board-5';
    }
  };
  
  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicking on free space
    if (board[row][col].isFreeSpace) return;
    
    markCellAction(row, col);
  };

  // Handle touch start for better mobile experience
  const handleTouchStart = (row: number, col: number) => {
    // Touch handling is managed in the BingoCell component
  };

  // Handle touch end for better mobile experience
  const handleTouchEnd = (row: number, col: number) => {
    // Touch handling is managed in the BingoCell component
  };
  
  // Check for winning lines after each board change
  useEffect(() => {
    const winningLines = checkForWinningLines(board);
    if (winningLines.length > 0) {
      const boardWithWinningCells = markWinningCells(board, winningLines);
      onBoardChange(boardWithWinningCells);
      
      const newGameState = updateGameState(gameState, winningLines);
      onGameStateChange(newGameState);
      
      if (isGameWon(newGameState)) {
        winFeedback(settings);
        onWin();
      }
    }
  }, [board, gameState, onBoardChange, onGameStateChange, onWin, settings]);
  
  return (
    <div className="space-y-3">
      <div className="flex flex-col xs:flex-row justify-between items-center px-1 sm:px-2 gap-2">
        <div className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
          Lines: {gameState.completedLines.length}/{gameState.requiredLinesToWin}
        </div>
        <div className="h-2 w-full flex-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${Math.min(100, (gameState.completedLines.length / gameState.requiredLinesToWin) * 100)}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {isWildcardActive && (
        <motion.div
          className="text-xs sm:text-sm text-center font-medium text-yellow-600 bg-yellow-100 p-1 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Wildcard active! Click a cell to mark it and all adjacent cells.
        </motion.div>
      )}
      
      <motion.div 
        className={`grid gap-1 sm:gap-2 ${getGridClass()} max-w-full mx-auto`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <BingoCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
              onTouchEnd={() => handleTouchEnd(rowIndex, colIndex)}
              size={size}
            />
          ))
        ))}
      </motion.div>
    </div>
  );
};

export default BingoBoard;
