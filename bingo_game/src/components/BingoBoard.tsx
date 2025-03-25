import React, { useEffect, useRef, useState } from 'react';
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
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const completedLinesRef = useRef(new Set<string>());
  const hasWonRef = useRef(false);

  const getGridClass = () => {
    switch (size) {
      case 5: return 'grid-board-5';
      case 8: return 'grid-board-8';
      case 10: return 'grid-board-10';
      default: return 'grid-board-5';
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col].isFreeSpace || isProcessingMove) return;
    
    setIsProcessingMove(true);
    markCellAction(row, col);
  };

  useEffect(() => {
    if (!isProcessingMove) return;

    const processMove = () => {
      const winningLines = checkForWinningLines(board);
      
      if (winningLines.length > 0) {
        const newLines = winningLines.filter(line => {
          const lineKey = `${line.type}-${line.index}`;
          return !completedLinesRef.current.has(lineKey);
        });

        if (newLines.length > 0) {
          newLines.forEach(line => {
            const lineKey = `${line.type}-${line.index}`;
            completedLinesRef.current.add(lineKey);
          });

          const boardWithWinningCells = markWinningCells(board, winningLines);
          const newGameState = updateGameState(gameState, newLines);
          
          onBoardChange(boardWithWinningCells);
          onGameStateChange(newGameState);

          if (isGameWon(newGameState) && !hasWonRef.current) {
            hasWonRef.current = true;
            winFeedback(settings);
            onWin();
          }
        }
      }
      
      setIsProcessingMove(false);
    };

    processMove();
  }, [board, isProcessingMove]);

  useEffect(() => {
    completedLinesRef.current.clear();
    hasWonRef.current = false;
    setIsProcessingMove(false);
  }, [size]);

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
              size={size}
            />
          ))
        ))}
      </motion.div>
    </div>
  );
};

export default BingoBoard;
